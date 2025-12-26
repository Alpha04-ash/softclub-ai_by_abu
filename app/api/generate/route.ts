import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

// Zod schemas
const subjectEnum = z.enum(["JavaScript", "TypeScript", "Python", "C#", "Flutter", "C++"]);

const questionSchema = z.object({
  en: z.object({
    question: z.string().describe("The multiple choice question in English"),
    options: z.array(z.string()).length(4).describe("Four answer options in English"),
    topic: z.string().describe("Topic or concept being tested in English"),
  }),
  ru: z.object({
    question: z.string().describe("The multiple choice question in Russian"),
    options: z.array(z.string()).length(4).describe("Four answer options in Russian"),
    topic: z.string().describe("Topic or concept being tested in Russian"),
  }),
  correctAnswerIndex: z.number().min(0).max(3).describe("Index of the correct option (same for both languages)"),
  difficulty: z.enum(["easy", "medium", "hard"]),
});

const subjectSchema = z.object({
  subject: subjectEnum,
  questions: z.array(questionSchema).min(10),
});

const skillCheckSchema = z.object({
  generatedBy: z.literal("Gemini AI"),
  subjects: z.array(subjectSchema).length(6),
});

// Simple in-memory cache to reduce quota usage (per server process).
let lastGoodPayload: z.infer<typeof skillCheckSchema> | null = null;
let lastGoodAtMs = 0;
const CACHE_TTL_MS = 1000 * 60 * 10; // 10 minutes

// Explicit JSON Schema without $ref/definitions for Gemini responseSchema
// NOTE: Gemini can reject overly constrained schemas ("too many states for serving").
// Keep the responseSchema intentionally minimal and enforce strictness with Zod after parsing.
const jsonSchema = {
  type: "object",
  properties: {
    generatedBy: { type: "string" },
    subjects: {
      type: "array",
      items: {
        type: "object",
        properties: {
          subject: { type: "string" },
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                en: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                    },
                    topic: { type: "string" },
                  },
                },
                ru: {
                  type: "object",
                  properties: {
                    question: { type: "string" },
                    options: {
                      type: "array",
                      items: { type: "string" },
                    },
                    topic: { type: "string" },
                  },
                },
                correctAnswerIndex: { type: "integer" },
                difficulty: { type: "string" },
              },
              required: ["en", "ru", "correctAnswerIndex", "difficulty"],
            },
          },
        },
        required: ["subject", "questions"],
      },
    },
  },
  required: ["generatedBy", "subjects"],
} as const;

/**
 * Generates skill-check questions using Google Gemini AI
 */
async function generateSkillCheckQuestions(): Promise<z.infer<typeof skillCheckSchema>> {
  // Validate API key exists
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required");
  }

  // Initialize Gemini client (v1.x API)
  const genAI = new GoogleGenerativeAI(apiKey);
  const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  // Fallback for overload situations; slightly older but typically more available.
  const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Construct the prompt (include a nonce to encourage variation on each call)
  const nonce = Date.now().toString();
  const randomSeed = Math.random().toString(36).substring(7);
  const prompt = `Generate a comprehensive skill-check assessment with multiple-choice questions for EXACTLY these 6 subjects (include each subject exactly once): JavaScript, TypeScript, Python, C#, Flutter, C++.

IMPORTANT: Generate a WIDE VARIETY of questions covering different topics, concepts, and scenarios. Avoid repeating similar question patterns or topics. Make each question unique and diverse.

**CRITICAL: GENERATE BOTH ENGLISH AND RUSSIAN VERSIONS FOR EACH QUESTION**

For each question, provide:
- "en" object with: "question" (in English), "options" (4 options in English), "topic" (in English)
- "ru" object with: "question" (in Russian), "options" (4 options in Russian), "topic" (in Russian)
- The correctAnswerIndex must be THE SAME for both languages

CRITICAL JSON REQUIREMENTS:
- Output MUST be valid JSON only (no markdown, no code fences, no comments).
- The top-level object MUST include: "generatedBy": "Gemini AI" (EXACT string), and "subjects": [...]
- Do NOT use any other value for generatedBy (not "AI-Assistant", not "Google", not anything else).

For JavaScript: Cover topics like closures, async/await, promises, event loop, hoisting, scope, prototypes, ES6+ features, DOM manipulation, error handling, modules, and more.

For TypeScript: Cover topics like type annotations, interfaces, generics, type inference, enums, unions, intersections, decorators, utility types, type guards, and more.

For Python: Cover topics like list comprehensions, generators, decorators, context managers, exception handling, OOP concepts, data structures, lambda functions, modules, packages, and more.

For C#: Cover topics like LINQ, async/await, tasks, generics, collections, value vs reference types, nullability, exceptions, OOP, interfaces, records, pattern matching, and .NET basics.

For Flutter: Cover topics like widgets, state management (setState, Provider, Riverpod, Bloc), widget lifecycle, layout (Row/Column/Flex), navigation, async/await, isolates basics, and performance best practices. (Use Dart/Flutter context.)

For C++: Cover topics like RAII, pointers/references, const correctness, move semantics, templates, STL containers/algorithms, memory management, smart pointers, compilation/linking basics, and OOP.

Each subject must include exactly 10 questions of mixed difficulty (easy, medium, hard). Total subjects must be exactly 6.

Each question must include exactly four answer options and indicate the correct answer using a zero-based index.

Vary the question styles: some theoretical, some code-based, some scenario-based, some about best practices.

Return the result strictly in valid JSON matching the provided schema.

Do not include explanations or extra text.

Session ID: ${nonce}-${randomSeed}`;

  const generationConfigBase = {
    responseMimeType: "application/json" as const,
    temperature: 0.95,
    topP: 0.95,
    topK: 40,
  };

  const run = async (useSchema: boolean, which: "primary" | "fallback") => {
    const model = which === "primary" ? primaryModel : fallbackModel;
    return await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: useSchema
        ? ({ ...generationConfigBase, responseSchema: jsonSchema as any } as any)
        : (generationConfigBase as any),
    });
  };

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const isOverloadedError = (err: unknown) => {
    const msg = err instanceof Error ? err.message : String(err);
    return (
      msg.includes("[503") ||
      msg.includes("503") ||
      msg.toLowerCase().includes("overloaded") ||
      msg.toLowerCase().includes("service unavailable")
    );
  };

  try {
    // Try with minimal schema first, fall back to no schema if Gemini rejects constraints.
    let result: any;
    const maxAttempts = 4;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        try {
          result = await run(true, "primary");
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes("too many states for serving")) {
            result = await run(false, "primary");
          } else {
            throw err;
          }
        }
        break; // success
      } catch (err) {
        // If overloaded, retry with backoff; on later attempts, switch to fallback model too.
        if (isOverloadedError(err)) {
          const backoffMs = Math.min(8000, 600 * Math.pow(2, attempt - 1));
          const jitterMs = Math.floor(Math.random() * 250);
          await sleep(backoffMs + jitterMs);
          // Try fallback model on attempt 3+
          if (attempt >= 3) {
            try {
              try {
                result = await run(true, "fallback");
              } catch (err2) {
                const msg2 = err2 instanceof Error ? err2.message : String(err2);
                if (msg2.includes("too many states for serving")) {
                  result = await run(false, "fallback");
                } else {
                  throw err2;
                }
              }
              break; // success on fallback
            } catch (err2) {
              if (attempt === maxAttempts) throw err2;
            }
          }
          if (attempt === maxAttempts) throw err;
          continue;
        }
        throw err;
      }
    }

    const response = result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response from Gemini AI");
    }

    // Parse JSON response
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(text);
    } catch (parseError) {
      throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
    }

    // Normalize minor model drift without relaxing validation of the rest of the schema.
    // We still strictly validate everything with Zod; this only ensures the required literal is present.
    if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
      const obj = parsedData as Record<string, unknown>;
      if (obj.generatedBy !== 'Gemini AI') {
        obj.generatedBy = 'Gemini AI';
      }
    }

    // Validate using Zod schema
    const validatedData = skillCheckSchema.parse(parsedData);

    // Cache successful payload to reduce API calls when user retries.
    lastGoodPayload = validatedData;
    lastGoodAtMs = Date.now();

    return validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Schema validation failed:");
      console.error(JSON.stringify(error.errors, null, 2));
      throw new Error(`Invalid response structure: ${error.message}`);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred during question generation");
  }
}

export async function GET() {
  try {
    // Serve cached content if it's still fresh.
    if (lastGoodPayload && Date.now() - lastGoodAtMs < CACHE_TTL_MS) {
      return NextResponse.json(lastGoodPayload);
    }

    const skillCheckData = await generateSkillCheckQuestions();
    return NextResponse.json(skillCheckData);
  } catch (error) {
    console.error("Error generating skill-check questions:", error);
    const msg = error instanceof Error ? error.message : "Failed to generate questions";

    // If quota is exceeded but we have a cached payload (even if stale), serve it to keep UX working.
    const quotaHit =
      msg.includes("[429") ||
      msg.includes("429") ||
      msg.toLowerCase().includes("quota") ||
      msg.toLowerCase().includes("too many requests");

    if (quotaHit && lastGoodPayload) {
      return NextResponse.json(lastGoodPayload);
    }

    return NextResponse.json(
      {
        error: quotaHit
          ? "Gemini API quota exceeded. Please wait a bit or enable billing / use a paid plan, then try again."
          : msg,
      },
      { status: quotaHit ? 429 : 500 }
    );
  }
}


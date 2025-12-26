import { NextResponse } from 'next/server';
import { getResults, addResult, getResultsByUsername } from '@/lib/db';
import type { Result } from '@/lib/db';

// GET - Fetch results
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const role = searchParams.get('role');

    // If admin, return all results
    if (role === 'admin') {
      const allResults = getResults();
      return NextResponse.json({ results: allResults });
    }

    // If user, return only their results
    if (username) {
      const userResults = getResultsByUsername(username);
      return NextResponse.json({ results: userResults });
    }

    return NextResponse.json({ results: [] });
  } catch (error) {
    console.error('Get results error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch results' },
      { status: 500 }
    );
  }
}

// POST - Save a new result
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, subject, score, totalQuestions, percentage, answers } = body;

    // Validation
    if (!username || !subject || score === undefined || !totalQuestions || !answers) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newResult: Result = {
      id: `result_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      subject,
      score,
      totalQuestions,
      percentage: percentage || Math.round((score / totalQuestions) * 100),
      date: new Date().toISOString(),
      answers,
    };

    addResult(newResult);

    return NextResponse.json({
      success: true,
      result: newResult,
    });
  } catch (error) {
    console.error('Save result error:', error);
    return NextResponse.json(
      { error: 'Failed to save result' },
      { status: 500 }
    );
  }
}


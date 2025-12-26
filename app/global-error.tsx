'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#fafafa] px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10">
              <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                Application error
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                A fatal error occurred while rendering the application shell.
              </p>

              <button
                onClick={reset}
                className="px-5 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
              >
                Reload
              </button>

              <div className="mt-6 text-xs text-gray-400">
                <div>Digest: {error.digest ?? 'n/a'}</div>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}




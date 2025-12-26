'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">
                Something went wrong
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                An unexpected error occurred. You can try again or go back home.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={reset}
                  className="px-5 py-2.5 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-colors text-sm"
                >
                  Try again
                </button>
                <Link
                  href="/"
                  className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
                >
                  Back to home
                </Link>
              </div>
            </div>

            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-400">Error digest</p>
              <p className="text-xs font-mono text-gray-500">{error.digest ?? 'n/a'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




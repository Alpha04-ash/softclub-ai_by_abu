import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fafafa] px-4 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10">
          <h1 className="text-2xl font-light text-gray-900 mb-2 tracking-tight">Page not found</h1>
          <p className="text-gray-500 text-sm mb-6">
            The page you’re looking for doesn’t exist or was moved.
          </p>
          <Link
            href="/"
            className="inline-flex px-5 py-2.5 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}




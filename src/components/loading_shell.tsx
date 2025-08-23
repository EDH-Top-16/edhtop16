import React from 'react';

export function LoadingShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customize this to match your app's layout */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="animate-pulse">
          <div className="mb-6 h-8 w-64 rounded bg-gray-300"></div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} className="rounded-lg bg-white p-6 shadow">
                <div className="mb-3 h-4 w-3/4 rounded bg-gray-300"></div>
                <div className="mb-2 h-4 w-1/2 rounded bg-gray-300"></div>
                <div className="h-4 w-2/3 rounded bg-gray-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator */}
      <div className="bg-opacity-10 pointer-events-none fixed inset-0 flex items-center justify-center bg-black">
        <div className="rounded-lg bg-white p-6 text-center shadow-lg">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    </div>
  );
}

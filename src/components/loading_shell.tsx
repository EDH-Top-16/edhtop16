import React from 'react';

export function LoadingShell() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customize this to match your app's layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Loading indicator */}
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center pointer-events-none">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your preferences...</p>
        </div>
      </div>
    </div>
  );
}

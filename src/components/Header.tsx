'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';

export const Header = () => {
  const { clearMessages } = useChatStore();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl animate-pulse"></div>
                <div className="absolute inset-0.5 bg-white rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  AI Educational Chat
                </h1>
                <p className="text-sm text-gray-500">Powered by Gemini AI</p>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowConfirm(true)}
            className="group px-4 py-2 rounded-xl bg-gradient-to-r from-rose-100 to-teal-100 hover:from-rose-200 hover:to-teal-200 transition-all duration-300"
          >
            <span className="bg-gradient-to-r from-rose-500 to-teal-500 bg-clip-text text-transparent font-medium">
              Clear Chat
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl p-6 max-w-sm mx-4 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Clear Chat History?
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone. All messages will be permanently deleted.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearMessages();
                  setShowConfirm(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}; 
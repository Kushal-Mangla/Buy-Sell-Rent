import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-1 w-full"></div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-100 text-yellow-600 rounded-full p-4">
              <AlertTriangle size={64} strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            404 - Page Not Found
          </h1>
          
          <p className="text-gray-600 mb-6">
            Oops! The page you are looking for seems to have wandered off. 
            It might have been moved, deleted, or never existed.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Return to Home
            </Link>
            <Link 
              to="/support" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
import React from 'react';
import { Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

function NotAuthorized() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-gray-700 to-gray-900 h-1 w-full"></div>
        
        <div className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 text-red-600 rounded-full p-4">
              <Lock size={64} strokeWidth={1.5} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Access Denied
          </h1>
          
          <p className="text-gray-600 mb-6">
            You do not have permission to access this page. 
            Please contact your administrator if you believe this is an error.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/" 
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </Link>
            <Link 
              to="/user/login" 
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotAuthorized;
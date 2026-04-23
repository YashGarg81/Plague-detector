import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-3">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You do not have permission to view this page. Teacher-only tools are
          restricted to teacher accounts.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 rounded bg-primary text-white hover:bg-blue-700"
          >
            Go to Dashboard
          </Link>
          <Link
            to="/"
            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;

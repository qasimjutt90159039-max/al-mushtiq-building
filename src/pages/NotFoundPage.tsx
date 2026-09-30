import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
      <SEO title="404 — Page Not Found" />
      <span className="font-mono text-5xl font-black text-[#F28C28]">404</span>
      <h1 className="font-display text-2xl font-bold text-gray-900">
        Page Not Found
      </h1>
      <p className="text-xs text-gray-500 leading-relaxed">
        The page you're looking for could not be found or has been moved.
      </p>
      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/shop"
          className="px-5 py-2.5 bg-[#F28C28] hover:bg-[#d9771e] text-white font-bold text-xs rounded-lg transition-colors"
        >
          Back to Shop
        </Link>
        <Link
          to="/"
          className="px-5 py-2.5 bg-[#17191C] hover:bg-[#28323A] text-white font-bold text-xs rounded-lg transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  variant?: 'light' | 'dark';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', className = '' }) => {
  const isLight = variant === 'light';

  return (
    <Link to="/" className={`flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Architectural construction icon */}
      <div className="w-10 h-10 rounded bg-[#17191C] border border-[#28323A] flex items-center justify-center p-2 relative overflow-hidden shadow-sm group-hover:border-[#F28C28] transition-colors shrink-0">
        <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
          {/* Structural Gable / Beam Frame */}
          <path d="M4 26 L16 6 L28 26 Z" stroke="#F28C28" strokeWidth="2.5" strokeLinejoin="round" />
          {/* Internal Cross Bracing */}
          <line x1="8" y1="19" x2="24" y2="19" stroke="#F4B942" strokeWidth="2" />
          <line x1="16" y1="6" x2="16" y2="26" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="3 2" />
          {/* Foundation Slab */}
          <rect x="2" y="26" width="28" height="3" fill="#F28C28" rx="0.5" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-display text-xl font-black tracking-tight leading-tight transition-colors ${
          isLight ? 'text-white group-hover:text-[#F28C28]' : 'text-[#17191C] group-hover:text-[#F28C28]'
        }`}>
          AL MUSHTAQ
        </span>
        <span className={`text-[10px] font-bold tracking-widest uppercase ${
          isLight ? 'text-gray-400' : 'text-[#6B7280]'
        }`}>
          BUILDING MATERIAL STORE
        </span>
      </div>
    </Link>
  );
};

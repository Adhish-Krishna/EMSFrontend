import React from 'react';

interface PointerProps {
  text: string;
  className?: string;
}

const Pointer: React.FC<PointerProps> = ({ text, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Triangle pointer */}
      <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-r-[12px] border-r-emerald-400 border-b-[8px] border-b-transparent" />
      
      {/* Text container */}
      <div className="bg-gradient-to-r from-emerald-500/30 to-emerald-700/10 pl-4 pr-6 py-2 rounded-r-md">
        <h3 className="text-emerald-300 font-semibold tracking-wide">
          {text}
        </h3>
      </div>
    </div>
  );
};

export default Pointer;
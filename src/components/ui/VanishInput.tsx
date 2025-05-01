import React, { useState, useRef } from 'react';

interface VanishInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const VanishInput: React.FC<VanishInputProps> = ({ 
  placeholder, 
  value, 
  onChange,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => {
    if (value === '') {
      setIsFocused(false);
    }
  };
  const placeholderClass = isFocused || value !== '' 
    ? 'translate-y-[-20px] scale-75 text-emerald-400'
    : 'translate-y-0 scale-100 text-gray-400';

  return (
    <div className={`relative ${className}`}>
      <span 
        className={`absolute  transition-all duration-300 ease-in-out ${placeholderClass} pointer-events-none origin-left`}
        onClick={() => inputRef.current?.focus()}
      >
        {placeholder}
      </span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="w-full bg-transparent border-b-2 border-gray-700 focus:border-emerald-400 py-2 px-3 text-white outline-none transition-all duration-300"
      />
    </div>
  );
};

export default VanishInput;
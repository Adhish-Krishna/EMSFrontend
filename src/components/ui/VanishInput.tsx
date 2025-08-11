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
    ? 'translate-y-[-20px] scale-75 text-blue-500'
    : 'translate-y-0 scale-100 text-blue-300';

  return (
    <div className={`relative ${className}`}>
      <span 
        className={`absolute transition-all duration-300 ease-in-out ${placeholderClass} pointer-events-none origin-left`}
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
        className="w-full bg-white border-b-2 border-blue-700 focus:border-blue-500 py-2 px-3 text-blue-900 outline-none transition-all duration-300"
      />
    </div>
  );
};

export default VanishInput;
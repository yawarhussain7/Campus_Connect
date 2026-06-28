import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function ModernSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
  icon,
  required = false,
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (isOpen) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < options.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : options.length - 1
        );
      } else if (e.key === 'Enter' && highlightedIndex >= 0) {
        e.preventDefault();
        onChange(options[highlightedIndex].value);
        setIsOpen(false);
      }
    }
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={selectRef}>
      {label && (
        <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-700 uppercase tracking-wider mb-2">
          {icon && <span className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />}
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full bg-white border-2 border-slate-200 text-sm rounded-2xl 
          px-4 py-3 text-left font-medium transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500
          hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5
          flex items-center justify-between group relative overflow-hidden
          ${!value ? 'text-slate-400' : 'text-slate-800'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
        <span className="truncate relative z-10">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="relative z-10 flex items-center gap-2">
          {value && (
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse" />
          )}
          <ChevronDown 
            className={`h-5 w-5 text-slate-400 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-indigo-500' : 'group-hover:text-indigo-500'
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border-2 border-indigo-100 rounded-2xl shadow-2xl shadow-indigo-500/20 overflow-hidden"
          style={{ 
            animation: 'fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: '300px',
            overflowY: 'auto'
          }}
        >
          <div className="p-1.5 bg-gradient-to-br from-indigo-50/30 to-purple-50/20">
            {options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  w-full px-4 py-2.5 text-left text-sm font-semibold transition-all duration-150
                  flex items-center justify-between rounded-xl
                  ${value === option.value 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/40 scale-[1.02]' 
                    : highlightedIndex === index
                    ? 'bg-indigo-50 text-indigo-900 scale-[1.01]'
                    : 'text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-900'
                  }
                `}
              >
                <span className="truncate">{option.label}</span>
                {value === option.value && (
                  <Check className="h-4 w-4 text-white flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, FileText } from 'lucide-react';

export default function PaperSelect({ 
  label, 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option",
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
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className={`
          w-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 text-sm rounded-xl 
          px-4 py-3 text-left font-medium transition-all duration-300
          focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500
          hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10
          flex items-center justify-between group relative overflow-hidden
          ${!value ? 'text-slate-400' : 'text-slate-800'}
        `}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <span className="truncate relative z-10 flex items-center gap-2">
          {!value && <FileText className="h-4 w-4 text-slate-400" />}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className="relative z-10 flex items-center gap-2">
          {value && (
            <div className="h-2 w-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
          )}
          <ChevronDown 
            className={`h-5 w-5 text-slate-400 transition-all duration-300 ${
              isOpen ? 'rotate-180 text-blue-500' : 'group-hover:text-blue-500'
            }`} 
          />
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-3 bg-white border-2 border-blue-100 rounded-xl shadow-2xl shadow-blue-300/40 overflow-hidden"
          style={{ 
            animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            maxHeight: '280px',
            overflowY: 'auto'
          }}
        >
          <div className="p-2 bg-gradient-to-br from-blue-50/30 to-white">
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
                  w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200
                  flex items-center justify-between rounded-lg mb-1 last:mb-0
                  ${value === option.value 
                    ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30' 
                    : highlightedIndex === index
                    ? 'bg-blue-50 text-slate-800'
                    : 'text-slate-600 hover:bg-blue-50/50'
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
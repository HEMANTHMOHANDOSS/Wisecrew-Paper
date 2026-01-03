
import React from 'react';

interface PremiumInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  options?: string[];
}

export const PremiumInput: React.FC<PremiumInputProps> = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  required,
  options
}) => {
  const commonClasses = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all duration-200 text-slate-700 dark:text-slate-100 shadow-sm placeholder:text-slate-300 dark:placeholder:text-slate-600 text-sm";

  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {options ? (
        <div className="relative group">
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`${commonClasses} appearance-none cursor-pointer group-hover:border-slate-300 dark:group-hover:border-slate-600`}
            required={required}
          >
            <option value="" className="dark:bg-slate-800">Select {label}</option>
            {options.map(opt => <option key={opt} value={opt} className="dark:bg-slate-800">{opt}</option>)}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-600 transition-colors group-hover:text-purple-500 dark:group-hover:text-purple-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={commonClasses}
          required={required}
        />
      )}
    </div>
  );
};

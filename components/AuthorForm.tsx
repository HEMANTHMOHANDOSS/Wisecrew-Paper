
import React from 'react';
import { Author } from '../types';
import { PremiumInput } from './PremiumInput';

interface AuthorFormProps {
  data: Author;
  onChange: (updated: Partial<Author>) => void;
  title: string;
  description?: string;
}

export const AuthorForm: React.FC<AuthorFormProps> = ({ data, onChange, title, description }) => {
  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
        {description && <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">{description}</p>}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PremiumInput label="Full Name" value={data.name} onChange={v => onChange({name: v})} required />
        <PremiumInput label="Register Number" value={data.regNo} onChange={v => onChange({regNo: v})} required />
        <PremiumInput label="Contact Number" type="tel" value={data.contactNo} onChange={v => onChange({contactNo: v})} required />
        <PremiumInput label="Email Address" type="email" value={data.email} onChange={v => onChange({email: v})} required />
        <PremiumInput label="Department" value={data.dept} onChange={v => onChange({dept: v})} required />
        <PremiumInput label="Degree" value={data.degree} onChange={v => onChange({degree: v})} required />
        <PremiumInput label="Specialization" value={data.specialization} onChange={v => onChange({specialization: v})} required />
        <PremiumInput label="Year" options={['I', 'II', 'III', 'IV']} value={data.year} onChange={v => onChange({year: v})} required />
        <div className="md:col-span-2">
          <PremiumInput label="College Name" value={data.college} onChange={v => onChange({college: v})} required />
        </div>
      </div>
    </div>
  );
};

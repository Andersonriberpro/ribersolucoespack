
import React from 'react';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder = 'Buscar...' }) => {
    return (
        <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input
                type="text"
                placeholder={placeholder}
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-sm transition-colors"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
};

export default SearchInput;


import React from 'react';

interface EmptyStateProps {
    icon: string;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, message }) => {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 transition-colors">
            <i className={`fas ${icon} text-5xl mb-4 opacity-20`}></i>
            <p className="font-medium">{message}</p>
        </div>
    );
};

export default EmptyState;

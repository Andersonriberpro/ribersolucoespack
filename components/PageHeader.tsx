
import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, children }) => {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">{title}</h2>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">{subtitle}</p>
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </header>
  );
};

export default PageHeader;

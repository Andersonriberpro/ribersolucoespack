
import React from 'react';

interface NavbarProps {
    isDarkMode: boolean;
    toggleTheme: () => void;
    userName: string;
}

const Navbar: React.FC<NavbarProps> = ({ isDarkMode, toggleTheme, userName }) => {
    return (
        <header className="mb-8 flex justify-between items-center">
            <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3 transition-colors">
                <i className="fas fa-calendar-alt text-indigo-500"></i>
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                    {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <button
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all"
                    title={isDarkMode ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                >
                    <i className={`fas ${isDarkMode ? 'fa-sun text-amber-400' : 'fa-moon'}`}></i>
                </button>

                <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm transition-all">
                    <i className="fas fa-bell"></i>
                </button>

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>

                <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition group relative">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-500">{userName}</span>
                    <i className="fas fa-chevron-down text-xs text-slate-400"></i>
                </div>
            </div>
        </header>
    );
};

export default Navbar;


import React from 'react';

interface ModalOverlayProps {
    children: React.ReactNode;
    variant?: 'default' | 'print';
    className?: string;
}

const ModalOverlay: React.FC<ModalOverlayProps> = ({ children, variant = 'default', className }) => {
    const baseClasses = className
        ? className
        : variant === 'print'
            ? 'fixed inset-0 z-[100] flex flex-col items-center bg-slate-900/80 backdrop-blur-md overflow-y-auto p-4 md:p-10 no-print'
            : 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4';

    return (
        <div className={baseClasses}>
            {children}
        </div>
    );
};

export default ModalOverlay;

import React from 'react';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export default function PageHeader({ title, children, className = '' }: PageHeaderProps) {
  return (
    <header className={`bg-gray-950 shadow-md py-6 mb-8 ${className}`}>
      <h1 className="text-[1.375rem] sm:text-4xl font-extrabold text-center text-purple-300 tracking-tight">{title}</h1>
      {children && <div className="mt-2 flex flex-col items-center">{children}</div>}
    </header>
  );
} 
import React from "react";

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
}

export default function PageHeader({
  title,
  children,
  className = "",
  leftSlot,
  rightSlot,
}: PageHeaderProps) {
  return (
    <header
      className={`sticky top-0 z-40 w-full shadow-md py-2 h-14 ${className} bg-gradient-to-b from-[#233524] via-[#1a241b] to-[#2d4a3e]`}
      style={{ minHeight: "56px" }}
    >
      <div className="relative flex items-center w-full mx-auto px-2">
        {/* Left slot: absolute on sm+ */}
        <div className="flex-shrink-0 flex items-center min-w-[40px] h-10 sm:absolute sm:left-2 sm:static">
          {leftSlot}
        </div>
        <h1 className="flex-1 text-xl sm:text-2xl font-extrabold text-center text-accent tracking-tight">
          {title}
        </h1>
        {/* Right slot: absolute on sm+ */}
        <div className="flex-shrink-0 flex items-center min-w-[40px] h-10 justify-end sm:absolute sm:right-2 sm:static">
          {rightSlot}
        </div>
      </div>
      {children && (
        <div className="mt-2 flex flex-col items-center">{children}</div>
      )}
    </header>
  );
}
 
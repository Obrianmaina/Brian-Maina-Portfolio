import React, { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContent: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

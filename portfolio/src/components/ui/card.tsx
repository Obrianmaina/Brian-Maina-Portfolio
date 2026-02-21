import React from "react";

export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({
  children,
  className = "",
  onClick,
}) => (
  <div
    className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition p-4 ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex flex-col gap-2 ${className}`}>{children}</div>
);
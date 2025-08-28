import React, { ButtonHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "default" | "outline";
}

export const Button: React.FC<ButtonProps> = ({ children, variant = "default", className, ...props }) => {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-700",
    outline: "border border-teal-600 text-gray-900 hover:bg-teal-50",
  };

  return (
    <button className={clsx(baseStyles, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};

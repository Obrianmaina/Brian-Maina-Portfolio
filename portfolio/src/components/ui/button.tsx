import { ButtonProps } from "@/types";

const Button: React.FC<ButtonProps> = ({ children, variant = "default", className = "", ...props }) => {
  const baseStyles = "px-4 py-2 rounded-full font-medium transition disabled:opacity-50";
  const variants = {
    default: "bg-gray-900 text-white hover:bg-gray-700",
    outline: "border border-teal-600 text-gray-900 hover:bg-teal-50",
  };
  return (
    <button className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;


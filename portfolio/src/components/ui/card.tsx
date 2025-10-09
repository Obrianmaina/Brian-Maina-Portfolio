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

export const CardContent: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);


import React from "react";
import clsx from "clsx";

interface GradientTextProps {
  children: React.ReactNode;
  size?: string;
  weight?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ children, size = "text-2xl", weight = "font-extrabold" }) => {
  return (
    <span
      className={clsx(
        "font-poppins bg-gradient-to-r from-blue-200 via-blue-300 via-blue-500 via-blue-700 to-blue-900 bg-clip-text text-transparent animate-gradient",
        size,
        weight
      )}
      style={{ backgroundSize: "200% 200%" }} 
    >
      {children}
    </span>
  );
};

export default GradientText;

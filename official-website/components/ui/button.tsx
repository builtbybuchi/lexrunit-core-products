import React from 'react';

type ButtonProps = {
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({ asChild, className, children }) => {
  if (asChild) {
    // when used asChild we expect the caller to provide the anchor/button element
    return <>{children}</>;
  }

  return (
    <button className={className}>
      {children}
    </button>
  );
};

export default Button;

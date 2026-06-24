import React from 'react';

type TabsProps = {
  defaultValue?: string;
  className?: string;
  children?: React.ReactNode;
};

export const Tabs: React.FC<TabsProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

export const TabsList: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const TabsTrigger: React.FC<{ value?: string; children?: React.ReactNode }> = ({ children }) => (
  <button type="button" className="px-3 py-2">
    {children}
  </button>
);

export const TabsContent: React.FC<{ value?: string; className?: string; children?: React.ReactNode }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export default Tabs;

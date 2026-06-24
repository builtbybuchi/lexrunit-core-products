import React from 'react';

export const Card: React.FC<{ className?: string; children?: React.ReactNode }> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

export const CardHeader: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const CardTitle: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-semibold">{children}</h3>
);

export const CardDescription: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <p className="text-sm text-muted-foreground">{children}</p>
);

export const CardContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div>{children}</div>
);

export default Card;

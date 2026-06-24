
import React from 'react';

const iconProps = {
    className: "w-6 h-6 text-lex-med-blue",
    strokeWidth: "2",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const BriefcaseIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
    </svg>
);


import React from 'react';

const iconProps = {
    className: "w-8 h-8",
    strokeWidth: "2",
    fill: "none",
    stroke: "currentColor",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
};

export const HospitalIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M8 3H5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3m8-15h3a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-3m-4 0v-4m-2 0h4m-2-4v4m-5 4h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2z"/>
    </svg>
);

export const PatientAppIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
        <line x1="12" y1="18" x2="12.01" y2="18"></line>
        <path d="M12 14l-2.5 2.5m5 0L12 14m0-4.5V14"/>
        <path d="M10 8h4"/>
    </svg>
);

export const AiDoctorIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        <line x1="9" y1="10" x2="15" y2="10"></line>
        <line x1="12" y1="7" x2="12" y2="13"></line>
    </svg>
);

export const TelecomIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
);

export const CommunityIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a3 3 0 0 0-2-2.83" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

export const SchoolIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <path d="M4 10l8-5 8 5-8 5-8-5z" />
        <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
        <path d="M20 10v6" />
        <path d="M2 22h20" />
    </svg>
);

export const RegistryIcon: React.FC = () => (
    <svg {...iconProps} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.6 9h16.8" />
        <path d="M3.6 15h16.8" />
        <path d="M12 3a14 14 0 0 1 0 18" />
        <path d="M12 3a14 14 0 0 0 0 18" />
    </svg>
);

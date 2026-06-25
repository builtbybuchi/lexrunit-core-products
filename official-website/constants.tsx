
import React from 'react';
import { AiDoctorIcon, CommunityIcon, HospitalIcon, PatientAppIcon, RegistryIcon, SchoolIcon } from './components/icons/ProductIcons';

export const navLinks = [
  { id: 'lexcare-hms', title: "L'hopital" },
  { id: 'products/dr-andre', title: 'Dr. Andre' },
];

export const products = [
  {
    id: 'lexcare-hms',
    icon: <HospitalIcon />,
    title: "L'hopital",
    description: 'A comprehensive Hospital Management System for digitizing and automating medical processes with agility.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1771806699/3_bcjbtw.png',
    href: '/lexcare-hms',
  },
  {
    id: 'lexcare-patients',
    icon: <PatientAppIcon />,
    title: 'LexCare',
    description: 'Empowering patients by providing easy and direct access to hospital services and their health records.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1771806698/1_qqwqjt.png',
    href: '/lexcare-patients',
  },
  {
    id: 'dr-andre',
    icon: <AiDoctorIcon />,
    title: 'Dr. Andre',
    description: 'Your personal medical AI, offering answers and consultations directly through WhatsApp for instant access.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1775344548/Dr_Andre_hj5naj.jpg',
    href: '/products/dr-andre',
  },
  {
    id: 'partner-portal',
    icon: <HospitalIcon />,
    title: 'Partner Portal',
    description: 'Join our ecosystem as a partner hospital. Manage your profile, view leads, and streamline your patient intake process.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/v1771801535/cropped_rkyltz.png',
    href: '/partner',
  },
];

export const nonMedicalInitiatives = [
  {
    id: 'sinod',
    icon: <CommunityIcon />,
    title: "Sinod'",
    description: 'A community management platform for events, forms, documents, newsletters, quizzes, certificates, and AI-assisted workflows.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1771854019/3_jy0mnr.png',
    href: '/products/sinod',
  },
  {
    id: 'academicx',
    icon: <SchoolIcon />,
    title: 'academicX',
    description: 'A school management system built for modern schools, with tools for enrollment, grading, attendance, messaging, and result publishing.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1773427661/square-image_butlfh.jpg',
    href: '/products/academicx',
  },
  {
    id: 'drave-registry',
    icon: <RegistryIcon />,
    title: 'Drave Registry',
    description: 'A domain name and professional email service provider with tools for registration, transfers, portfolio management, and business mail.',
    imageSrc: 'https://res.cloudinary.com/dlvffw5wt/image/upload/q_auto/f_auto/v1774576890/Primary_Logo_fj823n.png',
    href: '/products/drave-registry',
  },
];

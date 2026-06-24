import React from 'react';
import Hero from '../components/Hero';
import Philosophy from '../components/Philosophy';
import WhatsAppSection from '../components/WhatsAppSection';
import HospitalSearchSection from '../components/HospitalSearchSection';
import HMSSection from '../components/HMSSection';
import PatientAppSection from '../components/PatientAppSection';
import HigsSection from '../components/HigsSection';

const HomePage: React.FC = () => {
  return (
    <>
      <Hero />
      <HospitalSearchSection />
      <HMSSection />
      <PatientAppSection />
      <HigsSection />
      <WhatsAppSection />
      <Philosophy />
    </>
  );
};

export default HomePage;

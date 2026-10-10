import React from 'react';
import { LanguageProvider } from '../context/LanguageContext';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { Philosophy } from './Philosophy';
import { FeaturedProject } from './FeaturedProject';
import { Capabilities } from './Capabilities';
import { Milestones } from './Milestones';
import { News } from './News';
import { StudioTeam } from './StudioTeam';
import { Contact } from './Contact';
import { Footer } from './Footer';

export const CompanyProfileApp: React.FC = () => {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#0F172A] selection:bg-[#192C56] selection:text-white antialiased">
        <Navbar />
        <main className="flex-1">
          <Hero />
          <Philosophy />
          <FeaturedProject />
          <Capabilities />
          <Milestones />
          <News />
          <StudioTeam />
          <Contact />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
};

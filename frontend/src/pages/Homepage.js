import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import TopHeader from '../components/TopHeader';
import HeroSection from '../components/home/HeroSection';
import CoreTechnologies from '../components/home/CoreTechnologies';
import GovernmentCarousel from '../components/home/GovernmentCarousel';
import FeaturesSection from '../components/home/FeaturesSection';
import WorkflowSection from '../components/home/WorkflowSection';
import TechStackSection from '../components/home/TechStackSection';
import UserRolesSection from '../components/home/UserRolesSection';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import AboutSystemSection from '../components/home/AboutSystemSection';
import DevelopersSection from '../components/home/DevelopersSection';
import Footer from '../components/home/Footer';
import AIChatbot from '../components/home/AIChatbot';

const Homepage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Login handlers
  const handleVoterLogin = () => {
    navigate('/voter-login');
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-purple-50 dark:from-navy-900 dark:via-navy-800 dark:to-navy-700 overflow-hidden transition-colors duration-300">
      {/* Top Header */}
      <TopHeader />

      {/* Hero Section */}
      <HeroSection 
        onVoterLogin={handleVoterLogin}
        onAdminLogin={handleAdminLogin}
      />

      {/* Core Technologies Section */}
      <CoreTechnologies />

      {/* Government-Style Carousel */}
      <GovernmentCarousel />

      {/* Features Section */}
      <FeaturesSection />

      {/* Workflow Section */}
      <WorkflowSection />

      {/* Tech Stack Section */}
      <TechStackSection />

      {/* User Roles Comparison */}
      <UserRolesSection />

      {/* Live Statistics */}
      <StatsSection />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* About System Teaser */}
      <AboutSystemSection />

      {/* Developers Showcase */}
      <DevelopersSection />

      {/* Footer */}
      <Footer />

      {/* AI Chatbot */}
      <AIChatbot />
    </div>
  );
};

export default Homepage;

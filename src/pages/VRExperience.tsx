import React from 'react';
import { VRExperience } from '../components/vr/vr-experience';
import '../styles/vr-experience.css';
import PageLayout from '@/components/PageLayout';

const ArVrExperiencePage: React.FC = () => {
  return (
    <PageLayout>
      <div className="ar-vr-experience-page">
        <VRExperience />
      </div>
    </PageLayout>
  );
};

export default ArVrExperiencePage;
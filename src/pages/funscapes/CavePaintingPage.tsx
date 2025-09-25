import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CavePainting } from '@/components/funscapes/games/CavePainting';
import PageLayout from '@/components/PageLayout';

const CavePaintingPage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBack = () => {
    navigate('/funscapes');
  };

  const handleScoreUpdate = (points: number) => {
    // Store score in sessionStorage
    const savedProgress = sessionStorage.getItem("jharkhand-games-progress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        progress.userScore = (progress.userScore || 0) + points;
        sessionStorage.setItem("jharkhand-games-progress", JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to update score:", error);
      }
    } else {
      sessionStorage.setItem(
        "jharkhand-games-progress",
        JSON.stringify({
          userScore: points,
          gamesCompleted: [],
          gameStats: {}
        })
      );
    }
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      navigate('/funscapes');
    };
    
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  return (
    <PageLayout>
      <CavePainting 
        onBack={handleBack}
        onScoreUpdate={handleScoreUpdate}
      />
    </PageLayout>
  );
};

export default CavePaintingPage;
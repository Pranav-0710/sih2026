import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { EcoExplorer } from '@/components/funscapes/games/EcoExplorer';
import PageLayout from '@/components/PageLayout';

const EcoExplorerPage: React.FC = () => {
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
  
  const handleGameComplete = () => {
    // Mark game as completed in sessionStorage
    const savedProgress = sessionStorage.getItem("jharkhand-games-progress");
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (!progress.gamesCompleted.includes("eco-explorer")) {
          progress.gamesCompleted.push("eco-explorer");
        }
        sessionStorage.setItem("jharkhand-games-progress", JSON.stringify(progress));
      } catch (error) {
        console.error("Failed to update completed games:", error);
      }
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
      <EcoExplorer 
        onBack={handleBack}
        onScoreUpdate={handleScoreUpdate}
        onGameComplete={handleGameComplete}
      />
    </PageLayout>
  );
};

export default EcoExplorerPage;
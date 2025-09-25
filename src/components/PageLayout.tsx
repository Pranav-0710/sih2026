import React from 'react';
import Navigation from './Navigation';

interface PageLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
  noTopPadding?: boolean; // Use this for pages like Home that don't need top padding
  noBackground?: boolean; // Use this to disable the solid background color
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  fullHeight = true,
  noTopPadding = false,
  noBackground = false
}) => {
  return (
    <div className={`${fullHeight ? 'min-h-screen' : ''} ${noBackground ? '' : 'bg-white dark:bg-black'}`}>
      <Navigation />
      <div className={noTopPadding ? '' : 'page-content'}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
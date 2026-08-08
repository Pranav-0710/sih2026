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
  /*
   * This was hardcoded to raw `bg-white dark:bg-black`, not the themed
   * `bg-background` token — predates the Lamplight redesign and was never
   * caught because most pages set their own inner background and painted
   * over it. But 7 pages (Cookies, Dashboard, Privacy, Profile,
   * ReportCondition, Terms, VRExperience) have no inner background of
   * their own, so they rendered directly against this: pure white in
   * light mode, pure black in dark mode, instead of this site's actual
   * parchment/lamplit palette. Fixing it here fixes all of them at once
   * rather than patching each page.
   */
  return (
    <div className={`${fullHeight ? 'min-h-screen' : ''} ${noBackground ? '' : 'bg-background'}`}>
      <Navigation />
      <div className={noTopPadding ? '' : 'page-content'}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
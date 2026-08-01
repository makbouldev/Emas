import { createContext, useContext } from 'react';

export const SiteDataContext = createContext(null);

export const useSiteData = () => {
  const value = useContext(SiteDataContext);
  if (!value) {
    throw new Error('useSiteData must be used inside SiteDataContext.Provider');
  }
  return value;
};
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { fallbackData } from '../data/fallbackData';

export const useSiteContent = () => {
  const [content, setContent] = useState(fallbackData);
  const apiBaseUrl = useMemo(() => {
    if (import.meta.env.VITE_API_URL !== undefined) {
      return import.meta.env.VITE_API_URL;
    }
    return import.meta.env.DEV ? 'http://localhost:5000' : '';
  }, []);
  const normalizeHeroImage = (data) => ({
    ...data,
    hero: {
      ...(data?.hero || {}),
      backgroundImage: data?.hero?.backgroundImage || 'hero.jpeg'
    }
  });

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/site-content`);
        setContent(normalizeHeroImage(response.data));
      } catch (error) {
        console.error('Using fallback content due to API error:', error.message);
      }
    };

    loadContent();
  }, [apiBaseUrl]);

  return { content, apiBaseUrl };
};


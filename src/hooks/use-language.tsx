'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface LanguageContextType {
  currentLanguageId: string | null;
  currentLanguageCode: string | null;
  isLoading: boolean;
  error: string | null;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [currentLanguageId, setCurrentLanguageId] = useState<string | null>(null);
  const [currentLanguageCode, setCurrentLanguageCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentLanguage = async () => {
      try {
        const languageCode = process.env.NEXT_PUBLIC_LANGUAGE;
        
        if (!languageCode) {
          setError('Language not configured in environment');
          setIsLoading(false);
          return;
        }

        const response = await fetch('/api/languages');
        if (!response.ok) {
          throw new Error('Failed to fetch languages');
        }
        
        const languages = await response.json();
        const currentLanguage = languages.find((lang: any) => lang.code === languageCode);
        
        if (!currentLanguage) {
          setError(`Language with code '${languageCode}' not found`);
          setIsLoading(false);
          return;
        }

        setCurrentLanguageId(currentLanguage.id);
        setCurrentLanguageCode(currentLanguage.code);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load language');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentLanguage();
  }, []);

  const value: LanguageContextType = {
    currentLanguageId,
    currentLanguageCode,
    isLoading,
    error,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
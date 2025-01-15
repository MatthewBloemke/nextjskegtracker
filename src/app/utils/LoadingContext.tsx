'use client';
import { Backdrop, CircularProgress } from '@mui/material';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoadingContextType {
  setLoading: (isLoading: boolean) => void;
  isLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const value = {
    isLoading,
    setLoading: setIsLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={isLoading}>
        <div>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

import React, { createContext, useContext, useState } from 'react';

interface AuthDialogContextType {
  isOpen: boolean;
  openAuthDialog: () => void;
  closeAuthDialog: () => void;
}

const AuthDialogContext = createContext<AuthDialogContextType | undefined>(undefined);

export const useAuthDialog = () => {
  const context = useContext(AuthDialogContext);
  if (context === undefined) {
    throw new Error('useAuthDialog must be used within an AuthDialogProvider');
  }
  return context;
};

export const AuthDialogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const openAuthDialog = () => setIsOpen(true);
  const closeAuthDialog = () => setIsOpen(false);

  return (
    <AuthDialogContext.Provider value={{ isOpen, openAuthDialog, closeAuthDialog }}>
      {children}
    </AuthDialogContext.Provider>
  );
}; 
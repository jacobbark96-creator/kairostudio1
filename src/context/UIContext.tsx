import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isContactModalOpen: boolean;
  contactModalPreill: string; // Used for the locked offer title
  openContactModal: (prefill?: string) => void;
  closeContactModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalPreill, setContactModalPrefill] = useState('');

  const openContactModal = (prefill: string = '') => {
    setContactModalPrefill(prefill);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactModalPrefill('');
  };

  return (
    <UIContext.Provider
      value={{
        isContactModalOpen,
        contactModalPreill,
        openContactModal,
        closeContactModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

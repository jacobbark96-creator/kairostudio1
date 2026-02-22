import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isContactModalOpen: boolean;
  contactModalPreill: string; // Used for the locked offer title
  offerPrice?: number;
  openContactModal: (prefill?: string, price?: number) => void;
  closeContactModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalPreill, setContactModalPrefill] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | undefined>(undefined);

  const openContactModal = (prefill: string = '', price?: number) => {
    setContactModalPrefill(prefill);
    setOfferPrice(price);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactModalPrefill('');
    setOfferPrice(undefined);
  };

  return (
    <UIContext.Provider
      value={{
        isContactModalOpen,
        contactModalPreill,
        offerPrice,
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

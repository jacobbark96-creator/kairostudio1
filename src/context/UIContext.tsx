"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isContactModalOpen: boolean;
  contactModalPreill: string; // Used for the locked offer title
  offerPrice?: number;
  metadata?: any;
  openContactModal: (prefill?: string, price?: number, metadata?: any) => void;
  closeContactModal: () => void;
  isJackpot: boolean;
  triggerJackpot: (status: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactModalPreill, setContactModalPrefill] = useState('');
  const [offerPrice, setOfferPrice] = useState<number | undefined>(undefined);
  const [metadata, setMetadata] = useState<any>(undefined);
  const [isJackpot, setIsJackpot] = useState(false);

  const openContactModal = (prefill: string = '', price?: number, metadata?: any) => {
    console.log('UIContext - openContactModal called with:', { prefill, price, metadata });
    setContactModalPrefill(prefill);
    setOfferPrice(price);
    setMetadata(metadata);
    setIsContactModalOpen(true);
  };

  const triggerJackpot = (status: boolean) => {
    setIsJackpot(status);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setContactModalPrefill('');
    setOfferPrice(undefined);
    setMetadata(undefined);
  };

  return (
    <UIContext.Provider
      value={{
        isContactModalOpen,
        contactModalPreill,
        offerPrice,
        metadata,
        openContactModal,
        closeContactModal,
        isJackpot,
        triggerJackpot
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

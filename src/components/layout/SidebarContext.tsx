'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SidebarContextType = {
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Close sidebar by default on mobile screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle toggle button click
  useEffect(() => {
    const toggleButton = document.getElementById('sidebar-toggle');
    
    const handleToggleClick = () => {
      setIsOpen(prev => !prev);
    };
    
    if (toggleButton) {
      toggleButton.addEventListener('click', handleToggleClick);
      
      return () => {
        toggleButton.removeEventListener('click', handleToggleClick);
      };
    }
  }, []);
  
  const toggle = () => setIsOpen(prev => !prev);
  const close = () => setIsOpen(false);
  
  return (
    <SidebarContext.Provider value={{ isOpen, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
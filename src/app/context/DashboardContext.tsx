import React, { createContext, useContext, useState } from 'react';

type DashboardContextType = {
  activeSidebarItem: string;
  setActiveSidebarItem: (item: string) => void;
  uploadOpen: boolean;
  setUploadOpen: (open: boolean) => void;
};

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeSidebarItem, setActiveSidebarItem] = useState('my-drive');
  const [uploadOpen, setUploadOpen] = useState(false);

  return (
    <DashboardContext.Provider value={{
      activeSidebarItem,
      setActiveSidebarItem,
      uploadOpen,
      setUploadOpen
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}

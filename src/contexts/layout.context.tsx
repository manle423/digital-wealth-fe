"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface LayoutContextType {
  showHeader: boolean;
  setShowHeader: (show: boolean) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [showHeader, setShowHeader] = useState<boolean>(true);

  return (
    <LayoutContext.Provider value={{ showHeader, setShowHeader }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error("useLayout phải được sử dụng trong LayoutProvider");
  }
  return context;
} 
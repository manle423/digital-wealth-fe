"use client";
import { useLayout } from "@/contexts/layout.context";
import Header from "./header";

export default function ConditionalHeader() {
  const { showHeader } = useLayout();
  
  if (!showHeader) {
    return null;
  }
  
  return <Header />;
} 
"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { PiAuthProvider, usePiAuth } from "@/contexts/pi-auth-context";
import { AuthLoadingScreen } from "./auth-loading-screen";

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(['username', 'payments'], (payment: any) => {
        console.log("Incomplete payment checked:", payment);
      }).catch((err: any) => {
        console.error("Scope request failed:", err);
      });
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return <AuthLoadingScreen />;
  return <>{children}</>;
}

export default function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <PiAuthProvider>
      <AppContent>{children}</AppContent>
    </PiAuthProvider>
  );
}

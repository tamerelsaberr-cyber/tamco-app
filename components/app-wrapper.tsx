
"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { usePiAuth, PiAuthProvider } from "@/contexts/pi-auth-context";
import { AuthLoadingScreen } from "./auth-loading-screen";

function AppContent({ children }: { children: ReactNode }) {
  const { isAuthenticated } = usePiAuth();

  useEffect(() => {
    // نتحقق من وجود مكتبة باي، ونطلب فقط اسم المستخدم عند فتح التطبيق لأول مرة
    if (typeof window !== "undefined" && (window as any).Pi) {
      (window as any).Pi.authenticate(["username"], (payment: any) => {
        console.log("Incomplete payment checked:", payment);
      }).catch((err: any) => {
        console.error("Authentication failed:", err);
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
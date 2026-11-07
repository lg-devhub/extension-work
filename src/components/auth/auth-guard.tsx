"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Loader2 } from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { currentSession, isHydrated } = useDespensa();

  useEffect(() => {
    if (isHydrated && !currentSession) {
      router.replace("/login");
    }
  }, [isHydrated, currentSession, router]);

  if (!isHydrated || !currentSession) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-forest text-white shadow-sm">
          <Leaf className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 text-body-sm font-medium text-text-secondary">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span>Verificando sessão de acesso...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

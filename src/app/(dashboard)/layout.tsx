import React from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { AppHeader } from "@/components/layout/app-header";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { AuthGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <AppHeader />
          <main className="flex-1 px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7 pb-24 lg:pb-10 max-w-[1440px] w-full mx-auto">
            {children}
          </main>
        </div>
        <MobileNavigation />
      </div>
    </AuthGuard>
  );
}

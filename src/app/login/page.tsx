import React from "react";
import type { Metadata } from "next";
import { LoginView } from "@/components/auth/login-view";

export const metadata: Metadata = {
  title: "Login | Despensa+",
  description: "Faça login para acessar seu painel no Despensa+.",
};

export default function LoginPage() {
  return <LoginView />;
}

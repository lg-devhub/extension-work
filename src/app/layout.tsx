import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { DespensaProvider } from "@/hooks/use-despensa";
import { ToastViewport } from "@/components/ui/toast-viewport";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Despensa+ | Gestão Doméstica de Alimentos e Redução de Desperdício",
  description:
    "Plataforma de controle de estoque doméstico, listas de compras, alertas de validade e combate ao desperdício alimentar — Projeto de Extensão Faculdade de Tecnologia SENAI Félix Guisard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-text-primary antialiased">
        <DespensaProvider>
          {children}
          <ToastViewport />
        </DespensaProvider>
      </body>
    </html>
  );
}

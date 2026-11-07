"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Leaf,
  Loader2,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { useDespensa } from "@/hooks/use-despensa";
import { cn } from "@/lib/utils";

export function LoginView() {
  const router = useRouter();
  const { login, currentSession, isHydrated } = useDespensa();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isHydrated && currentSession) {
      router.replace("/dashboard");
    }
  }, [isHydrated, currentSession, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Preencha seu e-mail de acesso e sua senha para entrar.");
      setShakeKey((prev) => prev + 1);
      return;
    }

    setIsSubmitting(true);

    window.setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setIsSubmitting(false);
        setErrorMessage(
          result.error ?? "E-mail ou senha incorretos. Tente novamente."
        );
        setShakeKey((prev) => prev + 1);
        return;
      }
      router.replace("/dashboard");
    }, 420);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#F4F3EA] flex flex-col lg:flex-row select-none">
      {/* Subtle organic background shapes and contour lines */}
      <svg
        className="pointer-events-none absolute -top-24 -right-24 h-[420px] w-[420px] text-[#E6E5D8] animate-float-slow"
        viewBox="0 0 400 400"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M280 20C350 60 390 150 370 240C350 330 260 390 170 370C80 350 20 260 40 170C60 80 210 -20 280 20Z"
          fill="currentColor"
          fillOpacity="0.55"
        />
        <path
          d="M310 50C370 95 400 185 375 270C350 355 255 405 170 380"
          stroke="#6A7B6E"
          strokeOpacity="0.35"
          strokeWidth="1.2"
        />
      </svg>

      <svg
        className="pointer-events-none absolute -bottom-28 right-1/3 h-[360px] w-[480px] text-[#EAE8DC] animate-float-slow"
        viewBox="0 0 500 380"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M60 320C120 210 260 190 380 260C460 305 490 365 490 380H10C10 365 30 350 60 320Z"
          fill="currentColor"
          fillOpacity="0.7"
        />
      </svg>

      {/* Left diagonal visual panel (Desktop) */}
      <div className="relative hidden lg:flex lg:w-[50%] xl:w-[52%] min-h-screen items-center animate-slide-in-left">
        {/* Outer translucent diagonal layer */}
        <div
          className="absolute inset-0 bg-[#2C4C38]/25"
          style={{
            clipPath: "polygon(0 0, 96% 0, 56% 100%, 0% 100%)",
          }}
          aria-hidden="true"
        />

        {/* Main angled panel with realistic shelving illustration + deep forest green tint */}
        <div
          className="relative h-full w-full flex items-center px-12 xl:px-20 overflow-hidden bg-[#183D2B]"
          style={{
            clipPath: "polygon(0 0, 88% 0, 48% 100%, 0% 100%)",
          }}
        >
          {/* Atmospheric warehouse/pantry shelves background pattern */}
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage: `
                linear-gradient(115deg, rgba(16, 42, 29, 0.88) 0%, rgba(24, 61, 43, 0.72) 55%, rgba(44, 78, 57, 0.85) 100%),
                repeating-linear-gradient(0deg, transparent, transparent 68px, rgba(255,255,255,0.12) 68px, rgba(255,255,255,0.12) 72px),
                repeating-linear-gradient(90deg, transparent, transparent 110px, rgba(255,255,255,0.1) 110px, rgba(255,255,255,0.1) 115px)
              `,
            }}
            aria-hidden="true"
          />

          {/* Decorative 3D perspective storage boxes & shelves SVG */}
          <svg
            className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-25"
            viewBox="0 0 800 900"
            fill="none"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
          >
            <g stroke="#D9E2DC" strokeWidth="2">
              <line x1="60" y1="0" x2="60" y2="900" strokeWidth="5" />
              <line x1="250" y1="0" x2="250" y2="900" strokeWidth="5" />
              <line x1="440" y1="0" x2="440" y2="900" strokeWidth="5" />
              <line x1="630" y1="0" x2="630" y2="900" strokeWidth="4" />

              <line x1="0" y1="150" x2="750" y2="210" strokeWidth="4" />
              <line x1="0" y1="330" x2="750" y2="380" strokeWidth="4" />
              <line x1="0" y1="510" x2="750" y2="550" strokeWidth="4" />
              <line x1="0" y1="690" x2="750" y2="720" strokeWidth="4" />
            </g>
            {/* Storage boxes on shelves */}
            <g fill="#C8B89A" fillOpacity="0.45" stroke="#EFECE4" strokeOpacity="0.3">
              <rect x="85" y="75" width="70" height="72" rx="4" />
              <rect x="165" y="88" width="65" height="62" rx="4" />
              <rect x="275" y="95" width="75" height="70" rx="4" />
              <rect x="360" y="108" width="60" height="60" rx="4" />

              <rect x="80" y="250" width="80" height="78" rx="4" />
              <rect x="170" y="265" width="60" height="68" rx="4" />
              <rect x="275" y="270" width="72" height="74" rx="4" />
              <rect x="358" y="282" width="65" height="66" rx="4" />

              <rect x="82" y="430" width="74" height="76" rx="4" />
              <rect x="168" y="442" width="64" height="68" rx="4" />
              <rect x="275" y="445" width="80" height="75" rx="4" />

              <rect x="85" y="610" width="78" height="76" rx="4" />
              <rect x="172" y="618" width="62" height="70" rx="4" />
            </g>
          </svg>

          {/* Soft radial light */}
          <div
            className="pointer-events-none absolute -left-20 top-1/3 h-96 w-96 rounded-full bg-[#3F6849]/35 blur-3xl"
            aria-hidden="true"
          />

          {/* Brand Lockup matching reference image */}
          <div className="relative z-10 flex items-center gap-5 rounded-2xl bg-[#112C1F]/65 backdrop-blur-md px-7 py-6 border border-white/10 shadow-2xl max-w-md animate-fade-slide-up">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#0D261A] border border-white/15 text-white shadow-inner">
              <Leaf className="h-9 w-9 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-white">
                Despensa+
              </h1>
              <p className="mt-1 text-base font-medium text-white/85 tracking-wide">
                Controle. Organize. Cresça.
              </p>
            </div>
          </div>
        </div>

        {/* Diagonal subtle contour line matching the reference */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line
            x1="99"
            y1="0"
            x2="59"
            y2="100"
            stroke="#8B9D8B"
            strokeOpacity="0.45"
            strokeWidth="0.25"
          />
          <line
            x1="0"
            y1="76"
            x2="38"
            y2="100"
            stroke="#FFFFFF"
            strokeOpacity="0.22"
            strokeWidth="0.2"
          />
        </svg>
      </div>

      {/* Right column: Login Card */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-10 sm:px-8 lg:px-12">
        <div
          key={shakeKey}
          className={cn(
            "w-full max-w-[430px] rounded-2xl border border-[#E5E6DF] bg-surface p-7 sm:p-9 shadow-[0_20px_50px_rgba(24,61,43,0.08)] transition-all duration-300 animate-fade-slide-up-delayed",
            errorMessage && "animate-shake"
          )}
        >
          {/* Card Header with Logo & Title */}
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#123322] text-white shadow-sm transition-transform duration-300 hover:scale-105">
                <Leaf className="h-6 w-6 stroke-[2.2]" />
              </div>
              <span className="font-heading text-3xl font-bold tracking-tight text-[#123322]">
                Despensa+
              </span>
            </div>

            <p className="mt-3.5 text-body font-medium text-[#5A655D]">
              Faça login para acessar seu painel
            </p>
          </div>

          {errorMessage ? (
            <div
              role="alert"
              className="mt-5 flex items-start gap-2.5 rounded-DEFAULT border border-danger/30 bg-danger-subtle px-3.5 py-2.5 text-caption text-danger"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-5"
            noValidate
          >
            <div className="space-y-1.5">
              <label
                htmlFor="login-email-input"
                className="flex items-center gap-2 text-caption font-semibold text-[#2C3A30]"
              >
                <Mail className="h-4 w-4 text-[#2C3A30]" />
                <span>Email</span>
              </label>
              <input
                id="login-email-input"
                type="text"
                inputMode="email"
                autoComplete="username"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="Digite seu e-mail"
                className="flex h-11 w-full rounded-DEFAULT border border-[#D8DDD5] bg-[#FAFBF9] px-3.5 py-2 text-body-sm text-text-primary placeholder:text-[#9AA198] transition-all duration-200 focus:border-[#183D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183D2B]/15"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="login-password-input"
                className="flex items-center gap-2 text-caption font-semibold text-[#2C3A30]"
              >
                <Lock className="h-4 w-4 text-[#2C3A30]" />
                <span>Senha</span>
              </label>
              <div className="relative">
                <input
                  id="login-password-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Digite sua senha"
                  className="flex h-11 w-full rounded-DEFAULT border border-[#D8DDD5] bg-[#FAFBF9] pl-3.5 pr-10 py-2 text-body-sm text-text-primary placeholder:text-[#9AA198] transition-all duration-200 focus:border-[#183D2B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#183D2B]/15"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Ocultar senha" : "Mostrar senha"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm p-1 text-[#737C73] transition-colors hover:text-[#183D2B] focus:outline-none"
                >
                  {showPassword ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex h-11 w-full items-center justify-center gap-2 rounded-DEFAULT bg-[#123322] px-4 text-body-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#183D2B] hover:shadow-md active:scale-[0.99] disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                    <span>Entrar</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

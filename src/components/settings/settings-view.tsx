"use client";

import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Bell,
  Building2,
  Eye,
  EyeOff,
  Home,
  Lock,
  RotateCcw,
  Save,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DEFAULT_ADMIN_ACCOUNT } from "@/data/mock-data";
import { formatDateBR } from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";
import type { SystemUserAccount } from "@/types/auth";

export function SettingsView() {
  const {
    preferences,
    updatePreferences,
    resetDemoData,
    currentSession,
    userAccounts,
    createUserAccount,
    deleteUserAccount,
  } = useDespensa();

  const isAdmin = currentSession?.role === "admin";

  const [householdName, setHouseholdName] = useState(preferences.householdName);
  const [userName, setUserName] = useState(preferences.userName);
  const [userEmail, setUserEmail] = useState(preferences.userEmail);
  const [residentsCount, setResidentsCount] = useState(
    String(preferences.residentsCount)
  );
  const [alertDays, setAlertDays] = useState(
    String(preferences.alertDaysBeforeExpiration)
  );
  const [goalPct, setGoalPct] = useState(
    String(preferences.monthlyWasteReductionGoalPct)
  );
  const [enableLowStock, setEnableLowStock] = useState(
    preferences.enableLowStockAlerts
  );
  const [enableExpiration, setEnableExpiration] = useState(
    preferences.enableExpirationNotifications
  );
  const [enableWeekly, setEnableWeekly] = useState(
    preferences.enableWeeklySummary
  );
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountPassword, setNewAccountPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [accountFormError, setAccountFormError] = useState<string | null>(null);
  const [accountToDelete, setAccountToDelete] =
    useState<SystemUserAccount | null>(null);

  useEffect(() => {
    setHouseholdName(preferences.householdName);
    setUserName(currentSession?.name ?? preferences.userName);
    setUserEmail(currentSession?.email ?? preferences.userEmail);
    setResidentsCount(String(preferences.residentsCount));
    setAlertDays(String(preferences.alertDaysBeforeExpiration));
    setGoalPct(String(preferences.monthlyWasteReductionGoalPct));
    setEnableLowStock(preferences.enableLowStockAlerts);
    setEnableExpiration(preferences.enableExpirationNotifications);
    setEnableWeekly(preferences.enableWeeklySummary);
  }, [preferences, currentSession]);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences({
      householdName: householdName.trim() || "Minha Residência",
      userName: userName.trim() || "Usuário",
      userEmail: userEmail.trim(),
      residentsCount: Math.max(1, Number(residentsCount) || 1),
      alertDaysBeforeExpiration: Math.max(1, Number(alertDays) || 7),
      monthlyWasteReductionGoalPct: Math.min(
        95,
        Math.max(5, Number(goalPct) || 35)
      ),
      enableLowStockAlerts: enableLowStock,
      enableExpirationNotifications: enableExpiration,
      enableWeeklySummary: enableWeekly,
    });
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountFormError(null);

    const result = createUserAccount({
      name: newAccountName,
      email: newAccountEmail,
      password: newAccountPassword,
    });

    if (!result.success) {
      setAccountFormError(
        result.error ?? "Não foi possível criar a conta de usuário."
      );
      return;
    }

    setNewAccountName("");
    setNewAccountEmail("");
    setNewAccountPassword("");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Personalize os parâmetros da residência, regras de alertas de validade e gerencie permissões de acesso ao sistema."
        badge={
          isAdmin ? (
            <Badge variant="forest">
              <ShieldCheck className="h-3.5 w-3.5" />
              Acesso Administrador
            </Badge>
          ) : (
            <Badge variant="muted">Conta de Usuário</Badge>
          )
        }
      />

      {isAdmin ? (
        <Card className="p-5 sm:p-6 border-forest/25 bg-surface space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-DEFAULT bg-forest text-white">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-heading text-section-title font-bold text-text-primary">
                    Gerenciamento de Contas de Usuários
                  </h2>
                  <Badge variant="forest">Exclusivo Administrador</Badge>
                </div>
                <p className="mt-0.5 text-caption text-text-secondary">
                  Crie contas de usuário para acessar este mesmo sistema. Contas de usuário possuem todas as funcionalidades do painel, exceto criar ou gerenciar novos acessos.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            <form
              onSubmit={handleCreateUserSubmit}
              className="xl:col-span-5 rounded-lg border border-border bg-surface-secondary/50 p-4 space-y-3.5"
              noValidate
            >
              <div className="flex items-center gap-2">
                <UserPlus className="h-4 w-4 text-forest" />
                <h3 className="font-heading text-card-title font-bold text-text-primary">
                  Criar Nova Conta de Usuário
                </h3>
              </div>

              {accountFormError ? (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded-DEFAULT border border-danger/30 bg-danger-subtle p-2.5 text-caption text-danger"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{accountFormError}</span>
                </div>
              ) : null}

              <div>
                <label
                  htmlFor="new-user-name"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Nome do Usuário *
                </label>
                <Input
                  id="new-user-name"
                  placeholder="Ex.: Mariana Oliveira"
                  value={newAccountName}
                  onChange={(e) => {
                    setNewAccountName(e.target.value);
                    if (accountFormError) setAccountFormError(null);
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="new-user-email"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  E-mail ou Login de Acesso *
                </label>
                <Input
                  id="new-user-email"
                  type="text"
                  placeholder="Ex.: mariana@despensa.local"
                  value={newAccountEmail}
                  onChange={(e) => {
                    setNewAccountEmail(e.target.value);
                    if (accountFormError) setAccountFormError(null);
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="new-user-password"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Senha de Acesso *
                </label>
                <div className="relative">
                  <Input
                    id="new-user-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Mínimo de 4 caracteres"
                    value={newAccountPassword}
                    onChange={(e) => {
                      setNewAccountPassword(e.target.value);
                      if (accountFormError) setAccountFormError(null);
                    }}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={
                      showNewPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-sm p-1 text-text-secondary hover:text-text-primary"
                  >
                    {showNewPassword ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full">
                <UserPlus className="h-4 w-4" />
                Cadastrar Conta de Usuário
              </Button>
            </form>

            <div className="xl:col-span-7 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-card-title font-bold text-text-primary">
                  Contas Ativas no Sistema ({userAccounts.length})
                </h3>
                <span className="text-caption text-text-secondary">
                  Mesmo estoque compartilhado
                </span>
              </div>

              <div className="divide-y divide-border rounded-lg border border-border bg-surface overflow-hidden">
                {userAccounts.map((acc) => {
                  const isRootAdmin =
                    acc.id === DEFAULT_ADMIN_ACCOUNT.id || acc.role === "admin";
                  return (
                    <div
                      key={acc.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 hover:bg-surface-secondary/40 transition-colors"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-DEFAULT bg-surface-secondary border border-border text-forest font-bold text-caption">
                          {isRootAdmin ? (
                            <ShieldCheck className="h-4 w-4 text-forest" />
                          ) : (
                            <UserCheck className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-body-sm font-semibold text-text-primary truncate">
                              {acc.name}
                            </p>
                            <Badge
                              variant={isRootAdmin ? "forest" : "info"}
                            >
                              {isRootAdmin
                                ? "Administrador"
                                : "Usuário Padrão"}
                            </Badge>
                          </div>
                          <p className="text-caption text-text-secondary truncate">
                            Login: <strong className="text-text-primary">{acc.email}</strong>{" "}
                            • Criado em {formatDateBR(acc.createdAt)}
                          </p>
                        </div>
                      </div>

                      {!isRootAdmin ? (
                        <Button
                          type="button"
                          variant="danger-outline"
                          size="sm"
                          onClick={() => setAccountToDelete(acc)}
                          className="shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Revogar Acesso
                        </Button>
                      ) : (
                        <span className="text-[11px] font-medium text-text-muted shrink-0">
                          Conta Principal Fixa
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="p-4 sm:p-5 border-border bg-surface-secondary/50">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-DEFAULT bg-surface border border-border text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <div>
              <h2 className="font-heading text-card-title font-bold text-text-primary">
                Permissão de Conta: Usuário Padrão
              </h2>
              <p className="mt-0.5 text-caption text-text-secondary">
                Você está conectado como <strong>{currentSession?.name}</strong> ({currentSession?.email}). Sua conta possui acesso completo ao estoque, listas de compras, alertas de validade, histórico de descarte e relatórios. A criação de novas contas de acesso é exclusiva do Administrador.
              </p>
            </div>
          </div>
        </Card>
      )}

      <form
        onSubmit={handleSavePreferences}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6"
      >
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Home className="h-5 w-5 text-forest" />
              <div>
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Perfil da Residência e Responsável
                </h2>
                <p className="text-caption text-text-secondary">
                  Informações exibidas no painel e nos relatórios domésticos.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label
                  htmlFor="settings-household"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Identificação da Residência
                </label>
                <Input
                  id="settings-household"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-username"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Nome de Exibição
                </label>
                <Input
                  id="settings-username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="settings-residents"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Número de Moradores
                </label>
                <Input
                  id="settings-residents"
                  type="number"
                  min="1"
                  max="20"
                  value={residentsCount}
                  onChange={(e) => setResidentsCount(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="settings-email"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  E-mail / Login da Sessão
                </label>
                <Input
                  id="settings-email"
                  type="text"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                />
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <Bell className="h-5 w-5 text-forest" />
              <div>
                <h2 className="font-heading text-section-title font-bold text-text-primary">
                  Regras de Alertas e Metas Sustentáveis
                </h2>
                <p className="text-caption text-text-secondary">
                  Defina quando um produto deve ser classificado como &ldquo;Vencendo em Breve&rdquo;.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="settings-alert-days"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Antecedência de Alerta de Validade (dias)
                </label>
                <select
                  id="settings-alert-days"
                  value={alertDays}
                  onChange={(e) => setAlertDays(e.target.value)}
                  className="h-10 w-full rounded-DEFAULT border border-border bg-surface px-3 text-body-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="3">3 dias antes do vencimento</option>
                  <option value="5">5 dias antes do vencimento</option>
                  <option value="7">7 dias antes do vencimento (Padrão)</option>
                  <option value="10">10 dias antes do vencimento</option>
                  <option value="14">14 dias antes do vencimento</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="settings-goal-pct"
                  className="block text-caption font-medium text-text-primary mb-1"
                >
                  Meta Mensal de Redução de Desperdício (%)
                </label>
                <Input
                  id="settings-goal-pct"
                  type="number"
                  min="5"
                  max="95"
                  value={goalPct}
                  onChange={(e) => setGoalPct(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2.5 pt-2">
              <label className="flex items-center justify-between gap-3 rounded-DEFAULT border border-border bg-surface-secondary/50 p-3 cursor-pointer">
                <div>
                  <span className="block text-body-sm font-medium text-text-primary">
                    Alertas de Vencimento Próximo
                  </span>
                  <span className="text-caption text-text-secondary">
                    Destacar produtos que expiram dentro da janela configurada.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableExpiration}
                  onChange={(e) => setEnableExpiration(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-DEFAULT border border-border bg-surface-secondary/50 p-3 cursor-pointer">
                <div>
                  <span className="block text-body-sm font-medium text-text-primary">
                    Sugestões Automáticas de Estoque Baixo
                  </span>
                  <span className="text-caption text-text-secondary">
                    Sugerir reposição nas listas de compras quando atingir o mínimo.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableLowStock}
                  onChange={(e) => setEnableLowStock(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>

              <label className="flex items-center justify-between gap-3 rounded-DEFAULT border border-border bg-surface-secondary/50 p-3 cursor-pointer">
                <div>
                  <span className="block text-body-sm font-medium text-text-primary">
                    Resumo Semanal de Consumo Consciente
                  </span>
                  <span className="text-caption text-text-secondary">
                    Exibir consolidação semanal de aproveitamento alimentar.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={enableWeekly}
                  onChange={(e) => setEnableWeekly(e.target.checked)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
              </label>
            </div>

            <div className="flex justify-end pt-2">
              <Button type="submit" className="w-full sm:w-auto">
                <Save className="h-4 w-4" />
                Salvar Preferências
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-forest" />
                <h2 className="font-heading text-card-title font-bold text-text-primary">
                  Sobre o Projeto
                </h2>
              </div>
              <Badge variant="forest">Extensão Universitária</Badge>
            </div>
            <p className="text-caption text-text-secondary leading-relaxed">
              O <strong>Despensa+</strong> é uma aplicação desenvolvida como parte de projeto de extensão universitária na{" "}
              <strong>Faculdade de Tecnologia SENAI Félix Guisard</strong>, voltada à educação para o consumo consciente, planejamento doméstico de compras e redução do desperdício de alimentos.
            </p>
            <div className="rounded-DEFAULT border border-border bg-surface-secondary/60 p-3 text-caption space-y-1">
              <div className="flex justify-between">
                <span className="text-text-secondary">Instituição:</span>
                <span className="font-semibold text-text-primary">
                  Fatec SENAI Félix Guisard
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Fase do Projeto:</span>
                <span className="font-semibold text-primary">
                  Frontend SaaS Interativo (v1.1)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">Persistência Local:</span>
                <span className="font-semibold text-success inline-flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Ativa (LocalStorage)
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 space-y-3 border-warning/40">
            <h2 className="font-heading text-card-title font-bold text-text-primary">
              Dados de Demonstração
            </h2>
            <p className="text-caption text-text-secondary leading-relaxed">
              Todas as alterações que você realiza em produtos, listas de compras e histórico de descarte ficam salvas no navegador. Caso deseje voltar ao conjunto de dados inicial de produtos para uma nova apresentação, utilize a opção abaixo.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetConfirmOpen(true)}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar Dados Originais de Demonstração
            </Button>
          </Card>
        </div>
      </form>

      <ConfirmDialog
        open={resetConfirmOpen}
        onOpenChange={setResetConfirmOpen}
        title="Restaurar Dados de Demonstração"
        description="Tem certeza de que deseja redefinir os produtos, listas de compras e registros de descarte para o estado inicial de demonstração?"
        confirmLabel="Sim, Restaurar Dados"
        variant="default"
        onConfirm={resetDemoData}
      />

      <ConfirmDialog
        open={Boolean(accountToDelete)}
        onOpenChange={(open) => {
          if (!open) setAccountToDelete(null);
        }}
        title="Revogar Acesso de Usuário"
        description={
          accountToDelete
            ? `Tem certeza de que deseja remover o acesso de "${accountToDelete.name}" (${accountToDelete.email})? Este usuário não poderá mais fazer login no sistema.`
            : ""
        }
        confirmLabel="Sim, Revogar Acesso"
        variant="danger"
        onConfirm={() => {
          if (accountToDelete) {
            deleteUserAccount(accountToDelete.id);
          }
        }}
      />
    </div>
  );
}

---
name: despensa-mais-development
description: >-
  Guia prático de desenvolvimento e evolução da aplicação Despensa+ (Next.js App Router,
  TypeScript, Tailwind CSS). Use sempre que precisar criar novas funcionalidades, editar
  telas existentes, ajustar regras de estoque, listas de compras, alertas de validade,
  autenticação ou integrar um futuro backend mantendo a identidade visual e arquitetura.
---

# Skill de Desenvolvimento — Despensa+

Esta skill orienta qualquer agente na manutenção e expansão do frontend **Despensa+** (Projeto de Extensão — Faculdade de Tecnologia SENAI Félix Guisard), garantindo consistência visual, integridade de estado e zero quebras de build.

---

## 1. Mapa Rápido da Arquitetura

```text
src/
  app/
    login/page.tsx                # Tela de Login (única entrada pública)
    (dashboard)/                  # Rotas protegidas por <AuthGuard>
      layout.tsx                  # Shell com AppSidebar + AppHeader + MobileNavigation
      dashboard/page.tsx          # Painel Geral
      inventory/page.tsx          # Meu Estoque
      shopping-lists/page.tsx     # Listas de Compras
      expiration-alerts/page.tsx  # Alertas de Validade
      waste-history/page.tsx      # Histórico de Descarte
      analytics/page.tsx          # Relatórios e Análises (Recharts)
      settings/page.tsx           # Configurações + Gestão de Usuários (Admin)
  components/
    auth/                         # LoginView e AuthGuard
    layout/                       # AppSidebar, AppHeader, MobileNavigation, NotificationPanel
    dashboard/                    # DashboardView, ActivityTimeline
    inventory/                    # InventoryView, ProductCard, ProductTable, ProductForm, ProductDetailsModal
    shopping-lists/               # ShoppingListsView, ShoppingListCard, CreateShoppingListDialog
    alerts/                       # ExpirationAlertsView, ExpirationAlertCard
    waste/                        # WasteHistoryView
    analytics/                    # AnalyticsView, ChartCard
    settings/                     # SettingsView (inclui criação de contas p/ Admin)
    shared/                       # PageHeader, StatCard, SearchInput, FilterDropdown, EmptyState, ConfirmDialog, ProductAvatar, ProductStatusBadge, WasteRecordDialog
    ui/                           # Button, Badge, Card, Input, ModalDialog, ToastViewport
  hooks/
    use-despensa.tsx              # Estado global, autenticação, CRUD e persistência em LocalStorage
  lib/
    constants.ts                  # Categorias, unidades, locais e rótulos semânticos
    formatters.ts                 # Formatação pt-BR (DD/MM/YYYY, R$) e cálculo de status
    utils.ts                      # Helper cn() (clsx + tailwind-merge)
  data/
    mock-data.ts                  # Conta Admin padrão e dados demonstrativos iniciais
  types/
    auth.ts                       # UserRole ("admin" | "user"), SystemUserAccount, AuthenticatedSession
    product.ts                    # Product, ProductCategory, ProductStatus, ExpirationCategory
    shopping-list.ts              # ShoppingList, ShoppingListItem
    waste-record.ts               # WasteRecord, ActivityEvent, AppNotification, UserPreferences
```

---

## 2. Fluxo de Autenticação e Permissões (RBAC)

1. **Login Obrigatório:**
   - Nunca remova o `AuthGuard` de `src/app/(dashboard)/layout.tsx`.
   - A conta de administrador raiz já vem configurada em `DEFAULT_ADMIN_ACCOUNT`:
     - **Email/Login:** `despensa.adm.local.com`
     - **Senha:** `despensalocalnetwork092`
   - A tela de login (`src/components/auth/login-view.tsx`) **não deve ter seção de cadastro/registro público**.
2. **Criação de Novos Acessos:**
   - Somente usuários com `currentSession?.role === "admin"` podem visualizar o card **"Gerenciamento de Contas de Usuários"** em `src/components/settings/settings-view.tsx` e chamar `createUserAccount` / `deleteUserAccount`.
   - Contas criadas pelo administrador recebem `role: "user"` e acessam exatamente o mesmo estoque compartilhado e todas as funcionalidades do sistema, exceto a gestão de acessos.

---

## 3. Como Adicionar ou Modificar Funcionalidades

### Passo 1: Tipos e Dados (`src/types/` e `src/hooks/use-despensa.tsx`)
- Defina primeiro as interfaces TypeScript em `src/types/` sem usar `any`.
- Adicione novas ações ou estados dentro do `DespensaProvider` (`src/hooks/use-despensa.tsx`).
- Caso a ação altere o estoque, listas ou descartes:
  - Chame `prependActivity(...)` para registrar na linha do tempo do Painel Geral.
  - Chame `pushToast(...)` para exibir feedback visual imediato ao usuário.

### Passo 2: Reutilização de Componentes (`src/components/shared/` e `src/components/ui/`)
- Sempre utilize `PageHeader` no topo de páginas internas.
- Utilize `StatCard` para cartões de métricas.
- Utilize `ModalDialog` (`src/components/ui/dialog.tsx`) para janelas modais e `ConfirmDialog` para confirmações destrutivas.
- Utilize `ProductStatusBadge` e `getProductStatus(product, alertDays)` para exibir o status de produtos.

### Passo 3: Regras Visuais e Tailwind CSS
- Use apenas os tokens semânticos configurados em `tailwind.config.ts`:
  - `bg-forest`, `bg-primary`, `bg-sage`, `bg-background`, `bg-surface`, `bg-surface-secondary`
  - `text-text-primary`, `text-text-secondary`, `text-text-muted`
  - `text-success`, `text-warning`, `text-danger`, `text-info`
- Não defina cores em variáveis CSS hexadecimais dentro de `tailwind.config.ts` se precisar de modificadores de opacidade do Tailwind (como `bg-sage/30` ou `border-danger/35`); mantenha os códigos hexadecimais diretamente no `tailwind.config.ts`.

### Passo 4: Responsividade (Mobile-First)
- Toda tabela em desktop (`hidden md:block`) deve possuir uma alternativa em cartões compactos para telas móveis (`md:hidden`).
- Botões de ação principais em cabeçalhos e modais devem usar `w-full sm:w-auto`.
- Considere o espaçamento inferior (`pb-24 lg:pb-10`) no `<main>` por conta da barra `MobileNavigation` fixa no mobile.

---

## 4. Checklist de Validação Obrigatória

Sempre que concluir uma alteração:
1. Rode `npx tsc --noEmit` e confirme que não há erros de TypeScript.
2. Rode `npm run build` e confirme que todas as páginas compilam sem erros do Webpack/PostCSS.
3. Verifique se o login com `despensa.adm.local.com` / `despensalocalnetwork092` e o controle de permissão de usuários continuam intactos.

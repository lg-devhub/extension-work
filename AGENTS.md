# AGENTS.md — Diretrizes e Contexto do Projeto Despensa+

Este documento define o contexto arquitetural, padrões visuais, regras de negócio e fluxo de trabalho que qualquer agente de IA deve seguir ao manter ou evoluir o projeto **Despensa+**.

---

## 1. Visão Geral do Projeto

- **Nome:** Despensa+
- **Objetivo:** Plataforma SaaS moderna e responsiva para gestão de estoque doméstico de alimentos, organização de listas de compras, alertas de validade e redução do desperdício alimentar.
- **Vínculo Institucional:** Projeto de Extensão Universitária — **Faculdade de Tecnologia SENAI Félix Guisard**.
- **Idioma e Convenções:**
  - Todo o texto visível da interface deve estar em **Português do Brasil (`pt-BR`)**.
  - Datas no formato `DD/MM/YYYY` (via `formatDateBR` em `src/lib/formatters.ts`).
  - Valores monetários em Real (`R$`, via `formatCurrencyBRL`).
  - Unidades de medida domésticas (`un`, `kg`, `g`, `L`, `ml`, `dz`, `pct`, `cx`, `maço`, `pote`).

---

## 2. Stack Tecnológica

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (`strict: true`).
- **Estilização:** Tailwind CSS v3.4 com tokens semânticos configurados em `tailwind.config.ts` e variáveis em `src/app/globals.css`.
- **Componentes de UI:** Componentes modulares estilo `shadcn/ui` em `src/components/ui/` e componentes compartilhados em `src/components/shared/`.
- **Ícones:** `lucide-react`.
- **Gráficos:** `recharts` (sempre renderizados dentro de contêineres com altura fixa após hidratação `isHydrated`).
- **Formulários e Validação:** `react-hook-form` + `zod` + `@hookform/resolvers/zod`.

---

## 3. Identidade Visual e Design System (Obrigatório)

Mantenha a estética de **SaaS moderno com minimalismo orgânico**. Evite gradientes exagerados, sombras pesadas ou cores fora da paleta oficial.

### Paleta de Cores Semântica (`tailwind.config.ts`)
- **Primárias:**
  - `forest`: `#183D2B` (Verde Floresta — botões primários, destaques principais, painel de login)
  - `primary`: `#3F6849` (Verde Primário — estados ativos, ícones, barras de progresso)
  - `sage`: `#91A88B` (Verde Sálvia — bordas de hover, detalhes suaves)
- **Fundos e Superfícies:**
  - `background`: `#F4F3EA` (Fundo principal creme orgânico)
  - `surface`: `#FFFFFF` (Cartões, modais, tabelas, barra lateral)
  - `surface-secondary`: `#F0F2EB` (Fundos secundários, inputs, badges neutras)
  - `border`: `#E2E5DC` (Bordas sutis)
- **Texto:**
  - `text-primary`: `#202820`
  - `text-secondary`: `#737C73`
  - `text-muted`: `#9AA198`
- **Status:**
  - `success`: `#39865A` (Fundo sutil: `#EAF4EE`)
  - `warning`: `#E5A23C` (Fundo sutil: `#FDF5E8`)
  - `danger`: `#D85B55` (Fundo sutil: `#FDECEB`)
  - `info`: `#5686B7` (Fundo sutil: `#ECF2F8`)

### Tipografia
- **Títulos (`font-heading`):** `Manrope`
- **Corpo e Interface (`font-sans`):** `Inter`
- **Border Radius:** Entre `8px` (`rounded-sm`) e `14px` (`rounded-xl`).

---

## 4. Regras de Autenticação e Controle de Acesso (RBAC)

1. **Acesso Inicial Obrigatório pelo Login (`/login`):**
   - O site **nunca** deve abrir direto no painel sem autenticação.
   - `src/app/page.tsx` redireciona para `/login`.
   - Todas as rotas dentro de `src/app/(dashboard)/` são protegidas pelo componente `AuthGuard` (`src/components/auth/auth-guard.tsx`), que redireciona usuários não autenticados para `/login`.
2. **Tela de Login (`src/components/auth/login-view.tsx`):**
   - Segue layout dividido com painel diagonal verde à esquerda (*"Despensa+ — Controle. Organize. Cresça."*) e cartão branco animado à direita.
   - **Proibido adicionar seção pública de criar conta/registro na tela de login.** A tela deve conter exclusivamente o formulário de login.
   - Não utilize validação HTML nativa `type="email"` que bloqueie logins sem `@`, pois o login do administrador é `despensa.adm.local.com`.
3. **Conta de Administrador Padrão:**
   - **Login/Email:** `despensa.adm.local.com`
   - **Senha:** `despensalocalnetwork092`
   - Definida em `DEFAULT_ADMIN_ACCOUNT` (`src/data/mock-data.ts`) e sempre garantida no estado por `ensureAdminAccount` (`src/hooks/use-despensa.tsx`).
4. **Diferença entre Administrador (`admin`) e Usuário (`user`):**
   - **Administrador (`role: "admin"`):** Possui acesso total ao sistema **e** visualiza na página de Configurações (`/settings`) a seção exclusiva **"Gerenciamento de Contas de Usuários"**, podendo criar novas contas de usuário e revogar acessos existentes.
   - **Usuário Padrão (`role: "user"`):** Criado pelo Administrador nas Configurações. Acessa o mesmo estoque e possui todas as funcionalidades operacionais (Painel, Meu Estoque, Listas de Compras, Alertas de Validade, Histórico de Descarte, Relatórios e preferências gerais), **exceto** criar ou gerenciar contas de usuários.

---

## 5. Arquitetura de Pastas e Estado

- `src/app/login/page.tsx`: Rota pública de autenticação.
- `src/app/(dashboard)/layout.tsx`: Layout autenticado com `AuthGuard`, `AppSidebar`, `AppHeader` e `MobileNavigation`.
- `src/app/(dashboard)/*`: Páginas principais (`dashboard`, `inventory`, `shopping-lists`, `expiration-alerts`, `waste-history`, `analytics`, `settings`).
- `src/hooks/use-despensa.tsx`: Contexto centralizado (`DespensaProvider`) que isola toda a lógica de dados e persistência em `localStorage` (`despensa_mais_state_v1` e `despensa_mais_auth_session_v1`).
- **Regra de Negócio Crítica do Estoque:** Sempre que a quantidade (`quantity`) de um produto chegar a `0`, a função `getProductStatus()` em `src/lib/formatters.ts` deve retornar `"out_of_stock"` (*Sem Estoque*).

---

## 6. Protocolo de Qualidade e Verificação (Não Pule!)

Antes de finalizar qualquer tarefa ou alteração no código:
1. Não utilize `any` no TypeScript.
2. Execute `npx tsc --noEmit` para garantir zero erros de tipagem.
3. Execute `npm run build` para validar que o Next.js compila todas as rotas e folhas de estilo sem quebrar.
4. Verifique a responsividade entre `320px` (mobile) e `1920px` (desktop), garantindo ausência de barra de rolagem horizontal (`overflow-x`).

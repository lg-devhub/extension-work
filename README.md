# Despensa+ — Gestão Doméstica de Alimentos e Redução de Desperdício

Aplicação web moderna e responsiva voltada para organização de estoque doméstico de alimentos, planejamento de listas de compras, monitoramento de datas de validade e redução do desperdício alimentar.

Projeto desenvolvido no âmbito de extensão universitária da **Faculdade de Tecnologia SENAI Félix Guisard**.

---

## Tecnologias Utilizadas

- **Next.js 15** (App Router)
- **React 19** & **TypeScript** (Tipagem estrita)
- **Tailwind CSS** com tokens semânticos de cores
- **Componentes estilo shadcn/ui** reutilizáveis e acessíveis
- **Lucide React** para iconografia consistente
- **Recharts** para visualização de dados e indicadores analíticos
- **React Hook Form** + **Zod** para gerenciamento e validação de formulários
- **Next.js Font Optimization** (`Manrope` para títulos e `Inter` para interface)

---

## Sistema de Design e Identidade Visual

- **Cores Primárias:** Forest Green (`#183D2B`), Primary Green (`#3F6849`), Sage Green (`#91A88B`)
- **Superfícies:** Main Background (`#F4F3EA`), Surface (`#FFFFFF`), Secondary Surface (`#F0F2EB`)
- **Tipografia:** Hierarquia estruturada com `Manrope` e `Inter`
- **Status Semânticos:** Success (`#39865A`), Warning (`#E5A23C`), Danger (`#D85B55`), Information (`#5686B7`)

---

## Estrutura de Páginas

1. **Painel Geral (`/dashboard`)**: Resumo executivo do estoque, 4 indicadores principais, visão geral dos produtos, alertas prioritários de validade, linha do tempo de atividades recentes e ações rápidas.
2. **Meu Estoque (`/inventory`)**: Gerenciamento completo de produtos com busca, filtros por categoria, nível de estoque e validade, alternância entre visualização em grade e lista, ajuste rápido de quantidade e status automático de *Sem Estoque* ao atingir zero.
3. **Listas de Compras (`/shopping-lists`)**: Criação e acompanhamento de listas de compras, sugestões inteligentes de reposição e fluxo interativo de conversão de itens comprados diretamente para o estoque doméstico.
4. **Alertas de Validade (`/expiration-alerts`)**: Monitoramento categorizado em *Vencidos*, *Vencendo Hoje*, *Em até 3 Dias*, *Em até 7 Dias* e *Seguros para Consumo*.
5. **Histórico de Descarte (`/waste-history`)**: Registro e auditoria de descartes por motivo (*Prazo Vencido*, *Estragado*, *Compra em Excesso*, *Outro*) com dedução opcional do estoque.
6. **Relatórios e Análises (`/analytics`)**: Gráficos de tendência mensal de desperdício, impacto financeiro, produtos mais descartados/comprados e distribuição por categoria.
7. **Configurações (`/settings`)**: Personalização da residência, antecedência de alertas, metas sustentáveis e restauração dos dados demonstrativos.

---

## Como Executar

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000` no navegador.

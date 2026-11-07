"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BarChart3,
  Info,
  Leaf,
  ShoppingBag,
  TrendingDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { ChartCard } from "@/components/analytics/chart-card";
import {
  DEMO_MONTHLY_WASTE_SERIES,
  DEMO_MOST_DISCARDED_PRODUCTS,
  DEMO_MOST_PURCHASED_PRODUCTS,
} from "@/data/mock-data";
import { CATEGORY_COLORS, PRODUCT_CATEGORIES } from "@/lib/constants";
import { formatCurrencyBRL } from "@/lib/formatters";
import { useDespensa } from "@/hooks/use-despensa";

export function AnalyticsView() {
  const { products, wasteRecords, metrics, isHydrated } = useDespensa();

  const categoryDistribution = useMemo(() => {
    return PRODUCT_CATEGORIES.map((category) => {
      const count = products.filter((p) => p.category === category).length;
      return {
        name: category,
        quantidade: count,
        color: CATEGORY_COLORS[category] ?? "#3F6849",
      };
    }).filter((item) => item.quantidade > 0);
  }, [products]);

  const discardedRanking = useMemo(() => {
    const countsByName = new Map<string, number>();
    DEMO_MOST_DISCARDED_PRODUCTS.forEach((d) => {
      countsByName.set(d.name, d.count);
    });
    wasteRecords.slice(0, 4).forEach((rec) => {
      countsByName.set(
        rec.productName,
        (countsByName.get(rec.productName) ?? 1) + 1
      );
    });
    return Array.from(countsByName.entries())
      .map(([name, ocorrencias]) => ({ name, ocorrencias }))
      .sort((a, b) => b.ocorrencias - a.ocorrencias)
      .slice(0, 6);
  }, [wasteRecords]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Relatórios e Análises"
        description="Acompanhe indicadores de consumo familiar, evolução de desperdício e distribuição de categorias da despensa."
        badge={
          <Badge variant="info">
            <Info className="h-3.5 w-3.5" />
            Conjunto de Demonstração SENAI
          </Badge>
        }
      />

      <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info-subtle/70 p-4 text-caption text-text-primary">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-info" />
        <p>
          <strong>Nota sobre os dados:</strong> As séries históricas mensais abaixo são{" "}
          <strong>dados demonstrativos simulados</strong> para ilustrar o acompanhamento longitudinal do projeto de extensão{" "}
          <em>Despensa+ (SENAI Félix Guisard)</em>, combinados em tempo real com as alterações feitas no seu estoque e histórico de descarte.
        </p>
      </div>

      <section
        aria-label="Indicadores analíticos resumidos"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <StatCard
          title="Redução Acumulada"
          value={`${metrics.wasteReductionPct}%`}
          subtitle="Comparado ao início do ciclo"
          icon={TrendingDown}
          tone="success"
          badgeText="Evolução"
        />
        <StatCard
          title="Taxa de Aproveitamento"
          value="95%"
          subtitle="Alimentos consumidos dentro do prazo"
          icon={Leaf}
          tone="success"
        />
        <StatCard
          title="Perda Financeira Atual"
          value={formatCurrencyBRL(metrics.totalWasteLossBRL)}
          subtitle="Total nos registros ativos"
          icon={BarChart3}
          tone="warning"
        />
        <StatCard
          title="Categorias Ativas"
          value={categoryDistribution.length}
          subtitle={`De ${PRODUCT_CATEGORIES.length} grupos monitorados`}
          icon={ShoppingBag}
          tone="info"
        />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Tendência de Desperdício de Alimentos ao Longo do Tempo"
          description="Evolução mensal em quilogramas (kg) descartados versus meta sustentável da residência."
          badgeText="Série Demonstrativa"
          footer="Acompanhamento de junho a novembro mostra queda consistente após adoção dos alertas de validade."
        >
          {isHydrated ? (
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={DEMO_MONTHLY_WASTE_SERIES}
                  margin={{ top: 10, right: 16, left: -12, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="wasteAreaFill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3F6849" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#3F6849" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E5DC"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E5DC" }}
                    tickLine={false}
                  />
                  <YAxis
                    unit=" kg"
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DC",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Area
                    type="monotone"
                    dataKey="descartesKg"
                    name="Descarte Registrado (kg)"
                    stroke="#183D2B"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#wasteAreaFill)"
                  />
                  <Area
                    type="monotone"
                    dataKey="metaMaximaKg"
                    name="Teto Meta (kg)"
                    stroke="#E5A23C"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[270px] w-full animate-pulse rounded-DEFAULT bg-surface-secondary" />
          )}
        </ChartCard>

        <ChartCard
          title="Registros Mensais de Descarte (Impacto Financeiro)"
          description="Estimativa mensal em Reais (R$) correspondente aos alimentos descartados."
          badgeText="Série Demonstrativa"
          footer="Redução gradual do custo desperdiçado mensalmente pela família."
        >
          {isHydrated ? (
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEMO_MONTHLY_WASTE_SERIES}
                  margin={{ top: 10, right: 16, left: -8, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E5DC"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="month"
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E5DC" }}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `R$${v}`}
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      formatCurrencyBRL(value),
                      "Valor Descartado",
                    ]}
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DC",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="custoEstimadoBRL"
                    name="Perda Financeira (R$)"
                    fill="#D85B55"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[270px] w-full animate-pulse rounded-DEFAULT bg-surface-secondary" />
          )}
        </ChartCard>

        <ChartCard
          title="Produtos Mais Frequentemente Descartados"
          description="Alimentos com maior número de ocorrências no histórico doméstico de perdas."
          badgeText="Demo + Histórico"
          footer="Folhosos e frutas maduras concentram as perdas; priorize armazená-los em recipientes forrados."
        >
          {isHydrated ? (
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={discardedRanking}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 16, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E5DC"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E5DC" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "#202820", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DC",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="ocorrencias"
                    name="Ocorrências de Descarte"
                    fill="#E5A23C"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[270px] w-full animate-pulse rounded-DEFAULT bg-surface-secondary" />
          )}
        </ChartCard>

        <ChartCard
          title="Produtos Mais Frequentemente Comprados"
          description="Itens de maior recorrência nas listas de compras mensais da residência."
          badgeText="Dados Demonstrativos"
          footer="Itens básicos de alto giro com excelente taxa de aproveitamento familiar."
        >
          {isHydrated ? (
            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={DEMO_MOST_PURCHASED_PRODUCTS}
                  layout="vertical"
                  margin={{ top: 4, right: 20, left: 16, bottom: 4 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E2E5DC"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fill: "#737C73", fontSize: 12 }}
                    axisLine={{ stroke: "#E2E5DC" }}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={120}
                    tick={{ fill: "#202820", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DC",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name="Volume Mensal Adquirido"
                    fill="#3F6849"
                    radius={[0, 6, 6, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[270px] w-full animate-pulse rounded-DEFAULT bg-surface-secondary" />
          )}
        </ChartCard>
      </div>

      <ChartCard
        title="Distribuição do Estoque Doméstico por Categoria"
        description="Proporção atual dos alimentos cadastrados em Meu Estoque divididos por grupo alimentar."
        badgeText="Estoque Atual"
        footer={`Total de ${products.length} produtos distribuídos em ${categoryDistribution.length} categorias.`}
      >
        {isHydrated ? (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full items-center">
            <div className="md:col-span-6 h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistribution}
                    dataKey="quantidade"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                  >
                    {categoryDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderColor: "#E2E5DC",
                      borderRadius: "10px",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {categoryDistribution.map((item) => {
                const pct =
                  products.length > 0
                    ? Math.round((item.quantidade / products.length) * 100)
                    : 0;
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-2 rounded-DEFAULT border border-border bg-surface-secondary/50 px-3 py-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="h-3 w-3 shrink-0 rounded-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="truncate text-caption font-medium text-text-primary">
                        {item.name}
                      </span>
                    </div>
                    <span className="shrink-0 text-caption font-bold text-forest">
                      {item.quantidade} ({pct}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="h-[250px] w-full animate-pulse rounded-DEFAULT bg-surface-secondary" />
        )}
      </ChartCard>
    </div>
  );
}

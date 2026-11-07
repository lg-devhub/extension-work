"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  createInitialActivities,
  createInitialNotifications,
  createInitialProducts,
  createInitialShoppingLists,
  createInitialUserAccounts,
  createInitialWasteRecords,
  DEFAULT_ADMIN_ACCOUNT,
  INITIAL_USER_PREFERENCES,
} from "@/data/mock-data";
import {
  formatQuantity,
  getDateOffsetISO,
  getDaysUntilExpiration,
  getProductStatus,
  getTodayISO,
} from "@/lib/formatters";
import type {
  AuthenticatedSession,
  SystemUserAccount,
} from "@/types/auth";
import type {
  Product,
  ProductFormValues,
  StorageLocation,
} from "@/types/product";
import type {
  ShoppingList,
  ShoppingListItem,
  ShoppingListStatus,
} from "@/types/shopping-list";
import type {
  ActivityEvent,
  AppNotification,
  UserPreferences,
  WasteRecord,
} from "@/types/waste-record";

const STORAGE_KEY = "despensa_mais_state_v1";
const AUTH_SESSION_KEY = "despensa_mais_auth_session_v1";

export interface ToastFeedback {
  id: string;
  title: string;
  description?: string;
  variant?: "success" | "warning" | "danger" | "info";
}

interface DespensaContextValue {
  products: Product[];
  shoppingLists: ShoppingList[];
  wasteRecords: WasteRecord[];
  activities: ActivityEvent[];
  notifications: AppNotification[];
  preferences: UserPreferences;
  userAccounts: SystemUserAccount[];
  currentSession: AuthenticatedSession | null;
  toasts: ToastFeedback[];
  isHydrated: boolean;
  globalSearchQuery: string;
  setGlobalSearchQuery: (query: string) => void;
  metrics: {
    totalProducts: number;
    expiringSoonCount: number;
    expiredCount: number;
    outOfStockCount: number;
    lowStockCount: number;
    wasteReductionPct: number;
    totalInventoryValueBRL: number;
    totalWasteLossBRL: number;
  };
  login: (
    email: string,
    password: string
  ) => { success: boolean; error?: string };
  logout: () => void;
  createUserAccount: (payload: {
    name: string;
    email: string;
    password: string;
  }) => { success: boolean; error?: string };
  deleteUserAccount: (userId: string) => void;
  addProduct: (values: ProductFormValues) => Product;
  updateProduct: (id: string, values: ProductFormValues) => void;
  deleteProduct: (id: string) => void;
  adjustProductQuantity: (id: string, delta: number) => void;
  markProductDepleted: (id: string) => void;
  createShoppingList: (payload: {
    name: string;
    description?: string;
    items?: Omit<ShoppingListItem, "id" | "purchased" | "addedToInventory">[];
  }) => ShoppingList;
  deleteShoppingList: (listId: string) => void;
  addItemToShoppingList: (
    listId: string,
    item: Omit<ShoppingListItem, "id" | "purchased" | "addedToInventory">
  ) => void;
  updateShoppingListItem: (
    listId: string,
    itemId: string,
    updates: Partial<ShoppingListItem>
  ) => void;
  removeShoppingListItem: (listId: string, itemId: string) => void;
  toggleShoppingListItemPurchased: (listId: string, itemId: string) => void;
  convertPurchasedItemsToInventory: (
    listId: string,
    options?: { location?: StorageLocation; shelfLifeDays?: number }
  ) => number;
  addProductToShoppingListQuick: (product: Product) => void;
  recordWaste: (
    payload: Omit<WasteRecord, "id">,
    deductFromProductId?: string
  ) => void;
  deleteWasteRecord: (id: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetDemoData: () => void;
  dismissToast: (id: string) => void;
  pushToast: (toast: Omit<ToastFeedback, "id">) => void;
}

const DespensaContext = createContext<DespensaContextValue | null>(null);

function computeListStatus(items: ShoppingListItem[]): ShoppingListStatus {
  if (items.length === 0) return "planejada";
  const purchasedCount = items.filter((item) => item.purchased).length;
  if (purchasedCount === 0) return "planejada";
  if (purchasedCount === items.length) return "concluida";
  return "em_andamento";
}

function ensureAdminAccount(
  accounts: SystemUserAccount[]
): SystemUserAccount[] {
  const withoutAdmin = accounts.filter(
    (acc) =>
      acc.id !== DEFAULT_ADMIN_ACCOUNT.id &&
      acc.email.toLowerCase() !== DEFAULT_ADMIN_ACCOUNT.email.toLowerCase()
  );
  return [DEFAULT_ADMIN_ACCOUNT, ...withoutAdmin];
}

export function DespensaProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() =>
    createInitialProducts()
  );
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>(() =>
    createInitialShoppingLists()
  );
  const [wasteRecords, setWasteRecords] = useState<WasteRecord[]>(() =>
    createInitialWasteRecords()
  );
  const [activities, setActivities] = useState<ActivityEvent[]>(() =>
    createInitialActivities()
  );
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    createInitialNotifications()
  );
  const [preferences, setPreferences] = useState<UserPreferences>(
    INITIAL_USER_PREFERENCES
  );
  const [userAccounts, setUserAccounts] = useState<SystemUserAccount[]>(() =>
    createInitialUserAccounts()
  );
  const [currentSession, setCurrentSession] =
    useState<AuthenticatedSession | null>(null);
  const [toasts, setToasts] = useState<ToastFeedback[]>([]);
  const [globalSearchQuery, setGlobalSearchQuery] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          products?: Product[];
          shoppingLists?: ShoppingList[];
          wasteRecords?: WasteRecord[];
          activities?: ActivityEvent[];
          notifications?: AppNotification[];
          preferences?: UserPreferences;
          userAccounts?: SystemUserAccount[];
        };
        if (Array.isArray(parsed.products)) setProducts(parsed.products);
        if (Array.isArray(parsed.shoppingLists))
          setShoppingLists(parsed.shoppingLists);
        if (Array.isArray(parsed.wasteRecords))
          setWasteRecords(parsed.wasteRecords);
        if (Array.isArray(parsed.activities)) setActivities(parsed.activities);
        if (Array.isArray(parsed.notifications))
          setNotifications(parsed.notifications);
        if (parsed.preferences) setPreferences(parsed.preferences);
        if (Array.isArray(parsed.userAccounts)) {
          setUserAccounts(ensureAdminAccount(parsed.userAccounts));
        }
      }

      const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);
      if (rawSession) {
        const parsedSession = JSON.parse(rawSession) as AuthenticatedSession;
        if (parsedSession && parsedSession.userId && parsedSession.email) {
          setCurrentSession(parsedSession);
        }
      }
    } catch {
      // Ignore storage read errors in restricted browsers
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          products,
          shoppingLists,
          wasteRecords,
          activities,
          notifications,
          preferences,
          userAccounts,
        })
      );
    } catch {
      // Ignore storage write errors
    }
  }, [
    isHydrated,
    products,
    shoppingLists,
    wasteRecords,
    activities,
    notifications,
    preferences,
    userAccounts,
  ]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const pushToast = useCallback(
    (toast: Omit<ToastFeedback, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { ...toast, id }]);
      window.setTimeout(() => {
        dismissToast(id);
      }, 4200);
    },
    [dismissToast]
  );

  const prependActivity = useCallback(
    (event: Omit<ActivityEvent, "id" | "timestamp">) => {
      const newEvent: ActivityEvent = {
        ...event,
        id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: "Agora mesmo",
      };
      setActivities((prev) => [newEvent, ...prev.slice(0, 19)]);
    },
    []
  );

  const login = useCallback(
    (
      emailInput: string,
      passwordInput: string
    ): { success: boolean; error?: string } => {
      const normalizedEmail = emailInput.trim().toLowerCase();
      const allAccounts = ensureAdminAccount(userAccounts);

      const matched = allAccounts.find(
        (acc) =>
          acc.email.trim().toLowerCase() === normalizedEmail &&
          acc.password === passwordInput
      );

      if (!matched) {
        return {
          success: false,
          error:
            "Credenciais inválidas. Verifique seu e-mail de acesso e senha.",
        };
      }

      const session: AuthenticatedSession = {
        userId: matched.id,
        name: matched.name,
        email: matched.email,
        role: matched.role,
        loggedInAt: new Date().toISOString(),
      };

      setCurrentSession(session);
      setPreferences((prev) => ({
        ...prev,
        userName: matched.name,
        userEmail: matched.email,
        userRole:
          matched.role === "admin"
            ? "Administrador do Sistema"
            : "Usuário da Despensa",
      }));

      try {
        window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
      } catch {
        // Ignore storage write errors
      }

      pushToast({
        title: `Bem-vindo(a), ${matched.name.split(" ")[0]}!`,
        description:
          matched.role === "admin"
            ? "Acesso administrativo autenticado com sucesso."
            : "Sessão iniciada no painel Despensa+.",
        variant: "success",
      });

      return { success: true };
    },
    [userAccounts, pushToast]
  );

  const logout = useCallback(() => {
    setCurrentSession(null);
    try {
      window.localStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // Ignore storage errors
    }
    pushToast({
      title: "Sessão encerrada",
      description: "Você saiu da sua conta com segurança.",
      variant: "info",
    });
  }, [pushToast]);

  const createUserAccount = useCallback(
    (payload: {
      name: string;
      email: string;
      password: string;
    }): { success: boolean; error?: string } => {
      if (!currentSession || currentSession.role !== "admin") {
        return {
          success: false,
          error: "Apenas o administrador pode criar contas de usuário.",
        };
      }

      const cleanName = payload.name.trim();
      const cleanEmail = payload.email.trim().toLowerCase();
      const cleanPassword = payload.password;

      if (cleanName.length < 2) {
        return {
          success: false,
          error: "Informe o nome completo ou identificação do usuário.",
        };
      }
      if (cleanEmail.length < 3) {
        return {
          success: false,
          error: "Informe um e-mail ou identificador de login válido.",
        };
      }
      if (cleanPassword.length < 4) {
        return {
          success: false,
          error: "A senha deve ter pelo menos 4 caracteres.",
        };
      }

      const alreadyExists = ensureAdminAccount(userAccounts).some(
        (acc) => acc.email.trim().toLowerCase() === cleanEmail
      );

      if (alreadyExists) {
        return {
          success: false,
          error: "Já existe uma conta cadastrada com este e-mail/login.",
        };
      }

      const newAccount: SystemUserAccount = {
        id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: "user",
        createdAt: getTodayISO(),
      };

      setUserAccounts((prev) => ensureAdminAccount([...prev, newAccount]));

      pushToast({
        title: "Conta de usuário criada",
        description: `O acesso para ${cleanName} (${cleanEmail}) já está ativo.`,
        variant: "success",
      });

      return { success: true };
    },
    [currentSession, userAccounts, pushToast]
  );

  const deleteUserAccount = useCallback(
    (userId: string) => {
      if (!currentSession || currentSession.role !== "admin") return;
      if (userId === DEFAULT_ADMIN_ACCOUNT.id) return;

      const target = userAccounts.find((u) => u.id === userId);
      setUserAccounts((prev) =>
        ensureAdminAccount(prev.filter((u) => u.id !== userId))
      );

      if (target) {
        pushToast({
          title: "Acesso removido",
          description: `A conta de ${target.name} foi revogada.`,
          variant: "info",
        });
      }
    },
    [currentSession, userAccounts, pushToast]
  );

  const addProduct = useCallback(
    (values: ProductFormValues): Product => {
      const today = getTodayISO();
      const newProduct: Product = {
        ...values,
        id: `prod-${Date.now()}`,
        addedAt: today,
        updatedAt: today,
      };
      setProducts((prev) => [newProduct, ...prev]);
      prependActivity({
        type: "product_added",
        title: `${values.name} adicionado ao estoque`,
        description: `${formatQuantity(values.quantity, values.unit)} em ${values.location}.`,
      });
      pushToast({
        title: "Produto cadastrado",
        description: `${values.name} foi adicionado à sua despensa.`,
        variant: "success",
      });
      return newProduct;
    },
    [prependActivity, pushToast]
  );

  const updateProduct = useCallback(
    (id: string, values: ProductFormValues) => {
      const today = getTodayISO();
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                ...values,
                updatedAt: today,
              }
            : item
        )
      );
      prependActivity({
        type: values.quantity <= 0 ? "product_depleted" : "quantity_updated",
        title:
          values.quantity <= 0
            ? `${values.name} ficou sem estoque`
            : `Dados de ${values.name} atualizados`,
        description: `Quantidade atual: ${formatQuantity(values.quantity, values.unit)}.`,
      });
      pushToast({
        title: "Produto atualizado",
        description: `As informações de ${values.name} foram salvas.`,
        variant: "info",
      });
    },
    [prependActivity, pushToast]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const target = products.find((p) => p.id === id);
      setProducts((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        pushToast({
          title: "Produto removido",
          description: `${target.name} foi removido do inventário.`,
          variant: "warning",
        });
      }
    },
    [products, pushToast]
  );

  const adjustProductQuantity = useCallback(
    (id: string, delta: number) => {
      const target = products.find((p) => p.id === id);
      if (!target) return;
      const rawNext = Number((target.quantity + delta).toFixed(2));
      const nextQuantity = Math.max(0, rawNext);
      const today = getTodayISO();

      setProducts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: nextQuantity,
                updatedAt: today,
              }
            : item
        )
      );

      if (nextQuantity === 0 && target.quantity > 0) {
        prependActivity({
          type: "product_depleted",
          title: `${target.name} marcado como esgotado`,
          description: `O estoque chegou a 0 ${target.unit}.`,
        });
        pushToast({
          title: "Produto sem estoque",
          description: `${target.name} atingiu quantidade zero.`,
          variant: "warning",
        });
      } else {
        prependActivity({
          type: "quantity_updated",
          title: `Quantidade de ${target.name} ajustada`,
          description: `Novo saldo: ${formatQuantity(nextQuantity, target.unit)}.`,
        });
      }
    },
    [products, prependActivity, pushToast]
  );

  const markProductDepleted = useCallback(
    (id: string) => {
      const target = products.find((p) => p.id === id);
      if (!target) return;
      const today = getTodayISO();
      setProducts((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: 0,
                updatedAt: today,
              }
            : item
        )
      );
      prependActivity({
        type: "product_depleted",
        title: `${target.name} marcado como esgotado`,
        description: `Saldo zerado em ${target.location}.`,
      });
      pushToast({
        title: "Marcado como sem estoque",
        description: `${target.name} agora está com status Sem Estoque.`,
        variant: "warning",
      });
    },
    [products, prependActivity, pushToast]
  );

  const createShoppingList = useCallback(
    (payload: {
      name: string;
      description?: string;
      items?: Omit<ShoppingListItem, "id" | "purchased" | "addedToInventory">[];
    }): ShoppingList => {
      const mappedItems: ShoppingListItem[] = (payload.items ?? []).map(
        (item, index) => ({
          ...item,
          id: `item-${Date.now()}-${index}`,
          purchased: false,
          addedToInventory: false,
        })
      );
      const newList: ShoppingList = {
        id: `list-${Date.now()}`,
        name: payload.name,
        description: payload.description,
        createdAt: getTodayISO(),
        status: computeListStatus(mappedItems),
        items: mappedItems,
      };
      setShoppingLists((prev) => [newList, ...prev]);
      prependActivity({
        type: "list_created",
        title: `Lista '${payload.name}' criada`,
        description: `${mappedItems.length} itens adicionados inicialmente.`,
      });
      pushToast({
        title: "Lista de compras criada",
        description: `A lista "${payload.name}" já está pronta para uso.`,
        variant: "success",
      });
      return newList;
    },
    [prependActivity, pushToast]
  );

  const deleteShoppingList = useCallback(
    (listId: string) => {
      const target = shoppingLists.find((l) => l.id === listId);
      setShoppingLists((prev) => prev.filter((item) => item.id !== listId));
      if (target) {
        pushToast({
          title: "Lista excluída",
          description: `A lista "${target.name}" foi removida.`,
          variant: "info",
        });
      }
    },
    [shoppingLists, pushToast]
  );

  const addItemToShoppingList = useCallback(
    (
      listId: string,
      item: Omit<ShoppingListItem, "id" | "purchased" | "addedToInventory">
    ) => {
      const newItem: ShoppingListItem = {
        ...item,
        id: `item-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        purchased: false,
        addedToInventory: false,
      };
      setShoppingLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const updatedItems = [...list.items, newItem];
          return {
            ...list,
            items: updatedItems,
            status: computeListStatus(updatedItems),
          };
        })
      );
      pushToast({
        title: "Item adicionado à lista",
        description: `${item.name} (${formatQuantity(item.quantity, item.unit)}) incluído.`,
        variant: "success",
      });
    },
    [pushToast]
  );

  const updateShoppingListItem = useCallback(
    (listId: string, itemId: string, updates: Partial<ShoppingListItem>) => {
      setShoppingLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const updatedItems = list.items.map((item) =>
            item.id === itemId ? { ...item, ...updates } : item
          );
          return {
            ...list,
            items: updatedItems,
            status: computeListStatus(updatedItems),
          };
        })
      );
    },
    []
  );

  const removeShoppingListItem = useCallback(
    (listId: string, itemId: string) => {
      setShoppingLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const updatedItems = list.items.filter((item) => item.id !== itemId);
          return {
            ...list,
            items: updatedItems,
            status: computeListStatus(updatedItems),
          };
        })
      );
    },
    []
  );

  const toggleShoppingListItemPurchased = useCallback(
    (listId: string, itemId: string) => {
      setShoppingLists((prev) =>
        prev.map((list) => {
          if (list.id !== listId) return list;
          const updatedItems = list.items.map((item) =>
            item.id === itemId ? { ...item, purchased: !item.purchased } : item
          );
          return {
            ...list,
            items: updatedItems,
            status: computeListStatus(updatedItems),
          };
        })
      );
    },
    []
  );

  const convertPurchasedItemsToInventory = useCallback(
    (
      listId: string,
      options?: { location?: StorageLocation; shelfLifeDays?: number }
    ): number => {
      const targetList = shoppingLists.find((l) => l.id === listId);
      if (!targetList) return 0;

      const itemsToConvert = targetList.items.filter(
        (item) => item.purchased && !item.addedToInventory
      );
      if (itemsToConvert.length === 0) return 0;

      const today = getTodayISO();

      setProducts((prevProducts) => {
        const nextProducts = [...prevProducts];

        itemsToConvert.forEach((shopItem, idx) => {
          const shelfDays =
            options?.shelfLifeDays ?? shopItem.defaultShelfLifeDays ?? 14;
          const location =
            options?.location ?? shopItem.defaultLocation ?? "Despensa";
          const expirationDate = getDateOffsetISO(shelfDays);

          const existingIndex = nextProducts.findIndex(
            (p) =>
              p.name.toLowerCase() === shopItem.name.toLowerCase() &&
              p.unit === shopItem.unit
          );

          if (existingIndex >= 0) {
            const existing = nextProducts[existingIndex];
            nextProducts[existingIndex] = {
              ...existing,
              quantity: Number(
                (existing.quantity + shopItem.quantity).toFixed(2)
              ),
              expirationDate,
              location,
              updatedAt: today,
            };
          } else {
            nextProducts.unshift({
              id: `prod-import-${Date.now()}-${idx}`,
              name: shopItem.name,
              category: shopItem.category,
              quantity: shopItem.quantity,
              minQuantity: 1,
              unit: shopItem.unit,
              expirationDate,
              addedAt: today,
              updatedAt: today,
              location,
              estimatedPrice: shopItem.estimatedPrice,
              notes: `Importado da lista "${targetList.name}"`,
            });
          }
        });

        return nextProducts;
      });

      setShoppingLists((prevLists) =>
        prevLists.map((list) => {
          if (list.id !== listId) return list;
          const updatedItems = list.items.map((item) =>
            item.purchased ? { ...item, addedToInventory: true } : item
          );
          return {
            ...list,
            items: updatedItems,
            status: computeListStatus(updatedItems),
          };
        })
      );

      prependActivity({
        type: "list_imported",
        title: `${itemsToConvert.length} itens enviados para o estoque`,
        description: `Importados a partir da lista "${targetList.name}".`,
      });

      pushToast({
        title: "Estoque abastecido com sucesso",
        description: `${itemsToConvert.length} ${
          itemsToConvert.length === 1 ? "item foi adicionado" : "itens foram adicionados"
        } ao seu inventário doméstico.`,
        variant: "success",
      });

      return itemsToConvert.length;
    },
    [shoppingLists, prependActivity, pushToast]
  );

  const addProductToShoppingListQuick = useCallback(
    (product: Product) => {
      const activeList =
        shoppingLists.find((l) => l.status !== "concluida") ?? shoppingLists[0];
      const recommendedQty = Math.max(1, product.minQuantity || 1);

      if (activeList) {
        addItemToShoppingList(activeList.id, {
          name: product.name,
          category: product.category,
          quantity: recommendedQty,
          unit: product.unit,
          estimatedPrice: product.estimatedPrice,
          defaultLocation: product.location,
          defaultShelfLifeDays: 14,
        });
      } else {
        createShoppingList({
          name: "Lista de Reposição Rápida",
          description: "Criada automaticamente a partir de alertas de estoque.",
          items: [
            {
              name: product.name,
              category: product.category,
              quantity: recommendedQty,
              unit: product.unit,
              estimatedPrice: product.estimatedPrice,
              defaultLocation: product.location,
              defaultShelfLifeDays: 14,
            },
          ],
        });
      }
    },
    [shoppingLists, addItemToShoppingList, createShoppingList]
  );

  const recordWaste = useCallback(
    (payload: Omit<WasteRecord, "id">, deductFromProductId?: string) => {
      const newRecord: WasteRecord = {
        ...payload,
        id: `waste-${Date.now()}`,
      };
      setWasteRecords((prev) => [newRecord, ...prev]);

      if (deductFromProductId) {
        const today = getTodayISO();
        setProducts((prev) =>
          prev.map((item) => {
            if (item.id !== deductFromProductId) return item;
            const remaining = Math.max(
              0,
              Number((item.quantity - payload.quantity).toFixed(2))
            );
            return {
              ...item,
              quantity: remaining,
              updatedAt: today,
            };
          })
        );
      }

      prependActivity({
        type: "waste_recorded",
        title: `Descarte registrado: ${payload.productName}`,
        description: `${formatQuantity(payload.quantity, payload.unit)} descartado.`,
      });

      pushToast({
        title: "Descarte registrado",
        description: `O registro de ${payload.productName} foi salvo no histórico.`,
        variant: "warning",
      });
    },
    [prependActivity, pushToast]
  );

  const deleteWasteRecord = useCallback(
    (id: string) => {
      setWasteRecords((prev) => prev.filter((item) => item.id !== id));
      pushToast({
        title: "Registro removido",
        description: "O item foi excluído do histórico de desperdício.",
        variant: "info",
      });
    },
    [pushToast]
  );

  const markNotificationAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const updatePreferences = useCallback(
    (updates: Partial<UserPreferences>) => {
      setPreferences((prev) => ({ ...prev, ...updates }));
      pushToast({
        title: "Preferências atualizadas",
        description: "Suas configurações da despensa foram salvas.",
        variant: "success",
      });
    },
    [pushToast]
  );

  const resetDemoData = useCallback(() => {
    setProducts(createInitialProducts());
    setShoppingLists(createInitialShoppingLists());
    setWasteRecords(createInitialWasteRecords());
    setActivities(createInitialActivities());
    setNotifications(createInitialNotifications());
    setPreferences((prev) => ({
      ...INITIAL_USER_PREFERENCES,
      userName: currentSession?.name ?? INITIAL_USER_PREFERENCES.userName,
      userEmail: currentSession?.email ?? INITIAL_USER_PREFERENCES.userEmail,
    }));
    pushToast({
      title: "Dados de demonstração restaurados",
      description: "Os produtos, listas e descartes iniciais foram recarregados.",
      variant: "info",
    });
  }, [currentSession, pushToast]);

  const metrics = useMemo(() => {
    const alertDays = preferences.alertDaysBeforeExpiration || 7;
    let expiringSoonCount = 0;
    let expiredCount = 0;
    let outOfStockCount = 0;
    let lowStockCount = 0;
    let totalInventoryValueBRL = 0;

    products.forEach((product) => {
      const status = getProductStatus(product, alertDays);
      const daysUntil = getDaysUntilExpiration(product.expirationDate);
      if (product.quantity > 0) {
        totalInventoryValueBRL += product.quantity * product.estimatedPrice;
      }
      if (status === "out_of_stock") {
        outOfStockCount += 1;
      } else {
        if (daysUntil < 0) {
          expiredCount += 1;
        } else if (daysUntil <= alertDays) {
          expiringSoonCount += 1;
        }
        if (product.quantity <= product.minQuantity) {
          lowStockCount += 1;
        }
      }
    });

    const totalWasteLossBRL = wasteRecords.reduce(
      (sum, record) => sum + record.estimatedLoss,
      0
    );

    const baselineMonthlyLossBRL = 92.4;
    const recentRecordsLoss = wasteRecords
      .slice(0, 4)
      .reduce((sum, r) => sum + r.estimatedLoss, 0);
    const rawReduction = Math.round(
      ((baselineMonthlyLossBRL - recentRecordsLoss) / baselineMonthlyLossBRL) *
        100
    );
    const wasteReductionPct = Math.max(12, Math.min(95, rawReduction));

    return {
      totalProducts: products.length,
      expiringSoonCount: expiringSoonCount + expiredCount,
      expiredCount,
      outOfStockCount,
      lowStockCount,
      wasteReductionPct,
      totalInventoryValueBRL,
      totalWasteLossBRL,
    };
  }, [products, wasteRecords, preferences.alertDaysBeforeExpiration]);

  const value = useMemo<DespensaContextValue>(
    () => ({
      products,
      shoppingLists,
      wasteRecords,
      activities,
      notifications,
      preferences,
      userAccounts,
      currentSession,
      toasts,
      isHydrated,
      globalSearchQuery,
      setGlobalSearchQuery,
      metrics,
      login,
      logout,
      createUserAccount,
      deleteUserAccount,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustProductQuantity,
      markProductDepleted,
      createShoppingList,
      deleteShoppingList,
      addItemToShoppingList,
      updateShoppingListItem,
      removeShoppingListItem,
      toggleShoppingListItemPurchased,
      convertPurchasedItemsToInventory,
      addProductToShoppingListQuick,
      recordWaste,
      deleteWasteRecord,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updatePreferences,
      resetDemoData,
      dismissToast,
      pushToast,
    }),
    [
      products,
      shoppingLists,
      wasteRecords,
      activities,
      notifications,
      preferences,
      userAccounts,
      currentSession,
      toasts,
      isHydrated,
      globalSearchQuery,
      metrics,
      login,
      logout,
      createUserAccount,
      deleteUserAccount,
      addProduct,
      updateProduct,
      deleteProduct,
      adjustProductQuantity,
      markProductDepleted,
      createShoppingList,
      deleteShoppingList,
      addItemToShoppingList,
      updateShoppingListItem,
      removeShoppingListItem,
      toggleShoppingListItemPurchased,
      convertPurchasedItemsToInventory,
      addProductToShoppingListQuick,
      recordWaste,
      deleteWasteRecord,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      updatePreferences,
      resetDemoData,
      dismissToast,
      pushToast,
    ]
  );

  return (
    <DespensaContext.Provider value={value}>
      {children}
    </DespensaContext.Provider>
  );
}

export function useDespensa(): DespensaContextValue {
  const context = useContext(DespensaContext);
  if (!context) {
    throw new Error("useDespensa deve ser utilizado dentro de DespensaProvider");
  }
  return context;
}

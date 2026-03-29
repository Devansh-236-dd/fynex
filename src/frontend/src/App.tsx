import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import { useState } from "react";
import Layout from "./components/Layout";
import AIAssistant from "./pages/AIAssistant";
import Analytics from "./pages/Analytics";
import CustomerIntelligence from "./pages/CustomerIntelligence";
import Dashboard from "./pages/Dashboard";
import FraudAlerts from "./pages/FraudAlerts";
import FundFlow from "./pages/FundFlow";
import InvestigationWorkspace from "./pages/InvestigationWorkspace";
import Login from "./pages/Login";

export interface User {
  email: string;
  role: string;
  name: string;
}

// Simple auth store outside React for router access
let currentUser: User | null = null;
export function getUser() {
  return currentUser;
}
export function setUser(u: User | null) {
  currentUser = u;
}

const rootRoute = createRootRoute({
  component: AppShell,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: () => {
    const handleLogin = (u: User) => {
      setUser(u);
      router.navigate({ to: "/dashboard" });
    };
    return <Login onLogin={handleLogin} />;
  },
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: Dashboard,
});

const fundFlowRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fund-flow",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: FundFlow,
});

const fraudAlertsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/fraud-alerts",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: FraudAlerts,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/customers",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: CustomerIntelligence,
});

const investigationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/investigation",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: InvestigationWorkspace,
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/analytics",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: Analytics,
});

const aiAssistantRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ai-assistant",
  beforeLoad: () => {
    if (!currentUser) throw redirect({ to: "/login" });
  },
  component: AIAssistant,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: () => {
    throw redirect({ to: currentUser ? "/dashboard" : "/login" });
  },
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  dashboardRoute,
  fundFlowRoute,
  fraudAlertsRoute,
  customersRoute,
  investigationRoute,
  analyticsRoute,
  aiAssistantRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function AppShell() {
  const [user, setLocalUser] = useState<User | null>(currentUser);

  const handleLogin = (u: User) => {
    setUser(u);
    setLocalUser(u);
    router.navigate({ to: "/dashboard" });
  };

  const handleLogout = () => {
    setUser(null);
    setLocalUser(null);
    router.navigate({ to: "/login" });
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout user={user} onLogout={handleLogout}>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return <RouterProvider router={router} />;
}

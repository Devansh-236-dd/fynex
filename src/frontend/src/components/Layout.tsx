import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bot,
  Briefcase,
  GitBranch,
  LayoutDashboard,
  LogOut,
  Search,
  Shield,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { User } from "../App";
import { setUser } from "../App";

interface Props {
  children: ReactNode;
  user: User;
  onLogout: () => void;
}

const navItems = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/fund-flow", icon: GitBranch, label: "Fund Flow" },
  { to: "/fraud-alerts", icon: AlertTriangle, label: "Fraud Alerts" },
  { to: "/customers", icon: Users, label: "Customer Intel" },
  { to: "/investigation", icon: Briefcase, label: "Investigation" },
  { to: "/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/ai-assistant", icon: Bot, label: "AI Assistant" },
] as const;

export default function Layout({ children, user, onLogout }: Props) {
  const location = useLocation();

  const handleLogout = () => {
    setUser(null);
    onLogout();
    window.location.href = "/login";
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <header
        className="h-14 flex-shrink-0 bg-white border-b border-slate-100 shadow-sm flex items-center px-6 gap-4 z-50"
        data-ocid="topnav.panel"
      >
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2.5 flex-shrink-0 mr-4"
          data-ocid="nav.logo.link"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md animate-float">
            <Shield size={16} className="text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight leading-none">
            Fynex
          </span>
        </Link>

        {/* Center Nav */}
        <nav
          className="flex-1 flex items-center justify-center gap-1"
          data-ocid="nav.panel"
        >
          {navItems.map(({ to, icon: Icon, label }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                data-ocid={`nav.${label.toLowerCase().replace(/ /g, "_")}.link`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Icon
                  size={13}
                  className={isActive ? "text-blue-600" : "text-slate-400"}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search + Bell + Avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <Input
              placeholder="Search..."
              className="pl-8 h-8 w-44 text-xs bg-slate-50 border-slate-200 rounded-full focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all focus:w-52"
              data-ocid="header.search_input"
            />
          </div>
          <button
            type="button"
            className="relative p-2 rounded-full hover:bg-blue-50 transition-colors"
            data-ocid="notifications.button"
          >
            <Bell size={16} className="text-slate-600" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-red-500 text-white border-2 border-white rounded-full">
              5
            </Badge>
          </button>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-100">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[11px] font-bold cursor-pointer hover:shadow-md transition-shadow">
              {user.name.charAt(0)}
            </div>
            <div className="hidden sm:block">
              <div className="text-xs font-semibold text-gray-800 leading-tight">
                {user.name}
              </div>
              <div className="text-[10px] text-slate-400">{user.role}</div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all duration-200 ml-1"
              data-ocid="logout.button"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* Page content — no wrapper padding; pages own their spacing */}
      <main className="flex-1 overflow-y-auto pastel-gradient">{children}</main>
    </div>
  );
}

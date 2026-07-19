import { useState } from "react";
import { NavLink } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Home,
  ScanLine,
  ShieldCheck,
  ShieldPlus,
  User,
  X,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Workspace", icon: Home },
  { to: "/scan", label: "Scan Food", icon: ScanLine },
  { to: "/allergies", label: "Allergy Shield", icon: ShieldPlus },
  { to: "/history", label: "Food Timeline", icon: Clock3 },
  { to: "/profile", label: "My Safety Profile", icon: User },
];

function SidebarContent({ onNavigate, collapsed, onToggle }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-4 py-6">
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between gap-3"}`}>
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-xl shadow-primary-500/25">
              <ShieldCheck size={24} />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="block truncate text-xl font-black tracking-tight text-ink-900 dark:text-white">
                  AllergyShield
                </span>
                <span className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">
                  AI Safety
                </span>
              </div>
            )}
          </div>
          {!collapsed && onToggle && (
            <button
              type="button"
              onClick={onToggle}
              aria-label="Collapse sidebar"
              className="rounded-xl p-2 text-ink-400 transition hover:bg-white hover:text-primary-600 dark:hover:bg-slate-900"
            >
              <ChevronLeft size={18} />
            </button>
          )}
        </div>
        {collapsed && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="mx-auto mt-5 flex rounded-xl p-2 text-ink-400 transition hover:bg-white hover:text-primary-600 dark:hover:bg-slate-900"
          >
            <ChevronRight size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 rounded-[1.25rem] px-3 py-3.5 text-base font-black transition-all ${
                collapsed ? "justify-center" : ""
              } ${
                isActive
                  ? "bg-white text-primary-700 shadow-xl shadow-primary-500/10 ring-1 ring-primary-100 dark:bg-slate-900 dark:text-white dark:ring-slate-800"
                  : "text-ink-500 hover:bg-white/80 hover:text-ink-900 hover:shadow-sm dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebarActivePill"
                    className="absolute inset-y-2 left-1 w-1 rounded-full bg-primary-500"
                  />
                )}
                <Icon size={20} className={isActive ? "text-primary-600 dark:text-primary-400" : "text-current"} />
                {!collapsed && <span className="truncate">{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="p-4">
          <div className="rounded-[1.75rem] border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-4 shadow-sm dark:border-primary-500/20 dark:from-primary-500/10 dark:to-slate-900">
            <p className="text-base font-black text-ink-900 dark:text-white">Today&apos;s safety ritual</p>
            <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-slate-400">
              Scan first, compare allergens, then decide with confidence.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <aside
        className={`hidden shrink-0 border-r border-white/70 bg-gradient-to-b from-white/90 via-primary-50/60 to-white/80 backdrop-blur-xl transition-[width] duration-200 dark:border-slate-800/80 dark:from-slate-950/92 dark:via-slate-900/84 dark:to-slate-950/88 lg:block ${
          collapsed ? "w-24" : "w-76"
        }`}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggle={() => setCollapsed((value) => !value)}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-2xl dark:bg-slate-950 lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="absolute right-4 top-5 rounded-xl p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X size={20} />
              </button>
              <SidebarContent onNavigate={onClose} collapsed={false} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Moon,
  Plus,
  ScanLine,
  Search,
  Sun,
  User,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import Button from "../ui/Button";

export default function Navbar({ title, onMenuClick, theme, onThemeToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 px-4 shadow-sm shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/78 dark:shadow-black/20 sm:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onMenuClick}
            aria-label="Open menu"
            className="rounded-xl p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>
          <div className="min-w-0">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-primary-500">
              AllergyShield AI
            </p>
            <h1 className="truncate text-2xl font-extrabold text-ink-900 dark:text-white">{title}</h1>
          </div>
        </div>

        <div className="hidden min-w-0 flex-1 justify-center px-6 xl:flex">
          <div className="flex w-full max-w-lg items-center gap-3 rounded-2xl border border-ink-100 bg-white/84 px-4 py-3 text-base text-ink-400 shadow-sm ring-1 ring-white/70 dark:border-slate-800 dark:bg-slate-900/80 dark:ring-slate-800">
            <Search size={16} />
            <span>Search scans, allergens, ingredients...</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={ScanLine}
            onClick={() => navigate("/scan")}
            className="hidden sm:inline-flex"
          >
            Scan
          </Button>
          <button
            type="button"
            aria-label="Create quick scan"
            onClick={() => navigate("/scan")}
            className="rounded-xl p-2.5 text-ink-500 transition hover:bg-primary-50 hover:text-primary-600 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white sm:hidden"
          >
            <Plus size={19} />
          </button>
          <button
            type="button"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onThemeToggle}
            className="rounded-xl p-2.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-xl p-2.5 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger-500" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex items-center gap-2 rounded-2xl border border-transparent px-1.5 py-1 transition hover:border-ink-100 hover:bg-white dark:hover:border-slate-800 dark:hover:bg-slate-900"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary-500 text-xs font-bold text-white shadow-lg shadow-primary-500/25">
                {initials}
              </div>
              <span className="hidden max-w-40 truncate text-base font-bold text-ink-700 dark:text-slate-200 sm:block">
                {user?.name || "Account"}
              </span>
              <ChevronDown size={16} className="hidden text-ink-400 sm:block" />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.98 }}
                  transition={{ duration: 0.16 }}
                  className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-2xl shadow-slate-900/10 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="border-b border-ink-100 px-4 py-3 dark:border-slate-800">
                    <p className="truncate text-sm font-semibold text-ink-900 dark:text-white">
                      {user?.name}
                    </p>
                    <p className="truncate text-xs text-ink-500 dark:text-slate-400">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-ink-600 hover:bg-ink-50 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    <User size={16} />
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={logout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-danger-600 hover:bg-danger-50 dark:hover:bg-danger-500/10"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

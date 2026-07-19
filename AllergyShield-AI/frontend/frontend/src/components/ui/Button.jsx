import { motion } from "framer-motion";

const variants = {
  primary:
    "relative overflow-hidden bg-primary-500 text-white shadow-xl shadow-primary-500/25 before:absolute before:inset-0 before:-translate-x-full before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition before:duration-500 hover:bg-primary-600 hover:before:translate-x-full",
  secondary:
    "border border-ink-200 bg-white/90 text-ink-700 shadow-sm hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  ghost:
    "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-slate-300 dark:hover:bg-slate-800",
  danger: "bg-danger-500 text-white shadow-lg shadow-danger-500/20 hover:bg-danger-600",
};

const sizes = {
  sm: "h-10 px-4 text-base",
  md: "h-12 px-5 text-base",
  lg: "h-14 px-6 text-lg",
};

export default function Button({
  as: Component = "button",
  variant = "primary",
  size = "md",
  icon: Icon,
  children,
  className = "",
  ...props
}) {
  const MotionComponent = motion(Component);

  return (
    <MotionComponent
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-200 disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon size={17} aria-hidden="true" />}
      {children}
    </MotionComponent>
  );
}

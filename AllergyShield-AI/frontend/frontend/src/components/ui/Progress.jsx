import { motion } from "framer-motion";

const tones = {
  primary: "bg-primary-500",
  success: "bg-success-500",
  warning: "bg-warning-500",
  danger: "bg-danger-500",
};

export default function Progress({ value = 0, tone = "primary", className = "" }) {
  const bounded = Math.max(0, Math.min(100, value));

  return (
    <div className={`h-2 overflow-hidden rounded-full bg-ink-100 dark:bg-slate-800 ${className}`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${bounded}%` }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className={`h-full rounded-full ${tones[tone]}`}
      />
    </div>
  );
}

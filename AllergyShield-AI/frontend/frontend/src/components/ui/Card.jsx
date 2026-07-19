import { motion } from "framer-motion";

export default function Card({ children, className = "", hover = false, ...props }) {
  return (
    <motion.section
      whileHover={hover ? { y: -3 } : undefined}
      transition={{ duration: 0.18 }}
      className={`rounded-[1.75rem] border border-white/80 bg-white/88 shadow-xl shadow-slate-200/50 ring-1 ring-ink-100/70 backdrop-blur dark:border-slate-800 dark:bg-slate-900/86 dark:shadow-black/20 dark:ring-slate-800/80 ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

const styles = {
  success:
    "bg-success-50 text-success-600 ring-success-500/15 dark:bg-success-500/10 dark:text-success-500",
  danger:
    "bg-danger-50 text-danger-600 ring-danger-500/15 dark:bg-danger-500/10 dark:text-danger-500",
  warning:
    "bg-warning-50 text-warning-600 ring-warning-500/15 dark:bg-warning-500/10 dark:text-warning-500",
  primary:
    "bg-primary-50 text-primary-600 ring-primary-500/15 dark:bg-primary-500/10 dark:text-primary-500",
  neutral:
    "bg-ink-100 text-ink-600 ring-ink-500/10 dark:bg-slate-800 dark:text-slate-300",
};

export default function Badge({ tone = "neutral", children, className = "" }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold ring-1 ${styles[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

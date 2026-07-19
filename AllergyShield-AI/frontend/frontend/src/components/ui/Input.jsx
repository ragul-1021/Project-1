export default function Input({ icon: Icon, className = "", error, ...props }) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white/92 px-4 py-3.5 shadow-sm transition focus-within:border-primary-500 focus-within:bg-white focus-within:shadow-lg focus-within:shadow-primary-500/10 focus-within:ring-4 focus-within:ring-primary-500/12 dark:bg-slate-950 ${
          error
            ? "border-danger-500/50"
            : "border-ink-200 dark:border-slate-700"
        } ${className}`}
      >
        {Icon && <Icon size={17} className="shrink-0 text-ink-400" aria-hidden="true" />}
        <input
          className="min-w-0 flex-1 bg-transparent text-base font-semibold text-ink-900 outline-none placeholder:text-ink-300 dark:text-slate-100 dark:placeholder:text-slate-500"
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-danger-600">{error}</p>}
    </div>
  );
}

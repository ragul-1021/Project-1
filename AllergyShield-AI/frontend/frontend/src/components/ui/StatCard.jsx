import Card from "./Card";

export default function StatCard({ icon: Icon, label, value, helper, tone = "primary" }) {
  const tones = {
    primary: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500",
    success: "bg-success-50 text-success-600 dark:bg-success-500/10 dark:text-success-500",
    danger: "bg-danger-50 text-danger-600 dark:bg-danger-500/10 dark:text-danger-500",
    warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/10 dark:text-warning-500",
    accent: "bg-accent-50 text-accent-600 dark:bg-accent-500/10 dark:text-accent-500",
  };

  return (
    <Card hover className="relative overflow-hidden border-l-4 border-l-primary-500 p-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary-500/10" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-base font-bold text-ink-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 font-display text-4xl font-extrabold tracking-tight text-ink-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`flex h-14 w-14 items-center justify-center rounded-[1.35rem] ${tones[tone]}`}>
          <Icon size={23} aria-hidden="true" />
        </div>
      </div>
      {helper && <p className="mt-5 text-sm font-semibold text-ink-400 dark:text-slate-500">{helper}</p>}
    </Card>
  );
}

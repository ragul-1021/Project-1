import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, ShieldCheck } from "lucide-react";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-danger-50 text-danger-500 shadow-sm dark:bg-danger-500/10">
          <AlertTriangle size={30} />
        </div>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-600 shadow-sm dark:bg-slate-900">
          <ShieldCheck size={14} />
          AllergyShield AI
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink-500 dark:text-slate-400">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button as={Link} to="/dashboard" icon={ArrowLeft} className="mt-7">
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  RefreshCw,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { fetchCommonAllergens, fetchDashboardSummary, fetchRecentScans } from "../api/dashboardApi";
import { fetchScanHistory } from "../api/historyApi";
import { useAuth } from "../context/useAuth";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Skeleton from "../components/ui/Skeleton";

const emptySummary = {
  total_scans: 0,
  safe_products: 0,
  unsafe_products: 0,
};

function allergenText(value) {
  return value && String(value).trim() ? String(value) : "None detected";
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function DashboardHome() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(emptySummary);
  const [recentScans, setRecentScans] = useState([]);
  const [commonAllergens, setCommonAllergens] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    const [summaryResult, recentResult, commonResult, historyResult] = await Promise.allSettled([
      fetchDashboardSummary(),
      fetchRecentScans(),
      fetchCommonAllergens(),
      fetchScanHistory(),
    ]);

    if (summaryResult.status === "fulfilled") {
      setSummary({ ...emptySummary, ...summaryResult.value.data });
    } else if (historyResult.status === "fulfilled") {
      const scans = Array.isArray(historyResult.value.data) ? historyResult.value.data : [];
      setSummary({
        total_scans: scans.length,
        safe_products: scans.filter((scan) => scan.status === "Safe").length,
        unsafe_products: scans.filter((scan) => scan.status === "Unsafe").length,
      });
    } else {
      setSummary(emptySummary);
      setError("Dashboard summary is unavailable from the backend right now.");
    }

    if (recentResult.status === "fulfilled") {
      setRecentScans(Array.isArray(recentResult.value.data) ? recentResult.value.data : []);
    } else if (historyResult.status === "fulfilled") {
      const scans = Array.isArray(historyResult.value.data) ? historyResult.value.data : [];
      setRecentScans(scans.slice(-5).reverse());
    } else {
      setRecentScans([]);
      setError((current) => current || "Recent scans are unavailable from the backend right now.");
    }

    if (commonResult.status === "fulfilled") {
      setCommonAllergens(Array.isArray(commonResult.value.data) ? commonResult.value.data : []);
    } else {
      setCommonAllergens([]);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const safeRate = useMemo(() => {
    if (!summary.total_scans) return 0;
    return Math.round((summary.safe_products / summary.total_scans) * 100);
  }, [summary]);

  const latestScan = recentScans[0];
  const dangerousAllergen = commonAllergens[0]?.allergen || "Not enough data";
  const firstName = user?.name?.split(" ")?.[0] || "there";

  return (
    <div className="space-y-7">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-white/70 bg-slate-950 px-6 py-7 text-white shadow-2xl shadow-primary-500/10 ring-1 ring-white/10 sm:px-8">
        <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-primary-500/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-44 w-44 rounded-full bg-success-500/18 blur-3xl" />
        <div className="relative grid gap-7 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div>
            <Badge tone="primary" className="bg-white/10 text-blue-100 ring-white/20">
              <Sparkles size={14} />
              Health Workspace
            </Badge>
            <h2 className="mt-5 max-w-4xl text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              {greeting()}, {firstName}. Let&apos;s make today&apos;s food choices safer.
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-blue-50/80">
              AllergyShield turns scans into a personal food-safety signal, so every label becomes easier to trust.
            </p>
          </div>
          <Button type="button" variant="secondary" onClick={loadDashboard} disabled={loading} icon={RefreshCw}>
            Refresh insights
          </Button>
        </div>
      </section>

      {error && (
        <div className="flex items-center gap-2 rounded-3xl border border-danger-500/10 bg-danger-50 px-5 py-4 text-sm font-bold text-danger-600 dark:bg-danger-500/10">
          <AlertTriangle size={18} className="shrink-0" />
          {error}
        </div>
      )}

      <section className="grid gap-6 xl:grid-cols-[minmax(18rem,0.78fr)_minmax(0,1.22fr)]">
        <ProtectionPanel safeRate={safeRate} summary={summary} />

        <div className="grid gap-6 lg:grid-cols-2">
          <InsightPanel
            icon={ScanLine}
            eyebrow="Recent food scan"
            title={latestScan ? `Scan #${latestScan.scan_id || latestScan.id}` : "No scan yet"}
            tone={latestScan?.status === "Unsafe" ? "danger" : "success"}
            body={
              latestScan
                ? `Detected allergens: ${allergenText(latestScan.detected_allergens)}`
                : "Start with one product label to build your safety story."
            }
          />
          <InsightPanel
            icon={ShieldAlert}
            eyebrow="Most watched allergen"
            title={dangerousAllergen}
            tone={dangerousAllergen === "Not enough data" ? "neutral" : "warning"}
            body="The allergen that appears most often in your recent scan history."
          />
          <InsightPanel
            icon={CheckCircle2}
            eyebrow="Recently safe products"
            title={`${summary.safe_products} safe`}
            tone="success"
            body="Products that did not match your saved allergy profile."
          />
          <InsightPanel
            icon={CalendarDays}
            eyebrow="Weekly pattern"
            title={summary.total_scans ? `${summary.total_scans} food decisions` : "Waiting for scans"}
            tone="primary"
            body="Your timeline becomes more useful as you scan more labels."
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(22rem,0.88fr)]">
        <Card className="overflow-hidden p-0">
          <div className="border-b border-ink-100 px-6 py-5 dark:border-slate-800">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-500">
                  What happened?
                </p>
                <h3 className="mt-1 text-2xl font-black text-ink-900 dark:text-white">
                  Recent Scan Timeline
                </h3>
              </div>
              <Clock3 className="text-primary-500" size={24} />
            </div>
          </div>
          {loading ? (
            <div className="grid gap-3 p-6">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : recentScans.length ? (
            <div className="space-y-1 p-4">
              {recentScans.map((scan, index) => (
                <TimelineItem key={scan.scan_id || scan.id || scan.image_path} scan={scan} index={index} />
              ))}
            </div>
          ) : (
            <EmptyPanel text="No scans yet. Your food safety timeline will appear after your first scan." />
          )}
        </Card>

        <Card className="p-6">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-500">
            Ingredient network
          </p>
          <h3 className="mt-1 text-2xl font-black text-ink-900 dark:text-white">Allergen Bubbles</h3>
          <p className="mt-2 text-base leading-7 text-ink-500 dark:text-slate-400">
            Bubbles grow with exposure frequency, turning repeated risk into a visible pattern.
          </p>
          {loading ? (
            <div className="mt-6 grid gap-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : commonAllergens.length ? (
            <div className="mt-7 flex min-h-72 flex-wrap content-center items-center justify-center gap-3 rounded-[2rem] bg-gradient-to-br from-primary-50 to-accent-50 p-5 dark:from-slate-950 dark:to-slate-900">
              {commonAllergens.map((item, index) => (
                <AllergenBubble key={item.allergen} item={item} index={index} />
              ))}
            </div>
          ) : (
            <EmptyPanel text="No allergen patterns yet. Scan more labels to build your ingredient network." />
          )}
        </Card>
      </section>
    </div>
  );
}

function ProtectionPanel({ safeRate, summary }) {
  const circumference = 2 * Math.PI * 86;
  const progress = (safeRate / 100) * circumference;
  const tone = safeRate >= 80 ? "#22C55E" : safeRate >= 45 ? "#F59E0B" : "#EF4444";

  return (
    <Card className="relative min-h-[31rem] overflow-hidden bg-gradient-to-br from-white to-primary-50/70 p-7 dark:from-slate-900 dark:to-slate-950">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-primary-500/10 blur-2xl" />
      <p className="text-sm font-black uppercase tracking-[0.18em] text-primary-500">
        Should I trust today?
      </p>
      <h3 className="mt-2 text-3xl font-black text-ink-900 dark:text-white">Protection Score</h3>
      <div className="relative mx-auto mt-7 flex h-72 w-72 items-center justify-center">
        <svg viewBox="0 0 220 220" className="h-full w-full -rotate-90">
          <circle cx="110" cy="110" r="86" fill="none" stroke="rgba(100,116,139,0.15)" strokeWidth="18" />
          <circle
            cx="110"
            cy="110"
            r="86"
            fill="none"
            stroke={tone}
            strokeLinecap="round"
            strokeWidth="18"
            strokeDasharray={`${progress} ${circumference - progress}`}
          />
        </svg>
        <div className="absolute text-center">
          <p className="text-6xl font-black tracking-tight text-ink-900 dark:text-white">{safeRate}%</p>
          <p className="mt-2 text-sm font-black uppercase tracking-[0.22em] text-ink-400">
            shield score
          </p>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3">
        <MiniMetric label="Scans" value={summary.total_scans} />
        <MiniMetric label="Safe" value={summary.safe_products} />
        <MiniMetric label="Unsafe" value={summary.unsafe_products} danger />
      </div>
    </Card>
  );
}

function MiniMetric({ label, value, danger = false }) {
  return (
    <div className="rounded-3xl bg-white/78 p-4 text-center shadow-sm ring-1 ring-ink-100 dark:bg-slate-950/60 dark:ring-slate-800">
      <p className={`text-2xl font-black ${danger ? "text-danger-500" : "text-ink-900 dark:text-white"}`}>
        {value}
      </p>
      <p className="mt-1 text-xs font-black uppercase tracking-[0.16em] text-ink-400">{label}</p>
    </div>
  );
}

function InsightPanel({ icon: Icon, eyebrow, title, body, tone }) {
  const tones = {
    primary: "from-primary-500/12 to-primary-50 text-primary-600",
    success: "from-success-500/12 to-success-50 text-success-600",
    warning: "from-warning-500/14 to-warning-50 text-warning-600",
    danger: "from-danger-500/14 to-danger-50 text-danger-600",
    neutral: "from-ink-100 to-white text-ink-500",
  };

  return (
    <Card hover className="min-h-56 p-6">
      <div className={`mb-5 flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-gradient-to-br ${tones[tone]}`}>
        <Icon size={24} />
      </div>
      <p className="text-xs font-black uppercase tracking-[0.18em] text-ink-400">{eyebrow}</p>
      <h3 className="mt-2 text-2xl font-black text-ink-900 dark:text-white">{title}</h3>
      <p className="mt-3 text-base leading-7 text-ink-500 dark:text-slate-400">{body}</p>
    </Card>
  );
}

function TimelineItem({ scan, index }) {
  const unsafe = scan.status === "Unsafe";
  return (
    <article className="group grid gap-4 rounded-[1.75rem] p-4 transition hover:bg-primary-50/70 dark:hover:bg-slate-800/60 sm:grid-cols-[auto_1fr_auto] sm:items-center">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${unsafe ? "bg-danger-50 text-danger-500" : "bg-success-50 text-success-500"}`}>
        {unsafe ? <ShieldAlert size={22} /> : <ShieldCheck size={22} />}
      </div>
      <div>
        <p className="text-lg font-black text-ink-900 dark:text-white">
          {index === 0 ? "Latest scan" : `Scan #${scan.scan_id || scan.id}`}
        </p>
        <p className="mt-1 text-sm font-semibold text-ink-500 dark:text-slate-400">
          Allergens: {allergenText(scan.detected_allergens)}
        </p>
      </div>
      <Badge tone={unsafe ? "danger" : "success"}>{scan.status || "Unknown"}</Badge>
    </article>
  );
}

function AllergenBubble({ item, index }) {
  const size = Math.min(8.5, 5.2 + Number(item.count || 1) * 0.9);
  const colors = ["bg-danger-500", "bg-warning-500", "bg-primary-500", "bg-accent-500", "bg-success-500"];
  return (
    <div
      className={`flex items-center justify-center rounded-full px-4 text-center text-sm font-black text-white shadow-xl ${colors[index % colors.length]}`}
      style={{ width: `${size}rem`, height: `${size}rem` }}
      title={`${item.allergen}: ${item.count}`}
    >
      <span>
        {item.allergen}
        <span className="mt-1 block text-xs opacity-80">{item.count}</span>
      </span>
    </div>
  );
}

function EmptyPanel({ text }) {
  return (
    <div className="m-5 rounded-[1.75rem] bg-ink-50 p-6 text-base font-semibold leading-7 text-ink-500 dark:bg-slate-950 dark:text-slate-400">
      {text}
    </div>
  );
}

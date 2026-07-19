import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CalendarClock, ChevronLeft, ChevronRight, RefreshCw, Search } from "lucide-react";
import { fetchScanHistory } from "../api/historyApi";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Skeleton from "../components/ui/Skeleton";

const PAGE_SIZE = 5;

export default function ScanHistory() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const loadHistory = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await fetchScanHistory();
      const rows = Array.isArray(data) ? data : [];
      setScans([...rows].sort((a, b) => (b.id || 0) - (a.id || 0)));
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not load scan history.");
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query, filter]);

  const filtered = useMemo(() => {
    return scans.filter((scan) => {
      const matchesStatus = filter === "All" || scan.status === filter;
      const text = `${scan.id || ""} ${scan.detected_allergens || ""} ${scan.extracted_text || ""}`.toLowerCase();
      return matchesStatus && text.includes(query.toLowerCase());
    });
  }, [scans, query, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Badge tone="primary">
            <CalendarClock size={13} />
            Timeline
          </Badge>
          <h2 className="mt-3 text-3xl font-extrabold text-ink-900 dark:text-white">Scan history</h2>
          <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
            Every scan returned by the backend history route.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={loadHistory} disabled={loading} icon={RefreshCw}>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600 dark:bg-danger-500/10">
          <AlertCircle size={17} className="shrink-0" />
          {error}
        </div>
      )}

      <Card className="p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
          <Input
            icon={Search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by scan ID, allergen, or extracted text"
            aria-label="Search scan history"
          />
          <div className="flex rounded-2xl bg-ink-50 p-1 dark:bg-slate-800">
            {["All", "Safe", "Unsafe"].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                  filter === item
                    ? "bg-white text-primary-600 shadow-sm dark:bg-slate-950"
                    : "text-ink-500 hover:text-ink-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden p-5">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : visible.length ? (
          <div className="relative space-y-5 before:absolute before:left-4 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-ink-100 dark:before:bg-slate-800">
            {visible.map((scan) => (
              <article key={scan.id} className="relative pl-11">
                <span className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-white ring-8 ring-white dark:bg-slate-900 dark:ring-slate-900">
                  <span className={`h-3 w-3 rounded-full ${scan.status === "Safe" ? "bg-success-500" : "bg-danger-500"}`} />
                </span>
                <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950/60">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-ink-900 dark:text-white">Scan #{scan.id}</p>
                        <StatusBadge status={scan.status} />
                      </div>
                      <p className="mt-2 text-sm text-ink-600 dark:text-slate-300">
                        Detected allergens:{" "}
                        <span className="font-semibold">{scan.detected_allergens || "None detected"}</span>
                      </p>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-ink-500 dark:text-slate-400">
                        {scan.extracted_text || "No extracted text saved."}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-medium text-ink-500 dark:text-slate-400">
                      <CalendarClock size={14} />
                      {scan.scanned_at ? new Date(scan.scanned_at).toLocaleString() : "No date"}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-5 text-sm text-ink-500 dark:text-slate-400">No scan history found.</p>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-500 dark:text-slate-400">
          Showing {visible.length} of {filtered.length} scans
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={ChevronLeft}
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
          >
            Prev
          </Button>
          <span className="text-sm font-bold text-ink-700 dark:text-slate-200">
            {page} / {pageCount}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            icon={ChevronRight}
            disabled={page >= pageCount}
            onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const safe = status === "Safe";
  return <Badge tone={safe ? "success" : "danger"}>{status || "Unknown"}</Badge>;
}

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CheckCircle2,
  FileImage,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { scanProductLabel } from "../api/scanApi";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Progress from "../components/ui/Progress";
import { normalizeRiskScore } from "../utils/riskScore";

export default function ScanLabel() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const progress = loading ? 78 : file ? 18 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Choose a product label image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const { data } = await scanProductLabel(file);
      setResult(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not scan this image.");
    } finally {
      setLoading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <Card className="p-6">
        <div className="mb-6">
          <Badge tone="primary">
            <FileImage size={13} />
            Upload label
          </Badge>
          <h2 className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">
            Scan product label
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink-500 dark:text-slate-400">
            Uploads as multipart/form-data field `file`.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600 dark:bg-danger-500/10">
            <AlertCircle size={17} className="shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`flex min-h-72 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-4 py-8 text-center transition ${
              dragging
                ? "border-primary-500 bg-primary-50 dark:bg-primary-500/10"
                : "border-ink-200 bg-ink-50 hover:border-primary-300 hover:bg-primary-50/60 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-primary-500/10"
            }`}
          >
            {preview ? (
              <div className="w-full">
                <img
                  src={preview}
                  alt="Selected label preview"
                  className="mx-auto max-h-56 rounded-2xl object-contain shadow-lg"
                />
                <p className="mt-4 truncate text-sm font-bold text-ink-900 dark:text-white">{file.name}</p>
              </div>
            ) : (
              <>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-primary-500 shadow-lg dark:bg-slate-800"
                >
                  <UploadCloud size={30} />
                </motion.div>
                <span className="mt-5 text-base font-bold text-ink-900 dark:text-white">
                  Drag and drop a label image
                </span>
                <span className="mt-2 text-sm text-ink-500 dark:text-slate-400">
                  or click to browse from your device
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>

          <div className="flex items-center justify-between gap-3 text-xs text-ink-500 dark:text-slate-400">
            <span>Supported formats: PNG, JPG, JPEG, WEBP</span>
            {file && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  setResult(null);
                }}
                className="inline-flex items-center gap-1.5 font-bold text-danger-600"
              >
                <Trash2 size={14} />
                Remove
              </button>
            )}
          </div>

          {!result && (
            <div>
              <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink-500 dark:text-slate-400">
                <span>{loading ? "Scanning label" : file ? "Image ready to scan" : "Waiting for image"}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} tone={loading ? "primary" : "warning"} />
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full" icon={loading ? Loader2 : UploadCloud}>
            {loading ? "Processing image..." : "Scan label"}
          </Button>
        </form>
      </Card>

      <ResultPanel result={result} loading={loading} />
    </div>
  );
}

function ResultPanel({ result, loading }) {
  const groups = useMemo(() => {
    const matched = result?.matched_allergens || [];
    return {
      danger: matched.filter((item) => item.severity === "High"),
      warning: matched.filter((item) => item.severity && item.severity !== "High"),
      safe: matched.length ? [] : ["No saved allergies matched."],
    };
  }, [result]);

  const normalizedRiskScore = normalizeRiskScore(result?.risk_score, result?.status);

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Badge tone={result?.status === "Unsafe" ? "danger" : result ? "success" : "neutral"}>
            {result?.status || "Awaiting scan"}
          </Badge>
          <h3 className="mt-3 text-2xl font-extrabold text-ink-900 dark:text-white">Scan result</h3>
          <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
            AI output grouped by safety level with recommendations.
          </p>
        </div>
        {loading && <Loader2 className="animate-spin text-primary-500" size={24} />}
      </div>

      {!result ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl bg-ink-50 p-8 text-center dark:bg-slate-900">
          <ShieldCheck size={42} className="text-primary-500" />
          <p className="mt-4 text-sm font-semibold text-ink-700 dark:text-slate-200">
            Your backend scan result will appear here.
          </p>
          <p className="mt-2 max-w-sm text-sm text-ink-500 dark:text-slate-400">
            Upload a clear ingredient label to see allergens, risk score, and recommendations.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-bold text-ink-900 dark:text-white">
                Risk: {result.risk_level || "Unknown"}
              </span>
              <span className="font-semibold text-ink-500 dark:text-slate-400">
                {normalizedRiskScore}/100
              </span>
            </div>
            <Progress
              value={normalizedRiskScore}
              tone={normalizedRiskScore >= 70 ? "danger" : normalizedRiskScore >= 40 ? "warning" : "success"}
            />
          </div>

          <IngredientGroup title="Danger" tone="danger" icon={ShieldAlert} items={groups.danger} />
          <IngredientGroup title="Warning" tone="warning" icon={AlertCircle} items={groups.warning} />
          <IngredientGroup title="Safe" tone="success" icon={CheckCircle2} items={groups.safe} />

          <ResultBlock title="Detected on label">
            <p className="rounded-2xl bg-warning-50 p-4 text-sm font-semibold leading-6 text-warning-600 dark:bg-warning-500/10">
              {result.detected_allergens || "No known allergens detected in the label text."}
            </p>
            {!result.matched_allergens?.length && result.detected_allergens && (
              <p className="mt-2 text-xs font-semibold text-ink-500 dark:text-slate-400">
                These were found on the label, but none matched your saved allergy profile.
              </p>
            )}
          </ResultBlock>

          <ResultBlock title="Recommendations">
            <ul className="space-y-2 text-sm text-ink-600 dark:text-slate-300">
              {(result.recommendations || []).map((item) => (
                <li key={item} className="flex gap-2 rounded-2xl bg-ink-50 p-3 dark:bg-slate-900">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-success-500" size={16} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </ResultBlock>

          <ResultBlock title="Extracted ingredients">
            <p className="max-h-56 overflow-y-auto whitespace-pre-wrap rounded-2xl bg-ink-50 p-4 text-sm leading-6 text-ink-600 dark:bg-slate-900 dark:text-slate-300">
              {result.ingredients || "No ingredients text returned."}
            </p>
          </ResultBlock>
        </div>
      )}
    </Card>
  );
}

function IngredientGroup({ title, tone, icon: Icon, items }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className={tone === "danger" ? "text-danger-500" : tone === "warning" ? "text-warning-500" : "text-success-500"} />
        <h4 className="text-sm font-bold text-ink-900 dark:text-white">{title}</h4>
      </div>
      {items.length ? (
        <div className="space-y-2">
          {items.map((item, index) =>
            typeof item === "string" ? (
              <p key={item} className="rounded-2xl bg-success-50 p-3 text-sm text-success-600 dark:bg-success-500/10">
                {item}
              </p>
            ) : (
              <div key={`${item.allergen}-${index}`} className="rounded-2xl bg-ink-50 p-4 dark:bg-slate-900">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{item.allergen}</p>
                  <Badge tone={tone}>Confidence {item.confidence || "High"}</Badge>
                </div>
                <p className="mt-1 text-xs font-semibold text-ink-500 dark:text-slate-400">
                  Severity: {item.severity || "Unknown"}
                </p>
                {item.reason && <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-slate-300">{item.reason}</p>}
              </div>
            )
          )}
        </div>
      ) : (
        <p className="rounded-2xl bg-ink-50 p-3 text-sm text-ink-500 dark:bg-slate-900 dark:text-slate-400">
          No ingredients in this group.
        </p>
      )}
    </div>
  );
}

function ResultBlock({ title, children }) {
  return (
    <div>
      <h4 className="mb-2 text-sm font-bold text-ink-900 dark:text-white">{title}</h4>
      {children}
    </div>
  );
}

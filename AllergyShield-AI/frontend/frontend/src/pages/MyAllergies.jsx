import { useState, useEffect } from "react";
import { AlertCircle, CheckCircle2, Plus, ShieldPlus, X } from "lucide-react";
import { saveMyAllergies, fetchMyAllergies } from "../api/allergyApi";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function MyAllergies() {
  const [allergies, setAllergies] = useState([]);
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const addAllergy = () => {
    const value = entry.trim();
    if (!value) return;
    setAllergies((current) =>
      current.some((item) => item.toLowerCase() === value.toLowerCase()) ? current : [...current, value]
    );
    setEntry("");
  };

  useEffect(() => {
    const loadAllergies = async () => {
      try {
        const { data } = await fetchMyAllergies();
        setAllergies(Array.isArray(data.allergies) ? data.allergies : []);
      } catch {
        setAllergies([]);
      }
    };

    loadAllergies();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await saveMyAllergies(allergies);
      setAllergies(Array.isArray(data.allergies) ? data.allergies : allergies);
      setMessage(data.message || "Allergies saved successfully.");
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not save allergies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Badge tone="primary">
          <ShieldPlus size={13} />
          Allergy profile
        </Badge>
        <h2 className="mt-3 text-3xl font-extrabold text-ink-900 dark:text-white">My allergies</h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
          Saved allergens are used by backend scans.
        </p>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-ink-900 dark:text-white">Allergen watch list</h3>
          <p className="mt-1 text-sm text-ink-500 dark:text-slate-400">
            Only names that exist in the backend allergy table are saved.
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600 dark:bg-danger-500/10">
            <AlertCircle size={17} className="shrink-0" />
            {error}
          </div>
        )}
        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-success-50 px-4 py-3 text-sm font-medium text-success-600 dark:bg-success-500/10">
            <CheckCircle2 size={17} className="shrink-0" />
            {message}
          </div>
        )}

        <form onSubmit={save} className="space-y-5">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addAllergy();
                }
              }}
              placeholder="Milk, Peanut, Soy..."
              className="min-w-0 flex-1 rounded-2xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 outline-none transition focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
            />
            <Button type="button" variant="secondary" onClick={addAllergy} icon={Plus}>
              Add
            </Button>
          </div>

          <div className="flex min-h-28 flex-wrap gap-2 rounded-3xl bg-ink-50 p-4 dark:bg-slate-900">
            {allergies.length ? (
              allergies.map((allergy) => (
                <span
                  key={allergy}
                  className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-3 text-sm font-bold text-ink-700 shadow-sm ring-1 ring-ink-100 dark:bg-slate-950 dark:text-slate-200 dark:ring-slate-800"
                >
                  {allergy}
                  <button
                    type="button"
                    aria-label={`Remove ${allergy}`}
                    onClick={() => setAllergies((current) => current.filter((item) => item !== allergy))}
                    className="text-ink-400 hover:text-danger-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))
            ) : (
              <p className="text-sm text-ink-500 dark:text-slate-400">No allergies selected.</p>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save allergies"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

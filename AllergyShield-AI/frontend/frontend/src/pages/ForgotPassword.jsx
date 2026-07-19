import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { checkEmailExists, forgotPasswordRequest } from "../api/authApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const emailError = useMemo(() => {
    if (!email) return "";
    return /\S+@\S+\.\S+/.test(email) ? "" : "Enter a valid email address.";
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError) return;

    setLoading(true);
    setMessage("");
    setResetLink("");
    setError("");

    try {
      const existsResponse = await checkEmailExists(email);
      if (!existsResponse.data.exists) {
        setError("No account exists with this email address.");
        return;
      }

      const { data } = await forgotPasswordRequest(email);
      setMessage(data.message || "Reset email sent.");
      setResetLink(data.reset_link || "");
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not start password reset. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/25">
            <ShieldCheck size={25} />
          </div>
          <h1 className="text-3xl font-extrabold text-ink-900 dark:text-white">Reset password</h1>
          <p className="mt-3 text-base leading-7 text-ink-500 dark:text-slate-400">
            Enter your account email. We&apos;ll check it exists and send a reset link.
          </p>
        </div>

        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-success-50 px-4 py-3 text-sm font-bold text-success-600 dark:bg-success-500/10">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {resetLink && (
          <div className="mb-4 rounded-2xl border border-primary-500/20 bg-primary-50 p-4 text-sm dark:bg-primary-500/10">
            <p className="font-bold text-ink-900 dark:text-white">Development reset link</p>
            <Link className="mt-2 block break-all font-semibold text-primary-600" to={resetLink.replace(/^https?:\/\/[^/]+/, "")}>
              {resetLink}
            </Link>
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-bold text-danger-600 dark:bg-danger-500/10">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-ink-700 dark:text-slate-200">
              Email address
            </span>
            <Input
              icon={Mail}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              error={emailError}
            />
          </label>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Checking email..." : "Send reset link"}
          </Button>
        </form>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mx-auto mt-6 flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft size={16} />
          Back to login
        </button>
      </Card>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { resetPasswordRequest } from "../api/authApi";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Progress from "../components/ui/Progress";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const passwordError = password && password.length < 6 ? "Password must be at least 6 characters." : "";
  const confirmError =
    confirmPassword && password !== confirmPassword ? "Passwords do not match." : "";
  const strength = useMemo(
    () => Math.min(100, password.length * 14 + (/[A-Z]/.test(password) ? 16 : 0)),
    [password]
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (passwordError || confirmError || !password || !confirmPassword) return;

    setLoading(true);

    try {
      const { data } = await resetPasswordRequest(token, password);
      setMessage(data.message || "Password reset successful.");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.response?.data?.detail || "Failed to reset password.");
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
          <h1 className="text-3xl font-extrabold text-ink-900 dark:text-white">Create new password</h1>
          <p className="mt-3 text-base leading-7 text-ink-500 dark:text-slate-400">
            Choose a new password for your AllergyShield AI account.
          </p>
        </div>

        {message && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-success-50 px-4 py-3 text-sm font-bold text-success-600 dark:bg-success-500/10">
            <CheckCircle2 size={17} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-bold text-danger-600 dark:bg-danger-500/10">
            <AlertCircle size={17} />
            {error}
          </div>
        )}

        {token ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-700 dark:text-slate-200">
                New password
              </span>
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  error={passwordError}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-3 text-ink-400 hover:text-ink-700 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <Progress value={strength} tone={strength > 70 ? "success" : "warning"} />
                </div>
              )}
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-700 dark:text-slate-200">
                Confirm password
              </span>
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                error={confirmError}
              />
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset password"}
            </Button>
          </form>
        ) : (
          <Button as={Link} to="/forgot-password" className="w-full">
            Request a new reset link
          </Button>
        )}

        <p className="mt-6 text-center text-sm text-ink-500 dark:text-slate-400">
          Remembered it?{" "}
          <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
            Back to login
          </Link>
        </p>
      </Card>
    </div>
  );
}

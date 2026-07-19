import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Progress from "../components/ui/Progress";
import { pageTransition } from "../animations/page";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return "";
    return /\S+@\S+\.\S+/.test(email) ? "" : "Enter a valid email address.";
  }, [email]);
  const nameError = name && name.trim().length < 2 ? "Name must be at least 2 characters." : "";
  const passwordError = password && password.length < 6 ? "Password must be at least 6 characters." : "";
  const strength = Math.min(100, password.length * 14 + (/[A-Z]/.test(password) ? 16 : 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (nameError || emailError || passwordError) return;
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.response?.data?.detail || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition} className="page-shell grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
      <section className="flex items-center justify-center px-4 py-10 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="glass-panel w-full max-w-md rounded-3xl p-8"
        >
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-500 text-white">
              <ShieldCheck size={23} />
            </div>
            <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Create your account</h1>
            <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
              Start scanning safely with AllergyShield AI
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-medium text-danger-600 dark:bg-danger-500/10">
              <AlertCircle size={17} className="shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 flex items-center gap-2 rounded-2xl bg-success-50 px-4 py-3 text-sm font-medium text-success-600 dark:bg-success-500/10">
              <CheckCircle2 size={17} className="shrink-0" />
              Account created! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700 dark:text-slate-200">
                Full name
              </span>
              <Input
                icon={User}
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                error={nameError}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700 dark:text-slate-200">
                Email
              </span>
              <Input
                icon={Mail}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="@email.com"
                error={emailError}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-ink-700 dark:text-slate-200">
                Password
              </span>
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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
                  <p className="mt-1 text-xs text-ink-500 dark:text-slate-400">
                    Password strength indicator
                  </p>
                </div>
              )}
            </label>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creating account..." : "Sign up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-primary-600 hover:text-primary-700">
              Log in
            </Link>
          </p>
        </motion.div>
      </section>

      <section className="hidden flex-col justify-between px-10 py-10 lg:flex">
        <Link to="/" className="flex items-center justify-end gap-3">
          <span className="text-lg font-extrabold text-ink-900 dark:text-white">AllergyShield AI</span>
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500 text-white shadow-lg shadow-primary-500/25">
            <ShieldCheck size={22} />
          </span>
        </Link>
        <div className="ml-auto max-w-xl text-right">
          <p className="text-sm font-bold uppercase tracking-[0.22em] text-primary-500">Personalized scanning</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight text-ink-900 dark:text-white">
            Build your allergy-aware AI workspace.
          </h1>
          <p className="mt-5 text-lg leading-8 text-ink-500 dark:text-slate-400">
            Save your profile, scan food labels, and review risks in one calm dashboard.
          </p>
        </div>
        <p className="text-right text-sm text-ink-500 dark:text-slate-400">
          Designed for clarity before every bite.
        </p>
      </section>
    </motion.div>
  );
}

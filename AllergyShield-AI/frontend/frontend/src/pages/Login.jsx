import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Eye,
  EyeOff,
  HeartPulse,
  Lock,
  Mail,
  ScanLine,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { pageTransition } from "../animations/page";

const features = [
  "OCR Ingredient Detection",
  "AI Allergen Analysis",
  "Risk Prediction",
  "Scan History",
  "Secure Cloud Profile",
];

const stats = [
  ["1000+", "Ingredients"],
  ["40+", "Allergens"],
  ["99%", "Accuracy"],
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const emailError = useMemo(() => {
    if (!email) return "";
    return /\S+@\S+\.\S+/.test(email) ? "" : "Enter a valid email address.";
  }, [email]);

  const passwordError =
    password && password.length < 6 ? "Password must be at least 6 characters." : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (emailError || passwordError) return;
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      await login(email, password);
      setSuccess(true);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      {...pageTransition}
      className="relative grid min-h-screen overflow-hidden bg-surface-50 lg:grid-cols-[55fr_45fr]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_8%_12%,rgba(37,99,235,0.22),transparent_28rem),radial-gradient(circle_at_78%_18%,rgba(124,58,237,0.18),transparent_24rem),radial-gradient(circle_at_40%_90%,rgba(34,197,94,0.14),transparent_25rem)]" />
      <FloatingBackground />

      <section className="relative hidden min-h-screen flex-col justify-between px-10 py-9 text-white lg:flex xl:px-16">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-primary-700 to-accent-600" />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14 text-white shadow-xl ring-1 ring-white/20">
              <ShieldCheck size={24} />
            </span>
            <span className="text-xl font-black tracking-tight">AllergyShield AI</span>
          </Link>
          <div className="rounded-full bg-white/12 px-4 py-2 text-sm font-bold ring-1 ring-white/18">
            HIPAA-minded UX
          </div>
        </div>

        <div className="relative z-10 grid items-center gap-10 xl:grid-cols-[0.95fr_1.05fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/12 px-4 py-2 text-sm font-bold ring-1 ring-white/20"
            >
              <Sparkles size={16} />
              AI healthcare food safety
            </motion.div>
            <h1 className="max-w-2xl text-6xl font-black leading-[1.02] tracking-tight xl:text-7xl">
              Food Safety Powered by AI
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-9 text-blue-50/88">
              Scan ingredient labels instantly and receive intelligent allergy risk analysis before
              you eat.
            </p>

            <div className="mt-8 grid gap-3">
              {features.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 * index, duration: 0.22 }}
                  className="flex items-center gap-3 text-base font-bold text-white"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success-500 text-white">
                    <CheckCircle2 size={16} />
                  </span>
                  {item}
                </motion.div>
              ))}
            </div>
          </div>

          <HeroIllustration />
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {stats.map(([value, label]) => (
            <motion.div
              key={label}
              whileHover={{ y: -3 }}
              className="rounded-3xl bg-white/12 p-5 shadow-xl ring-1 ring-white/18"
            >
              <p className="text-4xl font-black">{value}</p>
              <p className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="relative z-10 flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.28 }}
          className="glass-panel w-full max-w-[480px] rounded-[28px] p-7 sm:p-9"
        >
          <div className="mb-8 text-center">
            <motion.div
              initial={{ scale: 0.88, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.28 }}
              className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-500 text-white shadow-xl shadow-primary-500/25"
            >
              <ShieldCheck size={30} />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-ink-900">Welcome Back</h1>
            <p className="mt-3 text-base leading-7 text-ink-500">
              Sign in to continue scanning food labels with AI-powered allergy protection.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 flex items-center gap-2 rounded-2xl bg-danger-50 px-4 py-3 text-sm font-bold text-danger-600 ring-1 ring-danger-500/10"
            >
              <AlertCircle size={17} className="shrink-0" />
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 rounded-2xl bg-success-50 px-4 py-3 text-sm font-bold text-success-600 ring-1 ring-success-500/10"
            >
              <CheckCircle2 size={17} />
              Login successful.
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-700">Email</span>
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

            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink-700">Password</span>
              <div className="relative">
                <Input
                  icon={Lock}
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  error={passwordError}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-3 text-ink-400 transition hover:text-ink-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 font-semibold text-ink-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-ink-300 accent-primary-500"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-bold text-primary-600 hover:text-primary-700">
                Forgot password?
              </Link>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Login"}
            </Button>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-ink-100" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-ink-400">or</span>
              <div className="h-px flex-1 bg-ink-100" />
            </div>

            <button
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white text-base font-bold text-ink-700 shadow-sm transition hover:border-primary-200 hover:bg-primary-50"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 via-success-500 to-warning-500 text-xs font-black text-white">
                G
              </span>
              Continue with Google
            </button>
          </form>

          <p className="mt-7 text-center text-base text-ink-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-black text-primary-600 hover:text-primary-700">
              Create Account
            </Link>
          </p>
        </motion.div>
      </section>
    </motion.div>
  );
}

function FloatingBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[0, 1, 2, 3].map((item) => (
        <span
          key={item}
          className="absolute rounded-full blur-2xl"
          style={{
            width: 140 + item * 28,
            height: 140 + item * 28,
            left: `${12 + item * 22}%`,
            top: `${18 + item * 13}%`,
            background: item % 2 ? "rgba(124,58,237,0.12)" : "rgba(37,99,235,0.12)",
          }}
        />
      ))}
    </div>
  );
}

function HeroIllustration() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32 }}
      className="relative mx-auto flex h-[520px] w-full max-w-lg items-center justify-center"
    >
      <div className="absolute h-96 w-96 rounded-full border border-dashed border-white/28" />
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.2 }}
        className="relative w-80 rounded-[2rem] bg-white p-5 text-slate-900 shadow-xl"
      >
        <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-50 to-violet-50 p-5">
          <div className="flex items-center justify-between">
            <div className="h-12 w-24 rounded-2xl bg-primary-500" />
            <ShieldCheck className="text-success-500" size={34} />
          </div>
          <div className="mt-6 space-y-3">
            <div className="h-3 w-full rounded-full bg-slate-200" />
            <div className="h-3 w-10/12 rounded-full bg-slate-200" />
            <div className="h-3 w-8/12 rounded-full bg-slate-200" />
          </div>
          <div className="mt-5 rounded-2xl bg-danger-50 p-3 text-sm font-black text-danger-600">
            Peanut trace detected
          </div>
        </div>
      </motion.div>

      <FloatingIcon className="left-4 top-12" icon={Brain} label="AI" />
      <FloatingIcon className="right-4 top-20" icon={HeartPulse} label="Care" />
      <FloatingIcon className="bottom-16 left-8" icon={UsersRound} label="Family" />
      <FloatingIcon className="bottom-10 right-8" icon={ScanLine} label="OCR" />
    </motion.div>
  );
}

function FloatingIcon({ icon: Icon, label, className }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className={`absolute flex items-center gap-2 rounded-2xl bg-white/16 px-4 py-3 text-sm font-black text-white shadow-xl ring-1 ring-white/20 ${className}`}
    >
      <Icon size={18} />
      {label}
    </motion.div>
  );
}

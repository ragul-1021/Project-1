import { Mail, ShieldCheck, User } from "lucide-react";
import { useAuth } from "../context/useAuth";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";

export default function Profile() {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <Badge tone="primary">
          <User size={13} />
          Account
        </Badge>
        <h2 className="mt-3 text-3xl font-extrabold text-ink-900 dark:text-white">Profile</h2>
        <p className="mt-2 text-sm text-ink-500 dark:text-slate-400">
          Account details returned by `/auth/profile`.
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="bg-slate-950 px-6 py-8 text-white">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary-500 text-2xl font-extrabold shadow-lg shadow-primary-500/25">
              {initials}
            </div>
            <div>
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-primary-300">
                <ShieldCheck size={15} />
                JWT authenticated
              </p>
              <h3 className="mt-2 text-2xl font-extrabold">{user?.name || "Account"}</h3>
              <p className="mt-1 text-sm text-slate-300">Your saved allergy scans are tied to this profile.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 p-6 md:grid-cols-2">
          <ProfileRow icon={User} label="Name" value={user?.name || "Unavailable"} />
          <ProfileRow icon={Mail} label="Email" value={user?.email || "Unavailable"} />
        </div>
      </Card>
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-ink-50 px-4 py-4 dark:bg-slate-950">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary-500 shadow-sm dark:bg-slate-900">
        <Icon size={19} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-ink-400 dark:text-slate-500">
          {label}
        </p>
        <p className="mt-1 truncate text-sm font-bold text-ink-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import Card from "../ui/Card";
import Badge from "../ui/Badge";

export default function PagePlaceholder({ icon: Icon, title, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mx-auto max-w-3xl"
    >
      <Card className="flex min-h-[60vh] flex-col items-center justify-center p-8 text-center">
        {Icon && (
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-500">
            <Icon size={30} />
          </div>
        )}
        <Badge tone="primary">Coming soon</Badge>
        <h2 className="mt-4 text-2xl font-extrabold text-ink-900 dark:text-white">{title}</h2>
        <p className="mt-3 max-w-md text-sm leading-6 text-ink-500 dark:text-slate-400">
          {description}
        </p>
      </Card>
    </motion.div>
  );
}

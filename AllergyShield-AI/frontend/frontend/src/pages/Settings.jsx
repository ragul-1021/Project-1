import { Settings as SettingsIcon } from "lucide-react";
import PagePlaceholder from "../components/common/PagePlaceholder";

export default function Settings() {
  return (
    <PagePlaceholder
      icon={SettingsIcon}
      title="Settings"
      description="Account preferences, notifications, and security settings."
    />
  );
}

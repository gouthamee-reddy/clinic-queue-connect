import { AlertTriangle, Clock, UserX, CheckCircle, Bell, Settings2 } from "lucide-react";
import type { Notification } from "../lib/clinic-data";

interface NotificationsTabProps {
  notifications: Notification[];
  onMarkAllRead: () => void;
}

const typeConfig = {
  urgent: {
    bg: "#FCEBEB",
    color: "#A32D2D",
    border: "#F5BABA",
    icon: AlertTriangle,
    label: "Urgent",
    badgeBg: "#FCEBEB",
  },
  warning: {
    bg: "#FAEEDA",
    color: "#854F0B",
    border: "#F5D49A",
    icon: Clock,
    label: "Warning",
    badgeBg: "#FAEEDA",
  },
  info: {
    bg: "#F1EFE8",
    color: "#5F5E5A",
    border: "#D9D7CE",
    icon: UserX,
    label: "Info",
    badgeBg: "#F1EFE8",
  },
  success: {
    bg: "#E1F5EE",
    color: "#0F6E56",
    border: "#A3D9C0",
    icon: CheckCircle,
    label: "Done",
    badgeBg: "#E1F5EE",
  },
};

const SETTINGS = [
  { label: "SMS alerts to patients", description: "Send automated SMS when called", checked: true },
  { label: "Alert when wait > 20 min", description: "Notify staff of long waits", checked: true },
  { label: "No-show auto-skip (10 min)", description: "Auto-move if patient doesn't arrive", checked: true },
  { label: "Daily summary report", description: "End-of-day stats via email", checked: true },
  { label: "WhatsApp integration", description: "Send queue updates via WhatsApp", checked: false },
];

export function NotificationsTab({ notifications, onMarkAllRead }: NotificationsTabProps) {
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-4">
      {/* Notification list */}
      <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Bell size={15} className="text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Alerts</span>
            {unread > 0 && (
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FCEBEB", color: "#A32D2D" }}>
                {unread} unread
              </span>
            )}
          </div>
          <button
            onClick={onMarkAllRead}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Mark all read
          </button>
        </div>

        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <Bell size={32} className="mx-auto mb-3 text-muted-foreground opacity-30" />
            <div className="text-sm text-muted-foreground">No notifications</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((n) => {
              const cfg = typeConfig[n.type];
              const Icon = cfg.icon;
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 px-5 py-4 transition-colors hover:bg-muted/30 ${!n.read ? "bg-muted/20" : ""}`}
                >
                  {/* Unread indicator */}
                  <div className="flex items-start pt-1">
                    {!n.read && (
                      <div className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ background: "#1D9E75" }} />
                    )}
                    {n.read && <div className="w-2" />}
                  </div>

                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: cfg.bg }}
                  >
                    <Icon size={14} style={{ color: cfg.color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-sm font-semibold text-foreground leading-snug">{n.title}</div>
                      <span
                        className="text-[11px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ background: cfg.badgeBg, color: cfg.color }}
                      >
                        {cfg.label}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</div>
                    <div className="text-[11px] text-muted-foreground mt-2 font-medium">{n.time}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <Settings2 size={15} className="text-muted-foreground" />
          <div className="text-sm font-semibold text-foreground">Notification Settings</div>
        </div>
        <div className="divide-y divide-border">
          {SETTINGS.map((s) => (
            <label
              key={s.label}
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors"
            >
              <div>
                <div className="text-sm font-medium text-foreground">{s.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.description}</div>
              </div>
              <div className="relative flex-shrink-0">
                <input type="checkbox" defaultChecked={s.checked} className="sr-only peer" />
                <div className="w-10 h-5 rounded-full border border-border bg-muted peer-checked:bg-[#1D9E75] peer-checked:border-[#1D9E75] transition-all" />
                <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
              </div>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

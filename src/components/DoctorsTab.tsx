import { MessageSquare, TrendingUp, Star } from "lucide-react";
import type { Doctor } from "../lib/clinic-data";
import { doctorStatusConfig } from "../lib/clinic-data";

interface DoctorsTabProps {
  doctors: Doctor[];
}

function QueueBar({ count, max = 10, color }: { count: number; max?: number; color: string }) {
  const pct = Math.min((count / max) * 100, 100);
  return (
    <div className="h-1.5 rounded-full bg-muted overflow-hidden mt-1">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function DoctorsTab({ doctors }: DoctorsTabProps) {
  const onDuty = doctors.filter((d) => d.status !== "off-duty").length;
  const available = doctors.filter((d) => d.status === "available").length;
  const inSession = doctors.filter((d) => d.status === "in-session").length;
  const onBreak = doctors.filter((d) => d.status === "on-break").length;

  return (
    <div className="space-y-4">
      {/* Summary metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "On Duty", value: onDuty, color: "text-foreground" },
          { label: "Available", value: available, color: "text-emerald-600 dark:text-emerald-400" },
          { label: "In Session", value: inSession, color: "text-amber-600 dark:text-amber-400" },
          { label: "On Break", value: onBreak, color: "text-muted-foreground" },
        ].map((m) => (
          <div key={m.label} className="bg-white dark:bg-card rounded-xl border border-border p-4 text-center">
            <div className={`text-2xl font-bold tabular-nums ${m.color}`}>{m.value}</div>
            <div className="text-xs text-muted-foreground mt-1 font-medium">{m.label}</div>
          </div>
        ))}
      </div>

      {/* Doctor cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {doctors.map((doc) => {
          const statusCfg = doctorStatusConfig[doc.status];
          return (
            <div
              key={doc.id}
              className="bg-white dark:bg-card rounded-xl border border-border p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: doc.color, color: doc.colorText }}
                  >
                    {doc.initials}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{doc.name}</div>
                    <div className="text-xs text-muted-foreground">{doc.specialty}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs font-medium" style={{ color: statusCfg.color }}>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: statusCfg.dot }}
                  />
                  {statusCfg.label}
                  {doc.status === "in-session" && doc.sessionMinutes != null && (
                    <span className="text-muted-foreground font-normal">· {doc.sessionMinutes}m</span>
                  )}
                  {doc.status === "on-break" && doc.breakUntil && (
                    <span className="text-muted-foreground font-normal">until {doc.breakUntil}</span>
                  )}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "In Queue", value: doc.queueCount },
                  { label: "Seen Today", value: doc.seenToday },
                  { label: "Avg. Session", value: `${doc.avgSessionMin}m` },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/50 rounded-lg py-2 px-3">
                    <div className="text-base font-bold tabular-nums text-foreground">{s.value}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Queue bar */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-muted-foreground font-medium">Queue load</span>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                  </div>
                </div>
                <QueueBar count={doc.queueCount} color={doc.colorText} />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium py-2 rounded-lg border border-border hover:bg-muted transition-colors text-foreground">
                  <TrendingUp size={12} />
                  Performance
                </button>
                <button
                  className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg text-white transition-all hover:opacity-90"
                  style={{ background: "#1D9E75" }}
                >
                  <MessageSquare size={12} />
                  Message
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

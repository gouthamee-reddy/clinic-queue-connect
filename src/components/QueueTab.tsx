import { useState } from "react";
import {
  Activity,
  Clock,
  Users,
  UserX,
  Plus,
  Phone,
  SkipForward,
  AlertTriangle,
  Star,
  ChevronDown,
  Filter,
} from "lucide-react";
import type { Patient, Priority } from "../lib/clinic-data";
import { priorityConfig } from "../lib/clinic-data";

interface QueueTabProps {
  queue: Patient[];
  onCall: (id: string) => void;
  onSkip: (id: string) => void;
  onAdd: () => void;
  nowServing: Patient | null;
}

const METRIC_CARDS = [
  { label: "In Queue", value: 12, delta: "↓2 from 1hr ago", deltaColor: "#1D9E75", icon: Users },
  { label: "Avg. Wait", value: "18 min", delta: "↑3 min", deltaColor: "#EF9F27", icon: Clock },
  { label: "Seen Today", value: 47, delta: "+8 vs yesterday", deltaColor: "#1D9E75", icon: Activity },
  { label: "No-shows", value: 3, delta: "6% rate", deltaColor: "#888780", icon: UserX },
];

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  if (priority === "normal") return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
      style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
    >
      {priority === "urgent" || priority === "emergency" ? <AlertTriangle size={10} /> : <Star size={10} />}
      {cfg.label}
    </span>
  );
}

function TokenBadge({ token, priority }: { token: string; priority: Priority }) {
  const colors: Record<Priority, { bg: string; color: string }> = {
    normal: { bg: "#E6F1FB", color: "#185FA5" },
    priority: { bg: "#FAEEDA", color: "#854F0B" },
    urgent: { bg: "#FCEBEB", color: "#A32D2D" },
    emergency: { bg: "#FFE0E0", color: "#7B0000" },
  };
  const c = colors[priority];
  return (
    <div
      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
      style={{ background: c.bg, color: c.color }}
    >
      {token.replace("A", "")}
    </div>
  );
}

export function QueueTab({ queue, onCall, onSkip, onAdd, nowServing }: QueueTabProps) {
  const [filter, setFilter] = useState("all");

  const filtered = filter === "all" ? queue : queue.filter((p) => p.doctor.toLowerCase().includes(filter));
  const queueCount = queue.length;

  return (
    <div className="space-y-4">
      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {METRIC_CARDS.map((m, i) => {
          const Icon = m.icon;
          const val = i === 0 ? queueCount : m.value;
          return (
            <div
              key={m.label}
              className="bg-white dark:bg-card rounded-xl border border-border p-4 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{m.label}</span>
                <div className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center">
                  <Icon size={14} className="text-muted-foreground" />
                </div>
              </div>
              <div className="text-2xl font-bold text-foreground tabular-nums">{val}</div>
              <div className="text-[11px] font-medium" style={{ color: m.deltaColor }}>
                {m.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Now Serving */}
      {nowServing && (
        <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0F6E56 100%)" }}>
          <div className="p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-2 h-2 rounded-full bg-white pulse-dot" />
              <span className="text-xs font-semibold uppercase tracking-widest opacity-80">Now Serving</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                {nowServing.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold">{nowServing.name}</div>
                <div className="text-sm opacity-80 mt-0.5">
                  Token {nowServing.token} · {nowServing.doctor} · {nowServing.specialty}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold tabular-nums">8 min</div>
                <div className="text-xs opacity-70">in session</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">Waiting Patients</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-medium">
              {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <select
                className="text-xs pl-7 pr-6 py-1.5 border border-border rounded-lg bg-background text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Doctors</option>
                <option value="priya">Dr. Priya Sharma</option>
                <option value="arjun">Dr. Arjun Mehta</option>
                <option value="kavitha">Dr. Kavitha Rao</option>
                <option value="venkat">Dr. Venkat Prasad</option>
              </select>
              <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: "#1D9E75" }}
            >
              <Plus size={13} />
              Add Patient
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto mb-3 text-muted-foreground opacity-40" />
            <div className="text-sm text-muted-foreground">Queue is empty</div>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((patient, idx) => (
              <div
                key={patient.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors group"
              >
                <span className="text-xs text-muted-foreground w-4 text-center font-medium">{idx + 1}</span>
                <TokenBadge token={patient.token} priority={patient.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-foreground">{patient.name}</span>
                    <PriorityBadge priority={patient.priority} />
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {patient.doctor} · {patient.specialty}
                    {patient.notes && <span className="ml-2 italic">· {patient.notes}</span>}
                  </div>
                </div>
                <div className="hidden sm:block text-right">
                  <div
                    className="text-xs font-semibold px-2 py-1 rounded-full"
                    style={{
                      background: patient.waitMinutes <= 10 ? "#E1F5EE" : patient.waitMinutes <= 20 ? "#FAEEDA" : "#FCEBEB",
                      color: patient.waitMinutes <= 10 ? "#0F6E56" : patient.waitMinutes <= 20 ? "#854F0B" : "#A32D2D",
                    }}
                  >
                    ~{patient.waitMinutes} min
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onCall(patient.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-white transition-all hover:opacity-90"
                    style={{ background: "#1D9E75" }}
                  >
                    <Phone size={11} />
                    Call
                  </button>
                  <button
                    onClick={() => onSkip(patient.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <SkipForward size={11} />
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp, TrendingDown, Clock, Users, Star, Activity } from "lucide-react";
import { HOURLY_DATA, WEEKLY_WAIT, SPECIALTY_DATA } from "../lib/clinic-data";

const TEAL = "#1D9E75";
const BLUE = "#378ADD";

function MetricCard({
  label,
  value,
  sub,
  trend,
  icon: Icon,
  positive = true,
}: {
  label: string;
  value: string;
  sub: string;
  trend?: string;
  icon: React.ElementType;
  positive?: boolean;
}) {
  return (
    <div className="bg-white dark:bg-card rounded-xl border border-border p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center">
          <Icon size={16} className="text-muted-foreground" />
        </div>
        {trend && (
          <div
            className="flex items-center gap-0.5 text-xs font-semibold"
            style={{ color: positive ? "#0F6E56" : "#A32D2D" }}
          >
            {positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        )}
      </div>
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
      <div className="text-[11px] text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-lg text-xs">
        <div className="font-semibold text-foreground mb-1">{label}</div>
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: p.fill || p.color }} />
            <span className="text-muted-foreground">{p.name}:</span>
            <span className="font-medium text-foreground">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function AnalyticsTab() {
  return (
    <div className="space-y-4">
      {/* KPI metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Peak Hour" value="10–11 AM" sub="Highest patient volume" icon={Activity} trend="+2 vs last week" positive={false} />
        <MetricCard label="Satisfaction" value="4.3 / 5" sub="Based on 38 reviews" icon={Star} trend="+0.2" />
        <MetricCard label="Avg. Wait Today" value="18 min" sub="Target: under 20 min" icon={Clock} trend="-3 min" />
        <MetricCard label="Capacity Used" value="74%" sub="47 of 64 slots filled" icon={Users} trend="+8%" />
      </div>

      {/* Hourly chart */}
      <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm font-semibold text-foreground">Patients per Hour</div>
            <div className="text-xs text-muted-foreground">Today, Jun 13</div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: TEAL }} />
            Patients seen
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={HOURLY_DATA} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(v) => (v < 12 ? `${v}AM` : v === 12 ? "12PM" : `${v - 12}PM`)}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--color-muted)", opacity: 0.5 }} />
            <Bar dataKey="patients" name="Patients" fill={TEAL} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Two-col row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Weekly wait time */}
        <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Wait Time Trend</div>
          <div className="text-xs text-muted-foreground mb-4">Average minutes per day this week</div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={WEEKLY_WAIT}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} unit="m" />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="wait"
                name="Avg wait"
                stroke={BLUE}
                strokeWidth={2.5}
                dot={{ r: 4, fill: BLUE, strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Specialty breakdown */}
        <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Specialty Breakdown</div>
          <div className="text-xs text-muted-foreground mb-4">Patient distribution today</div>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={130} height={130}>
              <PieChart>
                <Pie
                  data={SPECIALTY_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={38}
                  outerRadius={60}
                  paddingAngle={3}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {SPECIALTY_DATA.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {SPECIALTY_DATA.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                    <span className="text-muted-foreground">{d.name}</span>
                  </div>
                  <span className="font-semibold text-foreground">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white dark:bg-card rounded-xl border border-border p-5">
        <div className="text-sm font-semibold text-foreground mb-3">Today's Highlights</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { color: "#1D9E75", bg: "#E1F5EE", title: "Efficiency up", body: "Average session time is 12 min — 2 min below this week's average. Dr. Mehta is the fastest today at 9 min." },
            { color: "#854F0B", bg: "#FAEEDA", title: "Peak alert", body: "10–11 AM had 14 patients — 40% above daily average. Consider scheduling extra staff tomorrow." },
            { color: "#185FA5", bg: "#E6F1FB", title: "No-show trend", body: "3 no-shows today (6% rate). SMS reminders sent 30 min before each appointment reduced no-shows by 18%." },
          ].map((insight) => (
            <div key={insight.title} className="rounded-lg p-3" style={{ background: insight.bg }}>
              <div className="text-xs font-bold mb-1" style={{ color: insight.color }}>{insight.title}</div>
              <div className="text-xs text-foreground/80 leading-relaxed">{insight.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback } from "react";
import {
  Activity,
  Stethoscope,
  BarChart3,
  CalendarPlus,
  Bell,
  Wifi,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";

import { QueueTab } from "../components/QueueTab";
import { DoctorsTab } from "../components/DoctorsTab";
import { AnalyticsTab } from "../components/AnalyticsTab";
import { BookingTab } from "../components/BookingTab";
import { NotificationsTab } from "../components/NotificationsTab";
import { AddPatientModal } from "../components/AddPatientModal";
import {
  INITIAL_QUEUE,
  INITIAL_NOTIFICATIONS,
  APPOINTMENTS,
  DOCTORS,
  generatePatient,
} from "../lib/clinic-data";
import type { Patient, Notification, Appointment } from "../lib/clinic-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Clinic Queue Connect — City Care Multispecialty" },
      { name: "description", content: "Real-time clinic queue management dashboard for doctors and staff." },
    ],
  }),
  component: ClinicDashboard,
});

type Tab = "queue" | "doctors" | "analytics" | "booking" | "notifications";

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "queue", label: "Live Queue", icon: Activity },
  { id: "doctors", label: "Doctors", icon: Stethoscope },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "booking", label: "Book", icon: CalendarPlus },
  { id: "notifications", label: "Alerts", icon: Bell },
];

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });
  const toggle = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };
  return { dark, toggle };
}

function ClinicDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("queue");
  const [queue, setQueue] = useState<Patient[]>(INITIAL_QUEUE);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [appointments, setAppointments] = useState<Appointment[]>(APPOINTMENTS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dark, toggle } = useTheme();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const nowServing: Patient = {
    id: "ns",
    token: "A018",
    name: "Ravi Kumar",
    phone: "",
    doctor: "Dr. Priya Sharma",
    specialty: "Cardiology",
    priority: "normal",
    waitMinutes: 0,
    status: "in-session",
    age: 55,
  };

  const handleCall = useCallback((id: string) => {
    setQueue((q) => q.filter((p) => p.id !== id));
  }, []);

  const handleSkip = useCallback((id: string) => {
    setQueue((q) => q.filter((p) => p.id !== id));
  }, []);

  const handleAddPatient = useCallback(
    (data: Omit<Patient, "id" | "token" | "waitMinutes" | "status">) => {
      const p = generatePatient();
      setQueue((q) => [...q, { ...p, ...data }]);
    },
    []
  );

  const handleBook = useCallback((apt: Appointment) => {
    setAppointments((a) => [...a, apt]);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar + Content Layout */}
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col w-60 bg-sidebar border-r border-sidebar-border flex-shrink-0">
          {/* Logo */}
          <div className="px-5 py-5 border-b border-sidebar-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#1D9E75" }}>
                <Stethoscope size={16} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-sidebar-foreground">ClinicQueue</div>
                <div className="text-[10px] text-sidebar-foreground/50">City Care · Jun 13</div>
              </div>
            </div>
          </div>

          {/* Live indicator */}
          <div className="px-5 py-3 border-b border-sidebar-border">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-2 h-2 rounded-full bg-[#1D9E75] pulse-dot" />
              <span className="text-sidebar-foreground/70 font-medium">Live · Real-time updates</span>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={[
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left",
                    active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  ].join(" ")}
                >
                  <Icon size={16} />
                  <span>{label}</span>
                  {id === "notifications" && unreadCount > 0 && (
                    <span className="ml-auto text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="px-5 py-4 border-t border-sidebar-border flex items-center justify-between">
            <div className="text-[11px] text-sidebar-foreground/40">v2.0 · Clinic Queue Connect</div>
            <button onClick={toggle} className="text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors">
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Top header */}
          <header className="flex-shrink-0 bg-white dark:bg-card border-b border-border px-4 md:px-6 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobile menu toggle */}
              <button
                className="md:hidden text-muted-foreground"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <div className="text-base font-bold text-foreground">
                  {TABS.find((t) => t.id === activeTab)?.label}
                </div>
                <div className="text-xs text-muted-foreground hidden sm:block">City Care Multispecialty Clinic</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: "#E1F5EE", color: "#0F6E56" }}>
                <Wifi size={11} />
                Live
              </span>
              <button onClick={toggle} className="md:hidden p-2 text-muted-foreground hover:text-foreground">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Mobile nav */}
          {mobileMenuOpen && (
            <div className="md:hidden border-b border-border bg-white dark:bg-card px-4 py-2 flex gap-1 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => { setActiveTab(id); setMobileMenuOpen(false); }}
                  className={[
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all",
                    activeTab === id
                      ? "text-white"
                      : "text-muted-foreground hover:bg-muted",
                  ].join(" ")}
                  style={activeTab === id ? { background: "#1D9E75" } : {}}
                >
                  <Icon size={13} />
                  {label}
                  {id === "notifications" && unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] px-1.5 rounded-full">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-4 md:p-6">
            {activeTab === "queue" && (
              <QueueTab
                queue={queue}
                onCall={handleCall}
                onSkip={handleSkip}
                onAdd={() => setAddModalOpen(true)}
                nowServing={nowServing}
              />
            )}
            {activeTab === "doctors" && <DoctorsTab doctors={DOCTORS} />}
            {activeTab === "analytics" && <AnalyticsTab />}
            {activeTab === "booking" && (
              <BookingTab appointments={appointments} onBook={handleBook} />
            )}
            {activeTab === "notifications" && (
              <NotificationsTab notifications={notifications} onMarkAllRead={handleMarkAllRead} />
            )}
          </div>
        </main>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAdd={handleAddPatient}
      />
    </div>
  );
}

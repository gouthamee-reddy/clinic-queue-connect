import { useState } from "react";
import { Check, X, Calendar, Clock } from "lucide-react";
import { APPOINTMENTS, appointmentStatusConfig } from "../lib/clinic-data";
import type { Appointment } from "../lib/clinic-data";

interface BookingTabProps {
  appointments: Appointment[];
  onBook: (apt: Appointment) => void;
}

const INITIAL_FORM = {
  name: "",
  phone: "",
  doctor: "",
  visitType: "Consultation",
  date: "",
  time: "",
  priority: "Normal",
  notes: "",
};

export function BookingTab({ appointments, onBook }: BookingTabProps) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Patient name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    if (!form.doctor) errs.doctor = "Please select a doctor";
    if (!form.date) errs.date = "Please select a date";
    if (!form.time) errs.time = "Please select a time slot";
    return errs;
  };

  const handleBook = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const newApt: Appointment = {
      id: `a${Date.now()}`,
      time: form.time,
      patientName: form.name,
      doctor: form.doctor,
      type: form.visitType,
      status: "upcoming",
    };
    onBook(newApt);
    setForm(INITIAL_FORM);
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      {/* Success banner */}
      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ background: "#E1F5EE", borderColor: "#A3D9C0" }}>
          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#1D9E75" }}>
            <Check size={14} className="text-white" />
          </div>
          <div className="text-sm font-medium" style={{ color: "#0F6E56" }}>
            Appointment booked! SMS confirmation sent to patient.
          </div>
        </div>
      )}

      {/* Booking form */}
      <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">New Appointment</div>
          <div className="text-xs text-muted-foreground mt-0.5">Fill in patient details to book</div>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Patient Name" error={errors.name}>
              <input
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass(!!errors.name)}
              />
            </Field>
            <Field label="Phone Number" error={errors.phone}>
              <input
                type="tel"
                placeholder="+91 9XXXXXXXXX"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={fieldClass(!!errors.phone)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Doctor" error={errors.doctor}>
              <select
                value={form.doctor}
                onChange={(e) => setForm({ ...form, doctor: e.target.value })}
                className={fieldClass(!!errors.doctor)}
              >
                <option value="">Select doctor...</option>
                <option>Dr. Priya Sharma — Cardiology</option>
                <option>Dr. Arjun Mehta — General Medicine</option>
                <option>Dr. Kavitha Rao — Pediatrics</option>
                <option>Dr. Venkat Prasad — Orthopedics</option>
              </select>
            </Field>
            <Field label="Visit Type">
              <select
                value={form.visitType}
                onChange={(e) => setForm({ ...form, visitType: e.target.value })}
                className={fieldClass(false)}
              >
                <option>Consultation</option>
                <option>Follow-up</option>
                <option>Emergency</option>
                <option>Lab Review</option>
                <option>Procedure</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Date" error={errors.date}>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={fieldClass(!!errors.date)}
              />
            </Field>
            <Field label="Time Slot" error={errors.time}>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className={fieldClass(!!errors.time)}
              >
                <option value="">Select time...</option>
                <option>9:00 AM</option>
                <option>10:30 AM</option>
                <option>11:30 AM</option>
                <option>2:00 PM</option>
                <option>3:30 PM</option>
                <option>4:30 PM</option>
              </select>
            </Field>
          </div>

          <Field label="Priority Level">
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
              className={fieldClass(false)}
            >
              <option>Normal</option>
              <option>Senior Citizen</option>
              <option>Urgent</option>
              <option>Emergency</option>
            </select>
          </Field>

          <Field label="Symptoms / Notes">
            <textarea
              placeholder="Brief description of symptoms or visit purpose..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={`${fieldClass(false)} resize-none`}
            />
          </Field>

          <div className="flex gap-3 pt-1">
            <button
              onClick={handleBook}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: "#1D9E75" }}
            >
              <Check size={15} />
              Confirm Booking
            </button>
            <button
              onClick={() => { setForm(INITIAL_FORM); setErrors({}); }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-all"
            >
              <X size={15} />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Today's appointments */}
      <div className="bg-white dark:bg-card rounded-xl border border-border overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
          <Calendar size={15} className="text-muted-foreground" />
          <div className="text-sm font-semibold text-foreground">Today's Appointments</div>
          <span className="ml-auto text-xs text-muted-foreground">{appointments.length} scheduled</span>
        </div>
        <div className="divide-y divide-border">
          {appointments.map((apt) => {
            const statusCfg = appointmentStatusConfig[apt.status];
            return (
              <div key={apt.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                <div className="flex items-center gap-1.5 w-16 flex-shrink-0">
                  <Clock size={12} className="text-muted-foreground" />
                  <span className="text-xs font-semibold text-foreground tabular-nums">{apt.time}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground">{apt.patientName}</div>
                  <div className="text-xs text-muted-foreground">{apt.doctor} · {apt.type}</div>
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                  style={{ background: statusCfg.bg, color: statusCfg.color }}
                >
                  {statusCfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function fieldClass(hasError: boolean) {
  return [
    "w-full px-3 py-2.5 text-sm rounded-lg border bg-background text-foreground",
    "focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
    hasError ? "border-destructive focus:ring-destructive/30" : "border-border",
  ].join(" ");
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      {children}
      {error && <span className="text-xs text-destructive font-medium">{error}</span>}
    </div>
  );
}

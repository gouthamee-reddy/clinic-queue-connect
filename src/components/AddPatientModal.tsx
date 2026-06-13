import { useState } from "react";
import { X, UserPlus, Check } from "lucide-react";
import type { Patient, Priority } from "../lib/clinic-data";

interface AddPatientModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (patient: Omit<Patient, "id" | "token" | "waitMinutes" | "status">) => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: "normal", label: "Normal", color: "#185FA5" },
  { value: "priority", label: "Priority", color: "#854F0B" },
  { value: "urgent", label: "Urgent", color: "#A32D2D" },
  { value: "emergency", label: "Emergency", color: "#7B0000" },
];

export function AddPatientModal({ open, onClose, onAdd }: AddPatientModalProps) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    age: "",
    doctor: "",
    specialty: "",
    priority: "normal" as Priority,
    notes: "",
  });

  if (!open) return null;

  const doctorMap: Record<string, string> = {
    "Dr. Priya Sharma": "Cardiology",
    "Dr. Arjun Mehta": "General Medicine",
    "Dr. Kavitha Rao": "Pediatrics",
    "Dr. Venkat Prasad": "Orthopedics",
  };

  const handleDoctorChange = (doc: string) => {
    setForm({ ...form, doctor: doc, specialty: doctorMap[doc] || "" });
  };

  const handleSubmit = () => {
    if (!form.name.trim() || !form.doctor) return;
    onAdd({
      name: form.name,
      phone: form.phone,
      age: form.age ? parseInt(form.age) : undefined,
      doctor: form.doctor,
      specialty: form.specialty,
      priority: form.priority,
      notes: form.notes || undefined,
    });
    setForm({ name: "", phone: "", age: "", doctor: "", specialty: "", priority: "normal", notes: "" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white dark:bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "#E1F5EE" }}>
              <UserPlus size={16} style={{ color: "#0F6E56" }} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">Add Patient to Queue</div>
              <div className="text-xs text-muted-foreground">Walk-in or referral</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Patient Name *</label>
              <input
                autoFocus
                type="text"
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Phone</label>
              <input
                type="tel"
                placeholder="+91 ..."
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Age</label>
              <input
                type="number"
                placeholder="Years"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Doctor *</label>
            <select
              value={form.doctor}
              onChange={(e) => handleDoctorChange(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select doctor...</option>
              {Object.keys(doctorMap).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-2 block">Priority</label>
            <div className="grid grid-cols-4 gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  onClick={() => setForm({ ...form, priority: p.value })}
                  className="py-2 text-xs font-semibold rounded-lg border-2 transition-all text-center"
                  style={{
                    borderColor: form.priority === p.value ? p.color : "var(--color-border)",
                    color: form.priority === p.value ? p.color : "var(--color-muted-foreground)",
                    background: form.priority === p.value ? `${p.color}15` : "transparent",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1.5 block">Notes / Symptoms</label>
            <textarea
              placeholder="Brief description..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleSubmit}
            disabled={!form.name.trim() || !form.doctor}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#1D9E75" }}
          >
            <Check size={15} />
            Add to Queue
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold rounded-xl border border-border text-foreground hover:bg-muted transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

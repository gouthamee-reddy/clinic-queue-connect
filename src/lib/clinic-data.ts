export type Priority = "normal" | "priority" | "urgent" | "emergency";
export type DoctorStatus = "available" | "in-session" | "on-break" | "off-duty";
export type AppointmentStatus = "upcoming" | "in-queue" | "in-session" | "completed" | "no-show" | "cancelled";

export interface Patient {
  id: string;
  token: string;
  name: string;
  phone: string;
  doctor: string;
  specialty: string;
  priority: Priority;
  waitMinutes: number;
  status: AppointmentStatus;
  notes?: string;
  age?: number;
}

export interface Doctor {
  id: string;
  initials: string;
  name: string;
  specialty: string;
  status: DoctorStatus;
  sessionMinutes?: number;
  breakUntil?: string;
  queueCount: number;
  seenToday: number;
  avgSessionMin: number;
  rating: number;
  color: string;
  colorText: string;
}

export interface Notification {
  id: string;
  type: "urgent" | "warning" | "info" | "success";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export interface Appointment {
  id: string;
  time: string;
  patientName: string;
  doctor: string;
  type: string;
  status: AppointmentStatus;
}

export const DOCTORS: Doctor[] = [
  {
    id: "d1",
    initials: "PS",
    name: "Dr. Priya Sharma",
    specialty: "Cardiology",
    status: "in-session",
    sessionMinutes: 8,
    queueCount: 3,
    seenToday: 15,
    avgSessionMin: 12,
    rating: 4.8,
    color: "#E1F5EE",
    colorText: "#0F6E56",
  },
  {
    id: "d2",
    initials: "AM",
    name: "Dr. Arjun Mehta",
    specialty: "General Medicine",
    status: "available",
    queueCount: 2,
    seenToday: 19,
    avgSessionMin: 9,
    rating: 4.6,
    color: "#E6F1FB",
    colorText: "#185FA5",
  },
  {
    id: "d3",
    initials: "KR",
    name: "Dr. Kavitha Rao",
    specialty: "Pediatrics",
    status: "available",
    queueCount: 1,
    seenToday: 8,
    avgSessionMin: 14,
    rating: 4.9,
    color: "#FBEAF0",
    colorText: "#993556",
  },
  {
    id: "d4",
    initials: "VP",
    name: "Dr. Venkat Prasad",
    specialty: "Orthopedics",
    status: "on-break",
    breakUntil: "3:30 PM",
    queueCount: 6,
    seenToday: 5,
    avgSessionMin: 18,
    rating: 4.5,
    color: "#F1EFE8",
    colorText: "#5F5E5A",
  },
];

export const INITIAL_QUEUE: Patient[] = [
  {
    id: "p1",
    token: "A019",
    name: "Sunita Reddy",
    phone: "+91 98765 43210",
    doctor: "Dr. Arjun Mehta",
    specialty: "General Medicine",
    priority: "priority",
    waitMinutes: 5,
    status: "in-queue",
    age: 45,
  },
  {
    id: "p2",
    token: "A020",
    name: "Mohammed Iqbal",
    phone: "+91 87654 32109",
    doctor: "Dr. Priya Sharma",
    specialty: "Cardiology",
    priority: "normal",
    waitMinutes: 12,
    status: "in-queue",
    age: 62,
  },
  {
    id: "p3",
    token: "A021",
    name: "Lakshmi Devi",
    phone: "+91 76543 21098",
    doctor: "Dr. Kavitha Rao",
    specialty: "Pediatrics",
    priority: "normal",
    waitMinutes: 18,
    status: "in-queue",
    age: 7,
  },
  {
    id: "p4",
    token: "A022",
    name: "Rahul Verma",
    phone: "+91 65432 10987",
    doctor: "Dr. Arjun Mehta",
    specialty: "General Medicine",
    priority: "normal",
    waitMinutes: 25,
    status: "in-queue",
    age: 33,
  },
  {
    id: "p5",
    token: "A023",
    name: "Geetha Nair",
    phone: "+91 54321 09876",
    doctor: "Dr. Priya Sharma",
    specialty: "Cardiology",
    priority: "urgent",
    waitMinutes: 6,
    status: "in-queue",
    age: 58,
    notes: "Chest pain, breathlessness",
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "urgent",
    title: "Queue overloaded — Dr. Venkat Prasad",
    message: "6 patients waiting, doctor on break. Consider redirecting to Dr. Mehta.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "warning",
    title: "Wait time exceeded 30 min",
    message: "Geetha Nair (A023) has been waiting 32 min. SMS sent.",
    time: "8 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "warning",
    title: "No-show — Token A015",
    message: "Patient did not arrive within 10 min of call. Slot freed.",
    time: "24 min ago",
    read: false,
  },
  {
    id: "n4",
    type: "success",
    title: "Daily report ready",
    message: "47 patients seen. Peak hour 10–11 AM. Avg wait 18 min.",
    time: "1 hr ago",
    read: true,
  },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "a1", time: "9:00", patientName: "Anil Kumar", doctor: "Dr. Arjun Mehta", type: "Follow-up", status: "completed" },
  { id: "a2", time: "10:30", patientName: "Deepa Krishnan", doctor: "Dr. Priya Sharma", type: "Consultation", status: "in-queue" },
  { id: "a3", time: "2:00", patientName: "Suresh Babu", doctor: "Dr. Venkat Prasad", type: "Orthopedic", status: "upcoming" },
  { id: "a4", time: "3:30", patientName: "Meena Joshi", doctor: "Dr. Kavitha Rao", type: "Pediatrics", status: "upcoming" },
  { id: "a5", time: "4:00", patientName: "Pradeep Nair", doctor: "Dr. Priya Sharma", type: "Cardiology", status: "upcoming" },
];

export const HOURLY_DATA = [
  { hour: "8", patients: 4 },
  { hour: "9", patients: 8 },
  { hour: "10", patients: 14 },
  { hour: "11", patients: 12 },
  { hour: "12", patients: 6 },
  { hour: "1", patients: 3 },
  { hour: "2", patients: 9 },
  { hour: "3", patients: 11 },
  { hour: "4", patients: 7 },
  { hour: "5", patients: 3 },
];

export const WEEKLY_WAIT = [
  { day: "Mon", wait: 22 },
  { day: "Tue", wait: 18 },
  { day: "Wed", wait: 25 },
  { day: "Thu", wait: 15 },
  { day: "Fri", wait: 20 },
  { day: "Sat", wait: 28 },
];

export const SPECIALTY_DATA = [
  { name: "General", value: 42, color: "#1D9E75" },
  { name: "Cardiology", value: 28, color: "#378ADD" },
  { name: "Pediatrics", value: 18, color: "#D4537E" },
  { name: "Ortho", value: 12, color: "#EF9F27" },
];

export const priorityConfig: Record<Priority, { label: string; color: string; bg: string; border: string }> = {
  normal: { label: "Normal", color: "#185FA5", bg: "#E6F1FB", border: "#B3D0F5" },
  priority: { label: "Priority", color: "#854F0B", bg: "#FAEEDA", border: "#F5D49A" },
  urgent: { label: "Urgent", color: "#A32D2D", bg: "#FCEBEB", border: "#F5BABA" },
  emergency: { label: "Emergency", color: "#7B0000", bg: "#FFE0E0", border: "#FFB3B3" },
};

export const doctorStatusConfig: Record<DoctorStatus, { label: string; color: string; dot: string }> = {
  available: { label: "Available", color: "#0F6E56", dot: "#1D9E75" },
  "in-session": { label: "In Session", color: "#854F0B", dot: "#EF9F27" },
  "on-break": { label: "On Break", color: "#5F5E5A", dot: "#888780" },
  "off-duty": { label: "Off Duty", color: "#5F5E5A", dot: "#888780" },
};

export const appointmentStatusConfig: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  upcoming: { label: "Upcoming", color: "#185FA5", bg: "#E6F1FB" },
  "in-queue": { label: "In Queue", color: "#854F0B", bg: "#FAEEDA" },
  "in-session": { label: "In Session", color: "#0F6E56", bg: "#E1F5EE" },
  completed: { label: "Completed", color: "#0F6E56", bg: "#E1F5EE" },
  "no-show": { label: "No-show", color: "#A32D2D", bg: "#FCEBEB" },
  cancelled: { label: "Cancelled", color: "#5F5E5A", bg: "#F1EFE8" },
};

let tokenCounter = 24;
const sampleNames = ["Vijay Singh", "Ananya Patel", "Srinivas Kumar", "Pooja Agarwal", "Ritu Desai", "Kiran Babu"];
const sampleDoctors = [
  { doctor: "Dr. Arjun Mehta", specialty: "General Medicine" },
  { doctor: "Dr. Priya Sharma", specialty: "Cardiology" },
  { doctor: "Dr. Kavitha Rao", specialty: "Pediatrics" },
];

export function generatePatient(): Patient {
  const name = sampleNames[Math.floor(Math.random() * sampleNames.length)];
  const doc = sampleDoctors[Math.floor(Math.random() * sampleDoctors.length)];
  const priorities: Priority[] = ["normal", "normal", "normal", "priority", "urgent"];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const token = `A0${tokenCounter++}`;
  return {
    id: `p${Date.now()}`,
    token,
    name,
    phone: `+91 ${Math.floor(Math.random() * 90000 + 10000)} ${Math.floor(Math.random() * 90000 + 10000)}`,
    doctor: doc.doctor,
    specialty: doc.specialty,
    priority,
    waitMinutes: Math.floor(Math.random() * 5 + 1) * 5,
    status: "in-queue",
    age: Math.floor(Math.random() * 60 + 5),
  };
}

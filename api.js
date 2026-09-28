import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const EVENT_META = {
  POTHOLE: { label: "Pothole", color: "#EF4444", icon: "alert-triangle" },
  ROAD_CRACK: { label: "Road Crack", color: "#F59E0B", icon: "git-branch" },
  ROAD_DAMAGE: { label: "Road Damage", color: "#F97316", icon: "alert-octagon" },
  ROAD_DEBRIS: { label: "Road Debris", color: "#F59E0B", icon: "trash-2" },
  FADED_MARKING: { label: "Faded Marking", color: "#EAB308", icon: "minus" },
  FADED_ZEBRA: { label: "Faded Zebra Crossing", color: "#EAB308", icon: "grip" },
  DAMAGED_DIVIDER: { label: "Damaged Divider", color: "#F97316", icon: "separator-horizontal" },
  MISSING_SIGN: { label: "Missing Sign", color: "#F97316", icon: "sign-post" },
  WATERLOGGING: { label: "Waterlogging", color: "#06B6D4", icon: "droplets" },
  CONGESTION: { label: "Congestion", color: "#F59E0B", icon: "car" },
  BOTTLENECK: { label: "Bottleneck", color: "#EF4444", icon: "traffic-cone" },
  PEDESTRIAN_RISK: { label: "Pedestrian Risk", color: "#EF4444", icon: "footprints" },
  NEAR_MISS: { label: "Near-Miss", color: "#EF4444", icon: "zap" },
};

export const SEVERITY_STYLE = {
  CRITICAL: "bg-rose-950/80 text-rose-300 border border-rose-500/40",
  HIGH: "bg-orange-950/80 text-orange-300 border border-orange-500/40",
  MEDIUM: "bg-amber-950/80 text-amber-300 border border-amber-500/40",
  LOW: "bg-blue-950/80 text-blue-300 border border-blue-500/40",
};

export const STATUS_STYLE = {
  DETECTED: "bg-slate-800 text-slate-300 border border-slate-600",
  CORROBORATED: "bg-blue-950/80 text-blue-300 border border-blue-500/40",
  VERIFIED: "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40",
  PRIORITIZED: "bg-violet-950/80 text-violet-300 border border-violet-500/40",
  ASSIGNED: "bg-amber-950/80 text-amber-300 border border-amber-500/40",
  INSPECTION: "bg-amber-950/80 text-amber-300 border border-amber-500/40",
  REPAIR_IN_PROGRESS: "bg-orange-950/80 text-orange-300 border border-orange-500/40",
  REPAIRED: "bg-teal-950/80 text-teal-300 border border-teal-500/40",
  AWAITING_RE_VERIFICATION: "bg-cyan-950/80 text-cyan-300 border border-cyan-500/40",
  RESOLVED: "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40",
  REOPENED: "bg-rose-950/80 text-rose-300 border border-rose-500/40",
  CONTRADICTED: "bg-rose-950/80 text-rose-300 border border-rose-500/40",
  REJECTED: "bg-slate-800 text-slate-400 border border-slate-600",
};

export const ROLE_LABELS = {
  COMMAND_CENTER: "City Command Center",
  TRANSPORT_AUTHORITY: "Transport Authority",
  MUNICIPAL_AUTHORITY: "Municipal / Road Authority",
  INCIDENT_INVESTIGATOR: "Incident Investigator",
  ADMIN: "Administrator",
};

export function fmtTime(ts) {
  if (!ts) return "—";
  try {
    return new Date(ts).toLocaleString("en-IN", {
      day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit",
    });
  } catch { return ts; }
}



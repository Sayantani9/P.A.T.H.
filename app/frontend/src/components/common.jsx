import React from "react";
import { SEVERITY_STYLE, STATUS_STYLE } from "../lib/api";
import { AlertTriangle, Loader2, Inbox, WifiOff } from "lucide-react";

export const Overline = ({ children, className = "" }) => (
  <div className={`text-[10px] font-mono uppercase tracking-widest text-slate-500 ${className}`}>{children}</div>
);

export const Panel = ({ children, className = "", ...rest }) => (
  <div className={`bg-[#111827] border border-slate-800 rounded-lg ${className}`} {...rest}>{children}</div>
);

export function SectionHeader({ title, subtitle, icon: Icon, right }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 h-9 w-9 rounded-md bg-blue-950/60 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Icon className="h-4.5 w-4.5 text-blue-400" size={18} />
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-slate-50">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

export function StatusBadge({ status, testid }) {
  const cls = STATUS_STYLE[status] || "bg-slate-800 text-slate-300 border border-slate-600";
  return (
    <span data-testid={testid} className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide ${cls}`}>
      {String(status || "").replace(/_/g, " ")}
    </span>
  );
}

export function SeverityBadge({ severity, testid }) {
  const cls = SEVERITY_STYLE[severity] || SEVERITY_STYLE.LOW;
  return (
    <span data-testid={testid} className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wide ${cls}`}>
      {severity}
    </span>
  );
}

export function KpiCard({ label, value, sub, tone = "default", icon: Icon, testid, onClick }) {
  const tones = {
    default: "text-slate-50",
    critical: "text-rose-400",
    high: "text-orange-400",
    good: "text-emerald-400",
    info: "text-blue-400",
    warn: "text-amber-400",
  };
  return (
    <div
      data-testid={testid}
      onClick={onClick}
      className={`bg-[#111827] border border-slate-800 rounded-lg p-4 transition-all duration-200 hover:border-slate-700 hover:bg-slate-800/40 ${onClick ? "cursor-pointer" : ""}`}
    >
      <div className="flex items-center justify-between">
        <Overline>{label}</Overline>
        {Icon && <Icon className="text-slate-600" size={15} />}
      </div>
      <div className={`mt-2 text-2xl sm:text-3xl font-bold font-display tabular-nums ${tones[tone]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

const PIPELINE = ["OBSERVE", "DETECT", "LOCALIZE", "VERIFY", "PRIORITIZE", "ACT", "RE-VERIFY"];
export function PipelineBanner({ active }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1" data-testid="pipeline-banner">
      {PIPELINE.map((s, i) => {
        const on = active === s;
        return (
          <React.Fragment key={s}>
            <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold tracking-wider whitespace-nowrap transition-colors
              ${on ? "bg-blue-500/20 text-blue-300 border border-blue-500/40" : "bg-slate-900 text-slate-500 border border-slate-800"}`}>
              {s}
            </span>
            {i < PIPELINE.length - 1 && <span className="text-slate-700 text-xs">→</span>}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export const Loading = ({ label = "Loading command data…" }) => (
  <div className="flex flex-col items-center justify-center py-24 text-slate-500" data-testid="loading-state">
    <Loader2 className="animate-spin mb-3 text-blue-500" size={26} />
    <p className="text-sm">{label}</p>
  </div>
);

export const EmptyState = ({ label = "No data available" }) => (
  <div className="flex flex-col items-center justify-center py-16 text-slate-500" data-testid="empty-state">
    <Inbox className="mb-3 text-slate-700" size={30} />
    <p className="text-sm">{label}</p>
  </div>
);

export const ErrorState = ({ onRetry, label = "Command Center connection unavailable" }) => (
  <div className="flex flex-col items-center justify-center py-20 text-slate-400" data-testid="error-state">
    <WifiOff className="mb-3 text-rose-500" size={30} />
    <p className="text-sm mb-4">{label}</p>
    {onRetry && (
      <button data-testid="retry-btn" onClick={onRetry}
        className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors">
        Retry
      </button>
    )}
  </div>
);

export function ScoreBar({ value, max = 100, tone = "blue" }) {
  const pct = Math.min((value / max) * 100, 100);
  const colors = { blue: "bg-blue-500", green: "bg-emerald-500", orange: "bg-orange-500", red: "bg-rose-500", amber: "bg-amber-500" };
  return (
    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
      <div className={`h-full ${colors[tone]} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export const PROTOTYPE_NOTE = "RoadPulse prototype analytics — not an official municipal determination.";



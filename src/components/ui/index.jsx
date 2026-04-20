import { cn } from "../../lib/cn"

// Badge
export function Badge({ label, color = "accent", className }) {
  const colors = {
    accent: "border-accent/25 bg-accent/15 text-accent-strong",
    gold: "border-gold/25 bg-gold/12 text-gold",
    blue: "border-sky-400/25 bg-sky-400/12 text-sky-200",
    muted: "border-line bg-white/[0.04] text-muted",
    danger: "border-orange-400/25 bg-orange-400/12 text-orange-200",
    success: "border-emerald-400/25 bg-emerald-400/12 text-emerald-200",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none",
        colors[color] || colors.accent,
        className,
      )}
    >
      {label}
    </span>
  )
}

// Status badge helper
export function StatusBadge({ status }) {
  const map = {
    not_started: { label: "Not started", color: "muted" },
    in_progress: { label: "In progress", color: "accent" },
    completed: { label: "Completed", color: "success" },
    overdue: { label: "Overdue", color: "gold" },
  }
  const s = map[status] || map.not_started
  return <Badge label={s.label} color={s.color} />
}

// Priority dot
export function PriorityDot({ priority }) {
  const colors = {
    low: "bg-emerald-400",
    medium: "bg-gold",
    high: "bg-orange-300",
  }

  return (
    <span className={cn("inline-block h-2 w-2 shrink-0 rounded-full", colors[priority] || colors.low)} />
  )
}

// Card
export function Card({ children, className }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(81,72,61,0.96)_0%,rgba(67,59,50,0.96)_100%)] p-5 shadow-panel backdrop-blur-xl sm:p-6",
        className,
      )}
    >
      {children}
    </div>
  )
}

// Stat card
export function StatCard({ label, value, accent, className }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.94)_0%,rgba(52,45,37,0.94)_100%)] px-5 py-4 shadow-soft",
        className,
      )}
    >
      <div className="mb-2.5 text-[11px] uppercase tracking-[0.08em] text-muted">{label}</div>
      <div className="font-display text-3xl leading-none font-bold" style={{ color: accent ?? "var(--color-copy)" }}>
        {value}
      </div>
    </div>
  )
}

// Avatar
export function Avatar({ name, color, size = 36 }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-canvas"
      style={{
        width: size,
        height: size,
        backgroundColor: color || "var(--color-accent)",
        fontSize: size * 0.33,
      }}
    >
      {initials}
    </div>
  )
}

// Button
export function Btn({ children, onClick, variant = "primary", size = "md", className, disabled = false, type = "button" }) {
  const sizes = {
    sm: "h-8 px-3.5 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  }
  const variants = {
    primary: "border-transparent bg-[linear-gradient(180deg,var(--color-accent-strong),var(--color-accent))] text-canvas shadow-[0_12px_28px_rgba(184,176,143,0.16)] hover:opacity-90",
    ghost: "border-line/80 bg-white/[0.02] text-accent-strong hover:border-accent/40 hover:bg-white/[0.05] hover:text-copy",
    gold: "border-gold/30 bg-gold/12 text-gold hover:bg-gold/18",
    danger: "border-orange-400/25 bg-orange-400/12 text-orange-200 hover:bg-orange-400/18",
  }

  return (
    <button
      className={className}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center rounded-2xl border font-medium transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0",
        sizes[size],
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  )
}

// Input
export function Input({ label, className, inputClassName, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-xs font-medium text-muted">{label}</label>}
      <input
        {...props}
        className={cn(
          "h-11 w-full rounded-2xl border border-line/80 bg-black/15 px-3.5 text-sm text-copy outline-none ring-0 transition placeholder:text-faint focus:border-accent/70 focus:bg-black/20",
          inputClassName,
        )}
      />
    </div>
  )
}

// Select
export function Select({ label, options = [], className, selectClassName, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-xs font-medium text-muted">{label}</label>}
      <select
        {...props}
        className={cn(
          "h-11 w-full cursor-pointer rounded-2xl border border-line/80 bg-black/15 px-3.5 text-sm text-copy outline-none transition focus:border-accent/70 focus:bg-black/20",
          selectClassName,
        )}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

export function TextArea({ label, className, textAreaClassName, ...props }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-xs font-medium text-muted">{label}</label>}
      <textarea
        {...props}
        className={cn(
          "min-h-[92px] w-full rounded-2xl border border-line/80 bg-black/15 px-3.5 py-3 text-sm leading-6 text-copy outline-none transition placeholder:text-faint focus:border-accent/70 focus:bg-black/20",
          textAreaClassName,
        )}
      />
    </div>
  )
}

// Page header
export function PageHeader({ title, subtitle, action, className }) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div>
        <h1 className="font-display text-3xl leading-none font-bold tracking-[-0.03em] text-copy">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-muted">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Divider
export function Divider() {
  return <div className="my-5 h-px bg-line/60" />
}

// Empty state
export function EmptyState({ message }) {
  return (
    <div className="py-12 text-center text-sm text-faint">
      {message || "Nothing here yet."}
    </div>
  )
}

export function LoadingScreen({ label = "Loading workspace..." }) {
  return (
    <div className="flex min-h-[42vh] items-center justify-center px-4 text-center text-xs font-medium uppercase tracking-[0.2em] text-muted sm:min-h-[56vh]">
      {label}
    </div>
  )
}

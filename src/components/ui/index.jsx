import { useEffect, useId, useState } from "react"
import { createPortal } from "react-dom"
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

export function Modal({ open, onClose, children, className }) {
  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && typeof onClose === "function") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscapeKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleEscapeKey)
    }
  }, [open, onClose])

  if (!open || typeof document === "undefined") {
    return null
  }

  return createPortal(
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
        onClick={() => typeof onClose === "function" && onClose()}
      />
      <div className="relative flex min-h-full items-center justify-center p-4 sm:p-6">
        <div
          role="dialog"
          aria-modal="true"
          onClick={(event) => event.stopPropagation()}
          className={cn("w-full max-h-[calc(100vh-2rem)] overflow-y-auto sm:max-h-[calc(100vh-3rem)]", className)}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}

// Stat card
export function StatCard({ label, value, accent, className }) {
  const statAccent = accent ?? "var(--color-copy)"

  return (
    <div
      className={cn(
        "rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.94)_0%,rgba(52,45,37,0.94)_100%)] px-5 py-4 shadow-soft",
        className,
      )}
    >
      <div className="mb-2.5 text-[11px] uppercase tracking-[0.08em] text-muted">{label}</div>
      <div
        className="font-display text-3xl leading-none font-bold text-[var(--stat-accent)]"
        style={{ "--stat-accent": statAccent }}
      >
        {value}
      </div>
    </div>
  )
}

// Avatar
export function Avatar({ name, color, size = 36 }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"
  const avatarColor = color || "var(--color-accent)"
  const avatarSize = `${size}px`
  const avatarFontSize = `${Math.max(11, Math.round(size * 0.33))}px`

  return (
    <div
      className="flex h-[var(--avatar-size)] w-[var(--avatar-size)] shrink-0 items-center justify-center rounded-full bg-[var(--avatar-color)] text-[length:var(--avatar-font-size)] font-semibold text-canvas"
      style={{
        "--avatar-size": avatarSize,
        "--avatar-color": avatarColor,
        "--avatar-font-size": avatarFontSize,
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
export function Input({ label, className, inputClassName, id, type, ...props }) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const inputType = isPassword && showPassword ? "text" : type

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label htmlFor={inputId} className="text-xs font-medium text-muted">{label}</label>}
      <div className="relative">
        <input
          {...props}
          type={inputType}
          id={inputId}
          className={cn(
            "h-11 w-full rounded-2xl border border-line/80 bg-black/15 px-3.5 pr-10 text-sm text-copy outline-none ring-0 transition placeholder:text-faint focus:border-accent/70 focus:bg-black/20",
            inputClassName,
          )}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition hover:text-copy"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}

// Select
export function Select({ label, options = [], className, selectClassName, id, ...props }) {
  const generatedId = useId()
  const selectId = id ?? generatedId

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label htmlFor={selectId} className="text-xs font-medium text-muted">{label}</label>}
      <select
        {...props}
        id={selectId}
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

export function TextArea({ label, className, textAreaClassName, id, ...props }) {
  const generatedId = useId()
  const textAreaId = id ?? generatedId

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label htmlFor={textAreaId} className="text-xs font-medium text-muted">{label}</label>}
      <textarea
        {...props}
        id={textAreaId}
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
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h1 className="font-display text-3xl leading-none font-bold tracking-[-0.03em] text-copy">{title}</h1>
        {subtitle && <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
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

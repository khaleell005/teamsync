// Badge
export function Badge({ label, color = "accent" }) {
  const colors = {
    accent: { bg: "rgba(153,151,124,0.15)", text: "#99977C", border: "rgba(153,151,124,0.3)" },
    gold: { bg: "rgba(201,168,76,0.15)", text: "#C9A84C", border: "rgba(201,168,76,0.3)" },
    blue: { bg: "rgba(100,140,200,0.15)", text: "#5C8CC8", border: "rgba(100,140,200,0.3)" },
    muted: { bg: "rgba(168,159,148,0.12)", text: "#a89f94", border: "rgba(168,159,148,0.2)" },
    danger: { bg: "rgba(201,100,76,0.15)", text: "#C9714C", border: "rgba(201,100,76,0.3)" },
    success: { bg: "rgba(100,168,100,0.15)", text: "#7CB87C", border: "rgba(100,168,100,0.3)" },
  }
  const c = colors[color] || colors.accent
  return (
    <span style={{
      fontSize: 11,
      background: c.bg,
      color: c.text,
      border: `1px solid ${c.border}`,
      padding: "3px 10px",
      borderRadius: 99,
      fontWeight: 500,
      whiteSpace: "nowrap",
    }}>{label}</span>
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
  const colors = { low: "#7CB87C", medium: "#C9A84C", high: "#C9714C" }
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%",
      background: colors[priority] || colors.low,
      display: "inline-block", flexShrink: 0,
    }} />
  )
}

// Card
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "var(--radius-lg)",
      padding: "20px 24px",
      border: "1px solid rgba(153,151,124,0.12)",
      ...style,
    }}>
      {children}
    </div>
  )
}

// Stat card
export function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: "var(--radius-lg)",
      padding: "16px 20px",
      border: "1px solid rgba(153,151,124,0.1)",
    }}>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Syne', sans-serif", color: accent || "var(--text)" }}>{value}</div>
    </div>
  )
}

// Avatar
export function Avatar({ name, color, size = 36 }) {
  const initials = name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "?"
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: color || "var(--accent)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.33, fontWeight: 600,
      color: "#1a1710", flexShrink: 0,
    }}>{initials}</div>
  )
}

// Button
export function Btn({ children, onClick, variant = "primary", size = "md", style = {} }) {
  const sizes = { sm: { padding: "6px 14px", fontSize: 12 }, md: { padding: "9px 20px", fontSize: 13 }, lg: { padding: "12px 28px", fontSize: 14 } }
  const variants = {
    primary: { background: "var(--accent)", color: "#1e1d16", border: "none" },
    ghost: { background: "transparent", color: "var(--accent)", border: "1px solid var(--accent)" },
    gold: { background: "rgba(201,168,76,0.15)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.35)" },
    danger: { background: "rgba(201,100,76,0.12)", color: "#C9714C", border: "1px solid rgba(201,100,76,0.3)" },
  }
  return (
    <button onClick={onClick} style={{
      ...sizes[size],
      ...variants[variant],
      borderRadius: "var(--radius-md)",
      fontWeight: 500,
      cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      transition: "opacity 0.15s",
      ...style,
    }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.8"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  )
}

// Input
export function Input({ label, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</label>}
      <input {...props} style={{
        background: "var(--surface)",
        border: "1px solid rgba(153,151,124,0.2)",
        borderRadius: "var(--radius-md)",
        padding: "9px 12px",
        fontSize: 13,
        color: "var(--text)",
        outline: "none",
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        ...props.style,
      }}
        onFocus={e => e.target.style.borderColor = "var(--accent)"}
        onBlur={e => e.target.style.borderColor = "rgba(153,151,124,0.2)"}
      />
    </div>
  )
}

// Select
export function Select({ label, options = [], ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</label>}
      <select {...props} style={{
        background: "var(--surface)",
        border: "1px solid rgba(153,151,124,0.2)",
        borderRadius: "var(--radius-md)",
        padding: "9px 12px",
        fontSize: 13,
        color: "var(--text)",
        outline: "none",
        fontFamily: "'Inter', sans-serif",
        width: "100%",
        cursor: "pointer",
        ...props.style,
      }}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  )
}

// Page header
export function PageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32 }}>
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}

// Divider
export function Divider() {
  return <div style={{ height: 1, background: "rgba(153,151,124,0.1)", margin: "20px 0" }} />
}

// Empty state
export function EmptyState({ message }) {
  return (
    <div style={{ textAlign: "center", padding: "48px 0", color: "var(--faint)", fontSize: 13 }}>
      {message || "Nothing here yet."}
    </div>
  )
}

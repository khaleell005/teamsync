import { NavLink } from "react-router-dom"

const adminLinks = [
  { to: "/admin/dashboard", label: "Overview", icon: "▦" },
  { to: "/admin/members", label: "Members", icon: "◈" },
  { to: "/admin/projects", label: "Projects", icon: "◉" },
  { to: "/admin/tasks", label: "Tasks", icon: "◎" },
]

const memberLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/my-tasks", label: "My Tasks", icon: "◎" },
  { to: "/team-view", label: "Team View", icon: "◈" },
]

const styles = {
  sidebar: {
    width: 220,
    minHeight: "100vh",
    background: "var(--surface)",
    borderRight: "1px solid rgba(153,151,124,0.15)",
    display: "flex",
    flexDirection: "column",
    padding: "0",
    flexShrink: 0,
  },
  logo: {
    padding: "28px 24px 24px",
    borderBottom: "1px solid rgba(153,151,124,0.12)",
  },
  logoText: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text)",
    letterSpacing: "-0.02em",
  },
  logoSub: {
    fontSize: 10,
    color: "var(--accent)",
    letterSpacing: "0.12em",
    marginTop: 2,
    textTransform: "uppercase",
  },
  nav: {
    flex: 1,
    padding: "20px 12px",
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  sectionLabel: {
    fontSize: 9,
    color: "var(--faint)",
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    padding: "8px 12px 6px",
    fontFamily: "'Syne', sans-serif",
  },
  footer: {
    padding: "16px 20px",
    borderTop: "1px solid rgba(153,151,124,0.12)",
  },
  userRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 600,
    color: "#1e1d16",
    flexShrink: 0,
  },
  userName: {
    fontSize: 13,
    fontWeight: 500,
    color: "var(--text)",
  },
  userRole: {
    fontSize: 10,
    color: "var(--muted)",
    textTransform: "capitalize",
  },
}

const linkStyle = (isActive) => ({
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "9px 12px",
  borderRadius: "var(--radius-md)",
  fontSize: 13,
  fontWeight: isActive ? 500 : 400,
  color: isActive ? "var(--text)" : "var(--muted)",
  background: isActive ? "rgba(153,151,124,0.15)" : "transparent",
  textDecoration: "none",
  transition: "all 0.15s",
  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
})

export default function Sidebar({ role = "admin", user = { name: "Khaleel A", role: "admin", color: "#99977C" } }) {
  const links = role === "admin" ? adminLinks : memberLinks

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoText}>TeamSync</div>
        <div style={styles.logoSub}>Workspace</div>
      </div>

      <nav style={styles.nav}>
        <div style={styles.sectionLabel}>{role === "admin" ? "Admin" : "Menu"}</div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => linkStyle(isActive)}
          >
            <span style={{ fontSize: 14 }}>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.userRow}>
          <div style={{ ...styles.avatar, background: user.color }}>
            {user.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
          </div>
          <div>
            <div style={styles.userName}>{user.name}</div>
            <div style={styles.userRole}>{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}

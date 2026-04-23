import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { cn } from "../../lib/cn"

const adminLinks = [
  { to: "/admin/dashboard", label: "Overview", icon: "▦" },
  { to: "/admin/members", label: "Members", icon: "◈" },
  { to: "/admin/projects", label: "Projects", icon: "◉" },
  { to: "/admin/tasks", label: "Tasks", icon: "◎" },
  { to: "/profile", label: "Profile", icon: "◯" },
]

const memberLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/my-tasks", label: "My Tasks", icon: "◎" },
  { to: "/team-view", label: "Team View", icon: "◈" },
  { to: "/profile", label: "Profile", icon: "◯" },
]

const viewerLinks = [
  { to: "/dashboard", label: "Dashboard", icon: "▦" },
  { to: "/my-tasks", label: "Project Tasks", icon: "◎" },
  { to: "/team-view", label: "Team View", icon: "◈" },
  { to: "/profile", label: "Profile", icon: "◯" },
]

export default function Sidebar({ role = "admin", user = { name: "Khaleel A", role: "admin", color: "#99977C" } }) {
  let links
  if (role === "admin") {
    links = adminLinks
  } else if (role === "viewer") {
    links = viewerLinks
  } else {
    links = memberLinks
  }
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const initials = user.name.split(" ").map((part) => part[0]).join("").slice(0, 2)
  const userColor = user.color || "var(--color-accent)"

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await logout()
      navigate("/login", { replace: true })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="border-line/70 bg-[linear-gradient(180deg,rgba(58,50,41,0.96)_0%,rgba(42,36,30,0.96)_100%)] backdrop-blur-xl lg:min-h-screen lg:w-64 lg:shrink-0 lg:border-r border-b">
      <div className="border-line/70 border-b px-6 py-7">
        <div className="font-display text-[22px] font-bold tracking-[-0.02em] text-copy">TeamSync</div>
        <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-accent-strong">Workspace</div>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3 py-4 lg:py-5">
        <div className="px-3 pb-2 font-display text-[9px] uppercase tracking-[0.14em] text-faint">
          {role === "admin" ? "Admin" : role === "viewer" ? "Viewer" : "Menu"}
        </div>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-2xl border px-3 py-2.5 text-sm transition md:py-2",
                isActive
                  ? "border-accent/30 bg-[linear-gradient(90deg,rgba(184,176,143,0.18),rgba(184,176,143,0.07))] text-copy shadow-[inset_3px_0_0_var(--color-accent)]"
                  : "border-transparent text-muted hover:border-line/70 hover:bg-white/[0.03] hover:text-copy",
              )
            }
          >
            <span className="text-sm">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-line/70 border-t bg-black/10 px-5 py-4 lg:py-5">
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--user-color)] text-[11px] font-semibold text-canvas"
            style={{ "--user-color": userColor }}
          >
            {user.photo ? (
              <img src={user.photo} alt={user.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div>
            <div className="text-sm font-medium text-copy">{user.name}</div>
            <div className="text-[10px] capitalize text-muted">{user.role}</div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="mt-4 inline-flex h-9 items-center justify-center rounded-full border border-line/80 px-3.5 text-[11px] font-medium text-muted transition hover:border-accent/40 hover:text-copy"
        >
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </aside>
  )
}

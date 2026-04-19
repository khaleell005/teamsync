import Sidebar from "./Sidebar"

export default function Layout({ children, role, user }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar role={role} user={user} />
      <main style={{
        flex: 1,
        padding: "32px 36px",
        overflowY: "auto",
        background: "var(--base)",
      }}>
        {children}
      </main>
    </div>
  )
}

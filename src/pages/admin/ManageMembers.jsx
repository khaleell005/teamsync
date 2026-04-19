import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, Select, PageHeader, Divider } from "../../components/ui"
import { mockMembers } from "../../utils/mockData"

const defaultColors = ["#7EB8C9", "#C97E8A", "#85C98A", "#C9A84C", "#A07EC9", "#C9907E", "#7EC9B8"]

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("teamsync_user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function ManageMembers() {
  const [currentUser, setCurrentUser] = useState(getStoredUser)
  const [members, setMembers] = useState(mockMembers)

  if (!currentUser) {
    window.location.href = "/login"
    return null
  }
  if (currentUser.role !== "admin") {
    window.location.href = "/dashboard"
    return null
  }

  const adminUser = currentUser
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "member", color: defaultColors[0] })

  const handleAdd = () => {
    if (!form.name || !form.email) return
    const newMember = {
      id: `u${Date.now()}`,
      ...form,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
    setMembers(prev => [...prev, newMember])
    setForm({ name: "", email: "", password: "", role: "member", color: defaultColors[0] })
    setShowForm(false)
  }

  const handleDelete = (id) => setMembers(prev => prev.filter(m => m.id !== id))

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <PageHeader
        title="Members"
        subtitle={`${members.length} team members in your workspace`}
        action={<Btn onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ Add member"}</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Create member account</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Input label="Full name" placeholder="Tunde Musa" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <Input label="Email address" type="email" placeholder="tunde@teamsync.io" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <Input label="Temporary password" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            <Select
              label="Role"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              options={[
                { value: "member", label: "Member" },
                { value: "pm", label: "Project Lead" },
                { value: "viewer", label: "Viewer" },
              ]}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 8 }}>Member color</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ display: "flex", gap: 6 }}>
                {defaultColors.map(c => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    style={{
                      width: 28, height: 28, borderRadius: "50%", background: c,
                      border: form.color === c ? "3px solid var(--text)" : "3px solid transparent",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </div>
              <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 12, color: "var(--muted)" }}>
                <input
                  type="color"
                  value={form.color}
                  onChange={e => setForm({ ...form, color: e.target.value })}
                  style={{ width: 28, height: 28, border: "none", cursor: "pointer", borderRadius: 4 }}
                />
                Custom
              </label>
            </div>
          </div>
          <Btn onClick={handleAdd}>Create account</Btn>
        </Card>
      )}

      <Card>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px",
            padding: "8px 12px", marginBottom: 4,
          }}>
            {["Name", "Email", "Role", "Joined", ""].map((h, i) => (
              <span key={i} style={{ fontSize: 10, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</span>
            ))}
          </div>
          <Divider />
          {members.map(m => (
            <div key={m.id} style={{
              display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 120px",
              alignItems: "center", padding: "12px 12px",
              borderRadius: "var(--radius-md)",
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(153,151,124,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={m.name} color={m.color} size={32} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{m.name}</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>{m.email}</p>
              <Badge
                label={m.role}
                color={m.role === "admin" ? "gold" : m.role === "pm" ? "blue" : m.role === "member" ? "accent" : "muted"}
              />
              <p style={{ fontSize: 12, color: "var(--muted)" }}>{m.createdAt}</p>
              <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                {m.role !== "admin" && (
                  <Btn variant="danger" size="sm" onClick={() => handleDelete(m.id)}>Remove</Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  )
}

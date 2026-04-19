import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, PageHeader, Divider, EmptyState } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("teamsync_user")
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export default function ManageProjects() {
  const currentUser = getStoredUser()
  const [projects, setProjects] = useState(mockProjects)

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
  const [form, setForm] = useState({ name: "", description: "", leadId: "", memberIds: [] })

  const getUser = (id) => mockMembers.find(m => m.id === id)
  const getTaskCount = (pid) => mockTasks.filter(t => t.projectId === pid).length

  const toggleMember = (id) => {
    setForm(f => ({
      ...f,
      memberIds: f.memberIds.includes(id) ? f.memberIds.filter(m => m !== id) : [...f.memberIds, id],
    }))
  }

  const handleAdd = () => {
    if (!form.name) return
    setProjects(prev => [...prev, {
      id: `p${Date.now()}`,
      ...form,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }])
    setForm({ name: "", description: "", leadId: "", memberIds: [] })
    setShowForm(false)
  }

  const toggleStatus = (id) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, status: p.status === "active" ? "completed" : "active" } : p))
  }

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <PageHeader
        title="Projects"
        subtitle={`${projects.filter(p => p.status === "active").length} active · ${projects.filter(p => p.status === "completed").length} completed`}
        action={<Btn onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ New project"}</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Create project</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Project name" placeholder="e.g. NexaFlow Rebrand" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 10 }}>Project Lead</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mockMembers.filter(m => m.role === "pm" || m.role === "member").map(m => (
                  <button
                    key={m.id}
                    onClick={() => setForm({ ...form, leadId: m.id })}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                      borderRadius: 99, cursor: "pointer", transition: "all 0.15s",
                      background: form.leadId === m.id ? "rgba(153,151,124,0.2)" : "var(--surface)",
                      border: form.leadId === m.id ? "1px solid var(--accent)" : "1px solid rgba(153,151,124,0.2)",
                      color: form.leadId === m.id ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    <Avatar name={m.name} color={m.color} size={20} />
                    <span style={{ fontSize: 12 }}>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Description</label>
              <textarea
                placeholder="Brief description of this project..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                style={{
                  background: "var(--surface)", border: "1px solid rgba(153,151,124,0.2)",
                  borderRadius: "var(--radius-md)", padding: "9px 12px", fontSize: 13,
                  color: "var(--text)", outline: "none", fontFamily: "'Inter', sans-serif",
                  resize: "vertical",
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 10 }}>Assign members</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mockMembers.filter(m => m.role !== "admin").map(m => (
                  <button
                    key={m.id}
                    onClick={() => toggleMember(m.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8, padding: "6px 12px",
                      borderRadius: 99, cursor: "pointer", transition: "all 0.15s",
                      background: form.memberIds.includes(m.id) ? "rgba(153,151,124,0.2)" : "var(--surface)",
                      border: form.memberIds.includes(m.id) ? "1px solid var(--accent)" : "1px solid rgba(153,151,124,0.2)",
                      color: form.memberIds.includes(m.id) ? "var(--text)" : "var(--muted)",
                    }}
                  >
                    <Avatar name={m.name} color={m.color} size={20} />
                    <span style={{ fontSize: 12 }}>{m.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div><Btn onClick={handleAdd}>Create project</Btn></div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {projects.length === 0 && <EmptyState message="No projects yet. Create your first one." />}
        {projects.map(p => (
          <Card key={p.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <div style={{ flex: 1, marginRight: 12 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{p.name}</h3>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>{p.description}</p>
              </div>
              <Badge label={p.status === "active" ? "Active" : "Completed"} color={p.status === "active" ? "success" : "muted"} />
            </div>

            <Divider />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {p.leadId && getUser(p.leadId) && (
                  <div style={{ marginRight: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: "var(--muted)" }}>Lead:</span>
                    <Avatar name={getUser(p.leadId).name} color={getUser(p.leadId).color} size={22} />
                  </div>
                )}
                {p.memberIds.map(mid => {
                  const m = getUser(mid)
                  return m && m.id !== p.leadId ? <div key={mid} style={{ marginRight: -6 }} title={m.name}><Avatar name={m.name} color={m.color} size={26} /></div> : null
                })}
                <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 14 }}>{p.memberIds.length} members</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>{getTaskCount(p.id)} tasks</span>
                <Btn variant="ghost" size="sm" onClick={() => toggleStatus(p.id)}>
                  {p.status === "active" ? "Mark done" : "Reopen"}
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Layout>
  )
}

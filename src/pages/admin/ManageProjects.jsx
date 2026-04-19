import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, Btn, Input, PageHeader, Divider, EmptyState } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

export default function ManageProjects() {
  const [state, setState] = useState({
    user: null,
    ready: false,
    projects: mockProjects,
    showForm: false,
    form: { name: "", description: "", leadId: "", memberIds: [] }
  })

  useEffect(() => {
    const stored = localStorage.getItem("teamsync_user")
    if (stored) {
      const user = JSON.parse(stored)
      if (user.role === "admin") {
        setState(s => ({ ...s, user, ready: true }))
      } else {
        window.location.href = "/dashboard"
      }
    } else {
      window.location.href = "/login"
    }
  }, [])

  if (!state.ready || !state.user) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--base)", color: "var(--text)" }}>Loading...</div>
  }

  const adminUser = state.user
  const projects = state.projects
  const showForm = state.showForm
  const form = state.form
  const updateState = (updates) => setState(s => ({ ...s, ...updates }))

  const getUser = (id) => mockMembers.find(m => m.id === id)
  const getTaskCount = (pid) => mockTasks.filter(t => t.projectId === pid).length

  const toggleMember = (id) => {
    updateState({
      form: {
        ...form,
        memberIds: form.memberIds.includes(id) ? form.memberIds.filter(m => m !== id) : [...form.memberIds, id],
      }
    })
  }

  const handleAdd = () => {
    if (!form.name) return
    const newProject = {
      id: `p${Date.now()}`,
      ...form,
      status: "active",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }
    updateState({
      projects: [...state.projects, newProject],
      form: { name: "", description: "", leadId: "", memberIds: [] },
      showForm: false
    })
  }

  const toggleStatus = (id) => {
    updateState({
      projects: state.projects.map(p => p.id === id ? { ...p, status: p.status === "active" ? "completed" : "active" } : p)
    })
  }

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <PageHeader
        title="Projects"
        subtitle={`${projects.filter(p => p.status === "active").length} active · ${projects.filter(p => p.status === "completed").length} completed`}
        action={<Btn onClick={() => updateState({ showForm: !showForm })}>{showForm ? "Cancel" : "+ New project"}</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Create project</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Input label="Project name" placeholder="e.g. NexaFlow Rebrand" value={form.name} onChange={e => updateState({ form: { ...form, name: e.target.value } })} />
            <div>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500, display: "block", marginBottom: 10 }}>Project Lead</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mockMembers.filter(m => m.role === "pm" || m.role === "member").map(m => (
                  <button
                    key={m.id}
                    onClick={() => updateState({ form: { ...form, leadId: m.id } })}
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
                onChange={e => updateState({ form: { ...form, description: e.target.value } })}
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

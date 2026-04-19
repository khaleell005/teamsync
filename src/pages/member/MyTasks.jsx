import { useState, useEffect } from "react"
import Layout from "../../components/layout/Layout"
import { Card, StatusBadge, PriorityDot, Btn, Select, PageHeader, Divider, EmptyState } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

export default function MyTasks() {
  const [currentUser, setCurrentUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [loaded, setLoaded] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [noteInput, setNoteInput] = useState("")
  const [statusInput, setStatusInput] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("teamsync_user")
    if (!stored) {
      window.location.href = "/login"
      return
    }
    const user = JSON.parse(stored)
    if (user.role === "admin") {
      window.location.href = "/admin/dashboard"
      return
    }
    setCurrentUser(user)
    
    if (user.role === "viewer") {
      const viewerTasks = mockTasks.filter(t => {
        const project = mockProjects.find(p => p.id === t.projectId)
        return project && project.memberIds.includes(user.id)
      })
      setTasks(viewerTasks)
    } else {
      setTasks(mockTasks.filter(t => t.assignedTo === user.id))
    }
    setLoaded(true)
  }, [])

  if (!loaded || !currentUser) return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>

  const isViewer = currentUser.role === "viewer"

  const getProject = (id) => mockProjects.find(p => p.id === id)

  const openEdit = (task) => {
    setEditingId(task.id)
    setNoteInput(task.progressNote || "")
    setStatusInput(task.status)
  }

  const saveUpdate = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: statusInput, progressNote: noteInput } : t))
    setEditingId(null)
  }

  const statusOptions = [
    { value: "not_started", label: "Not started" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...tasks].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <PageHeader
        title={isViewer ? "Project Tasks" : "My Tasks"}
        subtitle={isViewer ? `${tasks.length} tasks in your projects` : `${tasks.length} tasks assigned to you`}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {sorted.length === 0 && <EmptyState message="No tasks assigned yet." />}
        {sorted.map(task => {
          const isEditing = editingId === task.id
          const project = getProject(task.projectId)

          return (
            <Card key={task.id} style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ flex: 1, marginRight: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <PriorityDot priority={task.priority} />
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text)" }}>{task.title}</h3>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{task.description}</p>
                </div>
                <StatusBadge status={task.status} />
              </div>

              <div style={{ display: "flex", gap: 16, marginBottom: 14 }}>
                <span style={{ fontSize: 11, color: "var(--faint)" }}>
                  Project: <span style={{ color: "var(--muted)" }}>{project?.name || "—"}</span>
                </span>
                {task.deadline && (
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>
                    Due: <span style={{ color: "var(--muted)" }}>{task.deadline}</span>
                  </span>
                )}
                <span style={{ fontSize: 11, color: "var(--faint)", textTransform: "capitalize" }}>
                  Priority: <span style={{ color: "var(--muted)" }}>{task.priority}</span>
                </span>
              </div>

              {!isEditing && task.progressNote && (
                <div style={{
                  padding: "8px 12px",
                  background: "rgba(153,151,124,0.08)",
                  borderRadius: "var(--radius-md)",
                  borderLeft: "2px solid var(--accent)",
                  marginBottom: 14,
                }}>
                  <p style={{ fontSize: 12, color: "var(--accent)", fontStyle: "italic" }}>"{task.progressNote}"</p>
                </div>
              )}

              {isEditing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Divider />
                  <Select
                    label="Update status"
                    value={statusInput}
                    onChange={e => setStatusInput(e.target.value)}
                    options={statusOptions}
                  />
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Progress note</label>
                    <textarea
                      value={noteInput}
                      onChange={e => setNoteInput(e.target.value)}
                      placeholder="e.g. Finished the Figma designs, now implementing..."
                      rows={2}
                      style={{
                        background: "var(--surface)", border: "1px solid rgba(153,151,124,0.2)",
                        borderRadius: "var(--radius-md)", padding: "9px 12px", fontSize: 13,
                        color: "var(--text)", outline: "none", fontFamily: "'Inter', sans-serif",
                        resize: "vertical",
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn onClick={() => saveUpdate(task.id)}>Save update</Btn>
                    <Btn variant="ghost" onClick={() => setEditingId(null)}>Cancel</Btn>
                  </div>
                </div>
              ) : !isViewer && (
                <Btn variant="ghost" size="sm" onClick={() => openEdit(task)}>Update progress</Btn>
              )}
            </Card>
          )
        })}
      </div>
    </Layout>
  )
}

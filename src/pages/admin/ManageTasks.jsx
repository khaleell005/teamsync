import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, Badge, StatusBadge, PriorityDot, Btn, Input, Select, PageHeader, Divider, EmptyState } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

const adminUser = mockMembers[0]

export default function ManageTasks() {
  const [tasks, setTasks] = useState(mockTasks)
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState("all")
  const [form, setForm] = useState({ title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" })

  const getUser = (id) => mockMembers.find(m => m.id === id)
  const getProject = (id) => mockProjects.find(p => p.id === id)

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter)

  const handleAdd = () => {
    if (!form.title || !form.projectId || !form.assignedTo) return
    setTasks(prev => [...prev, {
      id: `t${Date.now()}`,
      ...form,
      status: "not_started",
      progressNote: "",
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    }])
    setForm({ title: "", description: "", projectId: "", assignedTo: "", priority: "medium", deadline: "" })
    setShowForm(false)
  }

  const handleDelete = (id) => setTasks(prev => prev.filter(t => t.id !== id))

  const projectOptions = [{ value: "", label: "Select project" }, ...mockProjects.map(p => ({ value: p.id, label: p.name }))]
  const memberOptions = [{ value: "", label: "Select member" }, ...mockMembers.filter(m => m.role !== "admin").map(m => ({ value: m.id, label: m.name }))]
  const priorityOptions = [{ value: "low", label: "Low" }, { value: "medium", label: "Medium" }, { value: "high", label: "High" }]

  const filterTabs = [
    { key: "all", label: "All" },
    { key: "not_started", label: "Not started" },
    { key: "in_progress", label: "In progress" },
    { key: "completed", label: "Completed" },
  ]

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} total tasks across all projects`}
        action={<Btn onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "+ New task"}</Btn>}
      />

      {showForm && (
        <Card style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>Create task</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
            <Input label="Task title" placeholder="e.g. Redesign landing page" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <Select label="Project" value={form.projectId} onChange={e => setForm({ ...form, projectId: e.target.value })} options={projectOptions} />
            <Select label="Assign to" value={form.assignedTo} onChange={e => setForm({ ...form, assignedTo: e.target.value })} options={memberOptions} />
            <Select label="Priority" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} options={priorityOptions} />
            <Input label="Deadline" type="text" placeholder="e.g. Apr 30, 2025" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>Description</label>
              <textarea
                placeholder="Task details..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                rows={2}
                style={{
                  background: "var(--surface)", border: "1px solid rgba(153,151,124,0.2)",
                  borderRadius: "var(--radius-md)", padding: "9px 12px", fontSize: 13,
                  color: "var(--text)", outline: "none", fontFamily: "'Inter', sans-serif", resize: "vertical",
                }}
              />
            </div>
          </div>
          <Btn onClick={handleAdd}>Create task</Btn>
        </Card>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {filterTabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            style={{
              padding: "6px 14px", borderRadius: 99, fontSize: 12, cursor: "pointer",
              background: filter === tab.key ? "var(--accent)" : "var(--surface)",
              color: filter === tab.key ? "#1e1d16" : "var(--muted)",
              border: "1px solid",
              borderColor: filter === tab.key ? "var(--accent)" : "rgba(153,151,124,0.2)",
              fontWeight: filter === tab.key ? 500 : 400,
              transition: "all 0.15s",
            }}
          >{tab.label}</button>
        ))}
      </div>

      <Card>
        <div style={{
          display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 90px",
          padding: "8px 12px", marginBottom: 4,
        }}>
          {["Task", "Project", "Assignee", "Priority", "Status", ""].map((h, i) => (
            <span key={i} style={{ fontSize: 10, color: "var(--faint)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</span>
          ))}
        </div>
        <Divider />

        {filtered.length === 0 && <EmptyState message="No tasks found." />}

        {filtered.map(task => {
          const assignee = getUser(task.assignedTo)
          const project = getProject(task.projectId)
          return (
            <div key={task.id} style={{
              display: "grid", gridTemplateColumns: "2.5fr 1.5fr 1fr 1fr 1fr 90px",
              alignItems: "center", padding: "12px 12px",
              borderRadius: "var(--radius-md)", transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(153,151,124,0.06)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <div>
                <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{task.title}</p>
                {task.deadline && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>Due {task.deadline}</p>}
              </div>
              <p style={{ fontSize: 12, color: "var(--muted)" }}>{project?.name || "—"}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {assignee && <><Avatar name={assignee.name} color={assignee.color} size={22} /><span style={{ fontSize: 12, color: "var(--muted)" }}>{assignee.name.split(" ")[0]}</span></>}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <PriorityDot priority={task.priority} />
                <span style={{ fontSize: 12, color: "var(--muted)", textTransform: "capitalize" }}>{task.priority}</span>
              </div>
              <StatusBadge status={task.status} />
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn variant="danger" size="sm" onClick={() => handleDelete(task.id)}>Delete</Btn>
              </div>
            </div>
          )
        })}
      </Card>
    </Layout>
  )
}

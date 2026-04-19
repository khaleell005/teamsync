import Layout from "../../components/layout/Layout"
import { StatCard, Card, Badge, StatusBadge, PriorityDot, Avatar, PageHeader, Btn } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

const adminUser = mockMembers[0]

export default function AdminDashboard() {
  const activeTasks = mockTasks.filter(t => t.status !== "completed")
  const completedTasks = mockTasks.filter(t => t.status === "completed")
  const activeProjects = mockProjects.filter(p => p.status === "active")

  const getUser = (id) => mockMembers.find(m => m.id === id)
  const getProject = (id) => mockProjects.find(p => p.id === id)

  return (
    <Layout role="admin" user={{ name: adminUser.name, role: adminUser.role, color: adminUser.color }}>
      <PageHeader
        title="Overview"
        subtitle={`Welcome back, ${adminUser.name.split(" ")[0]}. Here's what's happening.`}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        <StatCard label="Total members" value={mockMembers.length} />
        <StatCard label="Active projects" value={activeProjects.length} accent="var(--accent)" />
        <StatCard label="Open tasks" value={activeTasks.length} accent="var(--gold)" />
        <StatCard label="Completed" value={completedTasks.length} accent="#7CB87C" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Active projects</h3>
            <Btn variant="ghost" size="sm">View all</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {activeProjects.map(p => (
              <div key={p.id} style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "12px 14px",
                border: "1px solid rgba(153,151,124,0.1)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{p.name}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{p.description.slice(0, 48)}...</p>
                  </div>
                  <Badge label="Active" color="success" />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: -6 }}>
                  {p.memberIds.map(mid => {
                    const m = getUser(mid)
                    return m ? (
                      <div key={mid} style={{ marginRight: -6 }} title={m.name}>
                        <Avatar name={m.name} color={m.color} size={24} />
                      </div>
                    ) : null
                  })}
                  <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 14 }}>{p.memberIds.length} members</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Recent tasks</h3>
            <Btn variant="ghost" size="sm">View all</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mockTasks.slice(0, 5).map(task => {
              const assignee = getUser(task.assignedTo)
              return (
                <div key={task.id} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid rgba(153,151,124,0.1)",
                }}>
                  <PriorityDot priority={task.priority} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, color: "var(--text)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{task.title}</p>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 1 }}>{getProject(task.projectId)?.name}</p>
                  </div>
                  {assignee && <Avatar name={assignee.name} color={assignee.color} size={24} />}
                  <StatusBadge status={task.status} />
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>Team members</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          {mockMembers.map(m => (
            <div key={m.id} style={{
              background: "var(--surface)",
              borderRadius: "var(--radius-md)",
              padding: "14px",
              textAlign: "center",
              border: "1px solid rgba(153,151,124,0.1)",
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
                <Avatar name={m.name} color={m.color} size={40} />
              </div>
              <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{m.name.split(" ")[0]}</p>
              <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 2, textTransform: "capitalize" }}>{m.role}</p>
              <div style={{ marginTop: 8 }}>
                <Badge
                  label={`${mockTasks.filter(t => t.assignedTo === m.id).length} tasks`}
                  color="muted"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  )
}

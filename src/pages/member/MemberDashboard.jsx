import Layout from "../../components/layout/Layout"
import { StatCard, Card, StatusBadge, PriorityDot, Avatar, Badge, PageHeader, Divider } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

const currentUser = mockMembers[1] // Tunde — member

export default function MemberDashboard() {
  const myTasks = mockTasks.filter(t => t.assignedTo === currentUser.id)
  const myProjects = mockProjects.filter(p => p.memberIds.includes(currentUser.id))

  const inProgress = myTasks.filter(t => t.status === "in_progress")
  const completed = myTasks.filter(t => t.status === "completed")
  const notStarted = myTasks.filter(t => t.status === "not_started")

  const getProject = (id) => mockProjects.find(p => p.id === id)
  const getTeammates = (project) => project.memberIds.filter(id => id !== currentUser.id).map(id => mockMembers.find(m => m.id === id)).filter(Boolean)

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <PageHeader
        title={`Hey, ${currentUser.name.split(" ")[0]} 👋`}
        subtitle="Here's your workspace at a glance."
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
        <StatCard label="My tasks" value={myTasks.length} />
        <StatCard label="In progress" value={inProgress.length} accent="var(--accent)" />
        <StatCard label="Completed" value={completed.length} accent="#7CB87C" />
        <StatCard label="Not started" value={notStarted.length} accent="var(--muted)" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20 }}>

        <Card>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 20 }}>My tasks</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {myTasks.length === 0 && <p style={{ fontSize: 13, color: "var(--muted)" }}>No tasks assigned yet.</p>}
            {myTasks.map(task => (
              <div key={task.id} style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-md)",
                padding: "12px 14px",
                border: "1px solid rgba(153,151,124,0.1)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <PriorityDot priority={task.priority} />
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{task.title}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: 11, color: "var(--muted)" }}>{getProject(task.projectId)?.name}</p>
                  {task.deadline && <p style={{ fontSize: 11, color: "var(--faint)" }}>Due {task.deadline}</p>}
                </div>
                {task.progressNote && (
                  <div style={{
                    marginTop: 8, padding: "6px 10px",
                    background: "rgba(153,151,124,0.08)",
                    borderRadius: "var(--radius-sm)",
                    borderLeft: "2px solid var(--accent)",
                  }}>
                    <p style={{ fontSize: 11, color: "var(--accent)", fontStyle: "italic" }}>"{task.progressNote}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>My projects</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myProjects.map(p => (
                <div key={p.id} style={{
                  background: "var(--surface)",
                  borderRadius: "var(--radius-md)",
                  padding: "12px 14px",
                  border: "1px solid rgba(153,151,124,0.1)",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)" }}>{p.name}</p>
                    <Badge label={mockTasks.filter(t => t.projectId === p.id && t.assignedTo === currentUser.id).length + " tasks"} color="muted" />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: -4 }}>
                    {getTeammates(p).map(m => (
                      <div key={m.id} style={{ marginRight: -6 }} title={m.name}>
                        <Avatar name={m.name} color={m.color} size={22} />
                      </div>
                    ))}
                    {getTeammates(p).length > 0 && (
                      <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: 14 }}>
                        {getTeammates(p).length} teammate{getTeammates(p).length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text)", marginBottom: 16 }}>Progress summary</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { label: "Completed", count: completed.length, total: myTasks.length, color: "#7CB87C" },
                { label: "In progress", count: inProgress.length, total: myTasks.length, color: "var(--accent)" },
                { label: "Not started", count: notStarted.length, total: myTasks.length, color: "var(--faint)" },
              ].map(item => (
                <div key={item.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>{item.label}</span>
                    <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{item.count}/{item.total}</span>
                  </div>
                  <div style={{ height: 4, background: "var(--surface)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", width: `${myTasks.length ? (item.count / myTasks.length) * 100 : 0}%`,
                      background: item.color, borderRadius: 99, transition: "width 0.4s ease",
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

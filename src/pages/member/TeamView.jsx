import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, StatusBadge, PriorityDot, Badge, PageHeader } from "../../components/ui"
import { mockMembers, mockProjects, mockTasks } from "../../utils/mockData"

const currentUser = mockMembers[1]
const myProjects = mockProjects.filter(p => p.memberIds.includes(currentUser.id))

export default function TeamView() {
  const [selectedProject, setSelectedProject] = useState(myProjects[0]?.id || "")

  const project = mockProjects.find(p => p.id === selectedProject)
  const projectMembers = project ? project.memberIds.map(id => mockMembers.find(m => m.id === id)).filter(Boolean) : []
  const projectTasks = mockTasks.filter(t => t.projectId === selectedProject)

  const getUser = (id) => mockMembers.find(m => m.id === id)

  const tasksByMember = projectMembers.map(member => ({
    member,
    tasks: projectTasks.filter(t => t.assignedTo === member.id),
  }))

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <PageHeader
        title="Team View"
        subtitle="See everyone's tasks across your projects"
      />

      {myProjects.length > 1 && (
        <div style={{ display: "flex", gap: 8, marginBottom: 28, flexWrap: "wrap" }}>
          {myProjects.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedProject(p.id)}
              style={{
                padding: "7px 16px", borderRadius: 99, fontSize: 12, cursor: "pointer",
                background: selectedProject === p.id ? "var(--accent)" : "var(--surface)",
                color: selectedProject === p.id ? "#1e1d16" : "var(--muted)",
                border: "1px solid",
                borderColor: selectedProject === p.id ? "var(--accent)" : "rgba(153,151,124,0.2)",
                fontWeight: selectedProject === p.id ? 500 : 400,
                transition: "all 0.15s",
              }}
            >{p.name}</button>
          ))}
        </div>
      )}

      {project && (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28, padding: "14px 18px", background: "var(--surface)", borderRadius: "var(--radius-lg)", border: "1px solid rgba(153,151,124,0.12)" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{project.name}</p>
              <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{project.description}</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex" }}>
                {projectMembers.map(m => (
                  <div key={m.id} style={{ marginRight: -6 }} title={m.name}>
                    <Avatar name={m.name} color={m.color} size={28} />
                  </div>
                ))}
              </div>
              <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 12 }}>{projectMembers.length} members · {projectTasks.length} tasks</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            {tasksByMember.map(({ member, tasks }) => (
              <div key={member.id} style={{
                background: "var(--surface)",
                borderRadius: "var(--radius-lg)",
                border: `1px solid ${member.color}33`,
                overflow: "hidden",
              }}>
                <div style={{
                  padding: "14px 16px",
                  background: `${member.color}18`,
                  borderBottom: `1px solid ${member.color}22`,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}>
                  <Avatar name={member.name} color={member.color} size={32} />
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{member.name}</p>
                    <p style={{ fontSize: 10, color: "var(--muted)", textTransform: "capitalize" }}>{member.role}</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <Badge label={`${tasks.length} task${tasks.length !== 1 ? "s" : ""}`} color="muted" />
                  </div>
                </div>

                <div style={{ padding: "12px", display: "flex", flexDirection: "column", gap: 8 }}>
                  {tasks.length === 0 && (
                    <p style={{ fontSize: 12, color: "var(--faint)", textAlign: "center", padding: "16px 0" }}>No tasks assigned</p>
                  )}
                  {tasks.map(task => (
                    <div key={task.id} style={{
                      background: "var(--card)",
                      borderRadius: "var(--radius-md)",
                      padding: "10px 12px",
                      border: "1px solid rgba(153,151,124,0.1)",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <PriorityDot priority={task.priority} />
                          <p style={{ fontSize: 12, fontWeight: 500, color: "var(--text)" }}>{task.title}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <StatusBadge status={task.status} />
                        {task.deadline && <span style={{ fontSize: 10, color: "var(--faint)" }}>Due {task.deadline}</span>}
                      </div>
                      {task.progressNote && (
                        <div style={{
                          marginTop: 8, padding: "5px 8px",
                          background: `${member.color}12`,
                          borderRadius: "var(--radius-sm)",
                          borderLeft: `2px solid ${member.color}`,
                        }}>
                          <p style={{ fontSize: 10, color: member.color, fontStyle: "italic" }}>"{task.progressNote}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}

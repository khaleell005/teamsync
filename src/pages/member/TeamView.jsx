import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Avatar, StatusBadge, PriorityDot, Badge, PageHeader, LoadingScreen } from "../../components/ui"
import { useUsers } from "../../hooks/useUsers"
import { useProjects } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function TeamView() {
  const { user: currentUser } = useSessionUser()
  const [selectedProject, setSelectedProject] = useState("")
  const { users: userList, loading: usersLoading } = useUsers()
  const { projects: projectList, loading: projectsLoading } = useProjects()
  const { tasks: taskList, loading: tasksLoading } = useTasks()

  if (!currentUser || usersLoading || projectsLoading || tasksLoading) {
    return <LoadingScreen label="Loading team view..." />
  }

  const myProjects = projectList.filter((project) => project.memberIds?.includes(currentUser.id))
  const activeProjectId = selectedProject || myProjects[0]?.id || ""
  const project = projectList.find((item) => item.id === activeProjectId)
  const projectMembers = (project?.memberIds || []).map((id) => userList.find((user) => user.id === id)).filter(Boolean)
  const projectTasks = taskList.filter((task) => task.projectId === activeProjectId)
  const tasksByMember = projectMembers.map((member) => ({
    member,
    tasks: projectTasks.filter((task) => task.assignedTo === member.id),
  }))

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Team View"
          subtitle="See everyone's tasks across your projects"
        />

        {myProjects.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {myProjects.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedProject(item.id)}
                className={`rounded-full border px-4 py-1.5 text-xs transition ${
                  activeProjectId === item.id
                    ? "border-accent bg-[linear-gradient(180deg,var(--color-accent-strong),var(--color-accent))] font-medium text-canvas"
                    : "border-line/80 bg-white/[0.03] text-muted hover:text-copy"
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        )}

        {project && (
          <>
            <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-line/70 bg-[linear-gradient(180deg,rgba(63,54,45,0.92)_0%,rgba(53,45,37,0.92)_100%)] px-4 py-4 shadow-soft">
              <div>
                <p className="text-sm font-semibold text-copy">{project.name}</p>
                <p className="mt-0.5 text-[11px] text-muted">{project.description}</p>
              </div>

              <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
                <div className="flex">
                  {projectMembers.map((member) => (
                    <div key={member.id} className="-mr-1.5" title={member.name}>
                      <Avatar name={member.name} color={member.color} size={28} />
                    </div>
                  ))}
                </div>
                <span className="ml-3 text-sm text-muted">{projectMembers.length} members · {projectTasks.length} tasks</span>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasksByMember.map(({ member, tasks }) => (
                <div key={member.id} className="overflow-hidden rounded-3xl border bg-surface/90" style={{ borderColor: `${member.color}33` }}>
                  <div className="flex items-center gap-3 border-b px-4 py-3.5" style={{ backgroundColor: `${member.color}18`, borderBottomColor: `${member.color}22` }}>
                    <Avatar name={member.name} color={member.color} size={32} />
                    <div>
                      <p className="text-sm font-semibold text-copy">{member.name}</p>
                      <p className="text-[10px] capitalize text-muted">{member.role}</p>
                    </div>
                    <div className="ml-auto">
                      <Badge label={`${tasks.length} task${tasks.length !== 1 ? "s" : ""}`} color="muted" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 p-3">
                    {tasks.length === 0 && (
                      <p className="py-4 text-center text-sm text-faint">No tasks assigned</p>
                    )}

                    {tasks.map((task) => (
                      <div key={task.id} className="rounded-2xl border border-line/60 bg-panel/80 px-3 py-2.5">
                        <div className="mb-1.5 flex items-start justify-between">
                          <div className="flex items-center gap-1.5">
                            <PriorityDot priority={task.priority} />
                            <p className="text-sm font-medium text-copy">{task.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <StatusBadge status={task.status} />
                          {task.deadline && <span className="text-[10px] text-faint">Due {task.deadline}</span>}
                        </div>
                        {task.progressNote && (
                          <div className="mt-2 rounded-xl border-l-2 px-2 py-1" style={{ backgroundColor: `${member.color}12`, borderLeftColor: member.color }}>
                            <p className="text-[10px] italic" style={{ color: member.color }}>&quot;{task.progressNote}&quot;</p>
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
      </div>
    </Layout>
  )
}

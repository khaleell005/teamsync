import Layout from "../../components/layout/Layout"
import { StatCard, Card, StatusBadge, PriorityDot, Avatar, Badge, PageHeader, LoadingScreen } from "../../components/ui"
import { useTasks } from "../../hooks/useTasks"
import { useProjects } from "../../hooks/useProjects"
import { useUsers } from "../../hooks/useUsers"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function MemberDashboard() {
  const { user: currentUser } = useSessionUser()
  const { tasks, loading: tasksLoading } = useTasks()
  const { projects, loading: projectsLoading } = useProjects()
  const { users, loading: usersLoading } = useUsers()

  if (!currentUser || tasksLoading || projectsLoading || usersLoading) {
    return <LoadingScreen label="Loading dashboard..." />
  }

  const isViewer = currentUser.role === "viewer"
  const myTasks = isViewer
    ? tasks.filter((task) => {
        const project = projects.find((item) => item.id === task.projectId)
        return project?.memberIds?.includes(currentUser.id)
      })
    : tasks.filter((task) => task.assignedTo === currentUser.id)

  const myProjects = projects.filter((project) => project.memberIds?.includes(currentUser.id))
  const inProgress = myTasks.filter((task) => task.status === "in_progress")
  const completed = myTasks.filter((task) => task.status === "completed")
  const notStarted = myTasks.filter((task) => task.status === "not_started")

  const getProject = (id) => projects.find((project) => project.id === id)
  const getTeammates = (project) =>
    (project?.memberIds || [])
      .filter((memberId) => memberId !== currentUser.id)
      .map((memberId) => users.find((member) => member.id === memberId))
      .filter(Boolean)

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={`Hey, ${currentUser.name.split(" ")[0]} 👋`}
          subtitle="Here's your workspace at a glance."
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="My tasks" value={myTasks.length} />
          <StatCard label="In progress" value={inProgress.length} accent="var(--color-accent)" />
          <StatCard label="Completed" value={completed.length} accent="#7CB87C" />
          <StatCard label="Not started" value={notStarted.length} accent="var(--color-muted)" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,1fr)]">
          <Card>
            <h3 className="mb-5 text-sm font-semibold text-copy">My tasks</h3>
            <div className="flex flex-col gap-2.5">
              {myTasks.length === 0 && <p className="text-sm text-muted">No tasks assigned yet.</p>}
              {myTasks.map((task) => (
                <div key={task.id} className="rounded-2xl border border-line/60 bg-surface/80 px-3.5 py-3">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <PriorityDot priority={task.priority} />
                      <p className="text-sm font-medium text-copy">{task.title}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted">
                    <p>{getProject(task.projectId)?.name}</p>
                    {task.deadline && <p className="text-faint">Due {task.deadline}</p>}
                  </div>
                  {task.progressNote && (
                    <div className="mt-2 rounded-xl border-l-2 border-accent bg-accent/8 px-2.5 py-1.5">
                      <p className="text-[11px] italic text-accent">&quot;{task.progressNote}&quot;</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-copy">My projects</h3>
              <div className="flex flex-col gap-2.5">
                {myProjects.map((project) => (
                  <div key={project.id} className="rounded-2xl border border-line/60 bg-surface/80 px-3.5 py-3">
                    <div className="mb-2.5 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-copy">{project.name}</p>
                      <Badge label={`${tasks.filter((task) => task.projectId === project.id && task.assignedTo === currentUser.id).length} tasks`} color="muted" />
                    </div>
                    <div className="flex items-center">
                      {getTeammates(project).map((member) => (
                        <div key={member.id} className="-mr-1.5" title={member.name}>
                          <Avatar name={member.name} color={member.color} size={22} />
                        </div>
                      ))}
                      {getTeammates(project).length > 0 && (
                        <span className="ml-4 text-[11px] text-muted">
                          {getTeammates(project).length} teammate{getTeammates(project).length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-4 text-sm font-semibold text-copy">Progress summary</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Completed", count: completed.length, total: myTasks.length, barClassName: "bg-emerald-400" },
                  { label: "In progress", count: inProgress.length, total: myTasks.length, barClassName: "bg-accent" },
                  { label: "Not started", count: notStarted.length, total: myTasks.length, barClassName: "bg-faint" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted">{item.label}</span>
                      <span className="font-medium text-copy">{item.count}/{item.total}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface">
                      <div
                        className={`h-full w-[var(--progress-width)] rounded-full transition-[width] duration-300 ${item.barClassName}`}
                        style={{
                          "--progress-width": `${myTasks.length ? (item.count / myTasks.length) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

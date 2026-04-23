import Layout from "../../components/layout/Layout"
import { StatCard, Card, Badge, StatusBadge, PriorityDot, Avatar, PageHeader, Btn, LoadingScreen } from "../../components/ui"
import { useUsers } from "../../hooks/useUsers"
import { useProjects } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function AdminDashboard() {
  const { user: currentUser } = useSessionUser()
  const { users: userList, loading: usersLoading } = useUsers()
  const { projects: projectList, loading: projectsLoading } = useProjects()
  const { tasks: taskList, loading: tasksLoading } = useTasks()

  if (!currentUser || usersLoading || projectsLoading || tasksLoading) {
    return <LoadingScreen label="Loading overview..." />
  }

  const activeTasks = taskList.filter((task) => task.status !== "completed")
  const completedTasks = taskList.filter((task) => task.status === "completed")
  const activeProjects = projectList.filter((project) => project.status === "active")

  const getUser = (id) => userList.find((user) => user.id === id)
  const getProject = (id) => projectList.find((project) => project.id === id)
  const getMemberTaskCount = (memberId) => taskList.filter((task) => task.assignedTo === memberId).length

  return (
    <Layout role="admin" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <div className="flex flex-col gap-5 sm:gap-6">
        <PageHeader
          title="Overview"
          subtitle={`Welcome back, ${currentUser.name.split(" ")[0]}. Here's what's happening.`}
        />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total members" value={userList.length} />
          <StatCard label="Active projects" value={activeProjects.length} accent="var(--color-accent)" />
          <StatCard label="Open tasks" value={activeTasks.length} accent="var(--color-gold)" />
          <StatCard label="Completed" value={completedTasks.length} accent="#7CB87C" />
        </div>

        <div className="grid gap-4 lg:gap-5 xl:grid-cols-2">
          <Card>
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-[18px]">
              <h3 className="text-sm font-semibold text-copy">Active projects</h3>
              <Btn variant="ghost" size="sm">View all</Btn>
            </div>
            <div className="flex flex-col gap-2.5 sm:gap-3">
              {activeProjects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-line/60 bg-surface/80 px-3.5 py-3">
                  <div className="mb-2.5 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-copy">{project.name}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{project.description.slice(0, 48)}...</p>
                    </div>
                    <Badge label="Active" color="success" />
                  </div>
                  <div className="flex items-center">
                    {project.memberIds.map((memberId) => {
                      const member = getUser(memberId)
                      return member ? (
                        <div key={memberId} className="-mr-1.5" title={member.name}>
                          <Avatar name={member.name} color={member.color} photo={member.photo} size={24} />
                        </div>
                      ) : null
                    })}
                    <span className="ml-4 text-[11px] text-muted">{project.memberIds.length} members</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="mb-4 flex items-center justify-between gap-3 sm:mb-[18px]">
              <h3 className="text-sm font-semibold text-copy">Recent tasks</h3>
              <Btn variant="ghost" size="sm">View all</Btn>
            </div>
            <div className="flex flex-col gap-2.5">
              {taskList.slice(0, 5).map((task) => {
                const assignee = getUser(task.assignedTo)

                return (
                  <div key={task.id} className="flex items-center gap-3 rounded-2xl border border-line/60 bg-surface/80 px-3 py-2.5">
                    <PriorityDot priority={task.priority} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-copy">{task.title}</p>
                      <p className="mt-0.5 text-[11px] text-muted">{getProject(task.projectId)?.name}</p>
                    </div>
                    {assignee && <Avatar name={assignee.name} color={assignee.color} photo={assignee.photo} size={24} />}
                    <StatusBadge status={task.status} />
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        <Card>
          <div className="mb-4 sm:mb-5">
            <h3 className="text-sm font-semibold text-copy">Team members</h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {userList.map((member) => (
              <div key={member.id} className="rounded-2xl border border-line/60 bg-surface/80 p-3 text-center sm:p-3.5">
                <div className="mb-2.5 flex justify-center">
                  <Avatar name={member.name} color={member.color} photo={member.photo} size={40} />
                </div>
                <p className="text-sm font-medium text-copy">{member.name.split(" ")[0]}</p>
                <p className="mt-0.5 text-[10px] capitalize text-muted">{member.role}</p>
                <div className="mt-2">
                  <Badge
                    label={`${getMemberTaskCount(member.id)} tasks`}
                    color="muted"
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  )
}

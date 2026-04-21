import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, Avatar, StatusBadge, PriorityDot, Btn, Input, Select, TextArea, PageHeader, Divider, EmptyState, LoadingScreen } from "../../components/ui"
import { useProjects } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import { useUsers } from "../../hooks/useUsers"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function MyTasks() {
  const { user: currentUser } = useSessionUser()
  const [editingId, setEditingId] = useState(null)
  const [noteInput, setNoteInput] = useState("")
  const [statusInput, setStatusInput] = useState("")
  const [assignMode, setAssignMode] = useState(null)
  const [assignTo, setAssignTo] = useState("")
  const { projects: projectList, loading: projectsLoading } = useProjects()
  const { tasks: taskList, update: updateTask, loading: tasksLoading } = useTasks()
  const { users: userList, loading: usersLoading } = useUsers()

  if (!currentUser || projectsLoading || tasksLoading || usersLoading) {
    return <LoadingScreen label="Loading tasks..." />
  }

  const isPL = currentUser.role === "PL"
  const isViewer = currentUser.role === "viewer"
  const isAdmin = currentUser.role === "admin"

  const myProjects = projectList.filter((project) => project.leadId === currentUser.id)
  const myProjectIds = myProjects.map((p) => p.id)

  let tasks
  if (isPL) {
    tasks = taskList.filter((task) => myProjectIds.includes(task.projectId))
  } else if (isViewer) {
    tasks = taskList.filter((task) => {
      const project = projectList.find((item) => item.id === task.projectId)
      return project?.memberIds?.includes(currentUser.id)
    })
  } else {
    tasks = taskList.filter((task) => task.assignedTo === currentUser.id)
  }

  const getProject = (id) => projectList.find((project) => project.id === id)
  const getUser = (id) => userList.find((user) => user.id === id)

  const getProjectMembers = (projectId) => {
    const project = projectList.find((p) => p.id === projectId)
    if (!project) return []
    return userList.filter((user) => project.memberIds?.includes(user.id))
  }

  const openEdit = (task) => {
    setEditingId(task.id)
    setNoteInput(task.progressNote || "")
    setStatusInput(task.status)
  }

  const openAssign = (task) => {
    setAssignMode(task.id)
    setAssignTo(task.assignedTo || "")
  }

  const saveUpdate = async (id) => {
    const task = taskList.find((item) => item.id === id)
    if (task) {
      await updateTask(id, { ...task, status: statusInput, progressNote: noteInput })
    }
    setEditingId(null)
  }

  const saveAssign = async (taskId) => {
    await updateTask(taskId, { assignedTo: assignTo || null })
    setAssignMode(null)
    setAssignTo("")
  }

  const handleTaskUpdateSubmit = async (event, taskId) => {
    event.preventDefault()
    await saveUpdate(taskId)
  }

  const statusOptions = [
    { value: "not_started", label: "Not started" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]

  const memberOptions = [
    { value: "", label: "Unassigned" },
    ...getProjectMembers(assignMode ? taskList.find((t) => t.id === assignMode)?.projectId : "").map((user) => ({
      value: user.id,
      label: user.name,
    })),
  ]

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...tasks].sort((first, second) => priorityOrder[first.priority] - priorityOrder[second.priority])

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isPL ? "Project Tasks" : isViewer ? "Project Tasks" : "My Tasks"}
          subtitle={`${tasks.length} ${isPL ? "tasks in your projects" : isViewer ? "tasks in your projects" : "tasks assigned to you"}`}
        />

        <div className="flex flex-col gap-3.5">
          {sorted.length === 0 && <EmptyState message="No tasks found." />}

          {sorted.map((task) => {
            const isEditing = editingId === task.id
            const isAssigning = assignMode === task.id
            const project = getProject(task.projectId)
            const assignee = getUser(task.assignedTo)
            const members = getProjectMembers(task.projectId)

            return (
              <Card key={task.id} className="px-5 py-[18px]">
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <PriorityDot priority={task.priority} />
                      <h3 className="text-[15px] font-semibold text-copy">{task.title}</h3>
                    </div>
                    <p className="text-sm leading-6 text-muted">{task.description}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>

                <div className="mb-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[11px] text-faint">
                  <span>Project: <span className="text-muted">{project?.name || "—"}</span></span>
                  {task.deadline && <span>Due: <span className="text-muted">{task.deadline}</span></span>}
                  <span className="capitalize">Priority: <span className="text-muted">{task.priority}</span></span>
                  <span>Assigned: <span className="text-muted">{assignee?.name || "—"}</span></span>
                </div>

                {!isEditing && task.progressNote && (
                  <div className="mb-3.5 rounded-2xl border-l-2 border-accent bg-accent/8 px-3 py-2">
                    <p className="text-xs italic text-accent">&quot;{task.progressNote}&quot;</p>
                  </div>
                )}

                {isAssigning ? (
                  <form className="flex flex-col gap-3" onSubmit={(e) => { e.preventDefault(); saveAssign(task.id) }}>
                    <Divider />
                    <Select
                      label="Assign to"
                      value={assignTo}
                      onChange={(e) => setAssignTo(e.target.value)}
                      options={[
                        { value: "", label: "Unassigned" },
                        ...members.map((user) => ({ value: user.id, label: user.name })),
                      ]}
                    />
                    <div className="flex gap-2">
                      <Btn type="submit">Save</Btn>
                      <Btn type="button" variant="ghost" onClick={() => setAssignMode(null)}>Cancel</Btn>
                    </div>
                  </form>
                ) : isEditing ? (
                  <form className="flex flex-col gap-3" onSubmit={(event) => handleTaskUpdateSubmit(event, task.id)}>
                    <Divider />
                    <Select
                      label="Update status"
                      value={statusInput}
                      onChange={(event) => setStatusInput(event.target.value)}
                      options={statusOptions}
                    />
                    <TextArea
                      label="Progress note"
                      value={noteInput}
                      onChange={(event) => setNoteInput(event.target.value)}
                      placeholder="e.g. Finished the Figma designs, now implementing..."
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Btn type="submit">Save update</Btn>
                      <Btn type="button" variant="ghost" onClick={() => setEditingId(null)}>Cancel</Btn>
                    </div>
                  </form>
                ) : (
                  <div className="flex gap-2">
                    {!isViewer && (
                      <Btn variant="ghost" size="sm" onClick={() => openEdit(task)}>
                        Update progress
                      </Btn>
                    )}
                    {isPL && (
                      <Btn variant="ghost" size="sm" onClick={() => openAssign(task)}>
                        Reassign
                      </Btn>
                    )}
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

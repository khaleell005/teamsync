import { useState } from "react"
import Layout from "../../components/layout/Layout"
import { Card, StatusBadge, PriorityDot, Btn, Select, TextArea, PageHeader, Divider, EmptyState, LoadingScreen } from "../../components/ui"
import { useProjects } from "../../hooks/useProjects"
import { useTasks } from "../../hooks/useTasks"
import { useSessionUser } from "../../hooks/useSessionUser"

export default function MyTasks() {
  const { user: currentUser } = useSessionUser()
  const [editingId, setEditingId] = useState(null)
  const [noteInput, setNoteInput] = useState("")
  const [statusInput, setStatusInput] = useState("")
  const { projects: projectList, loading: projectsLoading } = useProjects()
  const { tasks: taskList, update: updateTask, loading: tasksLoading } = useTasks()

  if (!currentUser || projectsLoading || tasksLoading) {
    return <LoadingScreen label="Loading tasks..." />
  }

  const isViewer = currentUser.role === "viewer"
  const tasks = isViewer
    ? taskList.filter((task) => {
        const project = projectList.find((item) => item.id === task.projectId)
        return project?.memberIds?.includes(currentUser.id)
      })
    : taskList.filter((task) => task.assignedTo === currentUser.id)

  const getProject = (id) => projectList.find((project) => project.id === id)

  const openEdit = (task) => {
    setEditingId(task.id)
    setNoteInput(task.progressNote || "")
    setStatusInput(task.status)
  }

  const saveUpdate = async (id) => {
    const task = taskList.find((item) => item.id === id)
    if (task) {
      await updateTask(id, { ...task, status: statusInput, progressNote: noteInput })
    }
    setEditingId(null)
  }

  const statusOptions = [
    { value: "not_started", label: "Not started" },
    { value: "in_progress", label: "In progress" },
    { value: "completed", label: "Completed" },
  ]

  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sorted = [...tasks].sort((first, second) => priorityOrder[first.priority] - priorityOrder[second.priority])

  return (
    <Layout role="member" user={{ name: currentUser.name, role: currentUser.role, color: currentUser.color }}>
      <div className="flex flex-col gap-6">
        <PageHeader
          title={isViewer ? "Project Tasks" : "My Tasks"}
          subtitle={isViewer ? `${tasks.length} tasks in your projects` : `${tasks.length} tasks assigned to you`}
        />

        <div className="flex flex-col gap-3.5">
          {sorted.length === 0 && <EmptyState message="No tasks assigned yet." />}

          {sorted.map((task) => {
            const isEditing = editingId === task.id
            const project = getProject(task.projectId)

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
                </div>

                {!isEditing && task.progressNote && (
                  <div className="mb-3.5 rounded-2xl border-l-2 border-accent bg-accent/8 px-3 py-2">
                    <p className="text-xs italic text-accent">&quot;{task.progressNote}&quot;</p>
                  </div>
                )}

                {isEditing ? (
                  <div className="flex flex-col gap-3">
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
                      <Btn onClick={() => saveUpdate(task.id)}>Save update</Btn>
                      <Btn variant="ghost" onClick={() => setEditingId(null)}>Cancel</Btn>
                    </div>
                  </div>
                ) : !isViewer && (
                  <Btn variant="ghost" size="sm" onClick={() => openEdit(task)}>
                    Update progress
                  </Btn>
                )}
              </Card>
            )
          })}
        </div>
      </div>
    </Layout>
  )
}

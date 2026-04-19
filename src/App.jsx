import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import ManageMembers from "./pages/admin/ManageMembers"
import ManageProjects from "./pages/admin/ManageProjects"
import ManageTasks from "./pages/admin/ManageTasks"
import MemberDashboard from "./pages/member/MemberDashboard"
import MyTasks from "./pages/member/MyTasks"
import TeamView from "./pages/member/TeamView"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/members" element={<ManageMembers />} />
        <Route path="/admin/projects" element={<ManageProjects />} />
        <Route path="/admin/tasks" element={<ManageTasks />} />
        <Route path="/dashboard" element={<MemberDashboard />} />
        <Route path="/my-tasks" element={<MyTasks />} />
        <Route path="/team-view" element={<TeamView />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export const mockMembers = [
  { id: "u1", name: "Khaleel", email: "khaleel@teamsync.io", password: "admin123", role: "admin", color: "#99977C", photo: null, createdAt: "Apr 1, 2025" },
  { id: "u2", name: "Tunde Musa", email: "tunde@teamsync.io", password: "pm123", role: "pm", color: "#7EB8C9", photo: null, createdAt: "Apr 3, 2025" },
  { id: "u3", name: "Aisha Okonkwo", email: "aisha@teamsync.io", password: "member123", role: "member", color: "#C97E8A", photo: null, createdAt: "Apr 3, 2025" },
  { id: "u4", name: "Rasheed Bello", email: "rasheed@teamsync.io", password: "member123", role: "member", color: "#85C98A", photo: null, createdAt: "Apr 5, 2025" },
  { id: "u5", name: "Ngozi Eze", email: "ngozi@teamsync.io", password: "viewer123", role: "viewer", color: "#C9A84C", photo: null, createdAt: "Apr 6, 2025" },
]

export const mockProjects = [
  { id: "p1", name: "NexaFlow Rebrand", description: "Full brand overhaul including logo, web, and social assets.", leadId: "u2", memberIds: ["u1", "u2", "u3"], status: "active", createdAt: "Apr 2, 2025" },
  { id: "p2", name: "Backend Sprint Q2", description: "API refactor, auth improvements, and database optimizations.", leadId: "u2", memberIds: ["u1", "u3", "u4"], status: "active", createdAt: "Apr 4, 2025" },
  { id: "p3", name: "Mobile App MVP", description: "React Native MVP for iOS and Android launch.", leadId: "u2", memberIds: ["u2", "u4", "u5"], status: "active", createdAt: "Apr 7, 2025" },
  { id: "p4", name: "Marketing Site v2", description: "Redesign and rebuild of the public marketing website.", leadId: "u2", memberIds: ["u1", "u2"], status: "completed", createdAt: "Mar 20, 2025" },
]

export const mockTasks = [
  { id: "t1", title: "Redesign landing page", description: "Full redesign of the main landing page using Figma mockups.", projectId: "p1", assignedTo: "u2", status: "in_progress", priority: "high", deadline: "Apr 22, 2025", progressNote: "Figma done, now coding", createdAt: "Apr 5, 2025" },
  { id: "t2", title: "Create logo variations", description: "Design 3 logo variants for client review.", projectId: "p1", assignedTo: "u3", status: "completed", priority: "medium", deadline: "Apr 15, 2025", progressNote: "All 3 variants delivered", createdAt: "Apr 5, 2025" },
  { id: "t3", title: "Setup CI/CD pipeline", description: "Configure GitHub Actions for staging and production.", projectId: "p2", assignedTo: "u4", status: "not_started", priority: "high", deadline: "Apr 25, 2025", progressNote: "", createdAt: "Apr 6, 2025" },
  { id: "t4", title: "Fix auth bug on login", description: "Token refresh issue causing random logouts.", projectId: "p2", assignedTo: "u3", status: "in_progress", priority: "high", deadline: "Apr 18, 2025", progressNote: "Found root cause, patching now", createdAt: "Apr 6, 2025" },
  { id: "t5", title: "Write API documentation", description: "Document all endpoints using Swagger/OpenAPI.", projectId: "p2", assignedTo: "u4", status: "not_started", priority: "low", deadline: "Apr 28, 2025", progressNote: "", createdAt: "Apr 7, 2025" },
  { id: "t6", title: "Build onboarding screens", description: "5-screen onboarding flow for new users.", projectId: "p3", assignedTo: "u2", status: "in_progress", priority: "medium", deadline: "Apr 30, 2025", progressNote: "3 of 5 screens done", createdAt: "Apr 8, 2025" },
  { id: "t7", title: "Integrate push notifications", description: "Firebase Cloud Messaging for iOS and Android.", projectId: "p3", assignedTo: "u4", status: "not_started", priority: "medium", deadline: "May 5, 2025", progressNote: "", createdAt: "Apr 8, 2025" },
  { id: "t8", title: "SEO audit and fixes", description: "Run full SEO audit and implement recommendations.", projectId: "p4", assignedTo: "u2", status: "completed", priority: "low", deadline: "Apr 10, 2025", progressNote: "All fixes applied", createdAt: "Apr 3, 2025" },
]

import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc, serverTimestamp, getDocs, deleteDoc, query, orderBy } from 'firebase/firestore'

const args = process.argv.slice(2)
const mode = args[0]

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const seedMembers = [
  { name: "Admin User", email: "admin@teamsync.io", role: "admin", color: "#7EB8C9" },
  { name: "Sarah Chen", email: "sarah@teamsync.io", role: "PL", color: "#C97E8A" },
  { name: "Mike Johnson", email: "mike@teamsync.io", role: "member", color: "#85C98A" },
  { name: "Emily Davis", email: "emily@teamsync.io", role: "member", color: "#C9A84C" },
  { name: "Alex Rivera", email: "alex@teamsync.io", role: "member", color: "#A07EC9" },
]

const seedProjects = [
  { name: "NexaFlow Rebrand", description: "Complete brand refresh including logo, website, and marketing materials", status: "active" },
  { name: "Mobile App v2", description: "Next generation mobile application with offline support", status: "active" },
  { name: "API Integration", description: "Third-party API integrations for data sync", status: "completed" },
  { name: "User Testing Q1", description: "Q1 user testing and feedback implementation", status: "active" },
]

const seedTasks = [
  { title: "Design landing page mockups", priority: "high", status: "in_progress", deadline: "Apr 25, 2025" },
  { title: "Setup CI/CD pipeline", priority: "high", status: "completed", deadline: "Apr 20, 2025" },
  { title: "Write API documentation", priority: "medium", status: "not_started", deadline: "May 1, 2025" },
  { title: "Fix login bug", priority: "high", status: "completed", deadline: "Apr 18, 2025" },
  { title: "Build onboarding screens", priority: "medium", status: "in_progress", deadline: "Apr 30, 2025" },
  { title: "SEO audit and fixes", priority: "low", status: "not_started", deadline: "May 15, 2025" },
  { title: "Push notifications integration", priority: "medium", status: "not_started", deadline: "May 10, 2025" },
  { title: "Logo variations design", priority: "high", status: "completed", deadline: "Apr 15, 2025" },
]

const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

async function clearCollection(col) {
  const q = query(collection(db, col), orderBy("createdAtTimestamp"))
  const snapshot = await getDocs(q)
  const deletions = snapshot.docs.map(d => deleteDoc(doc(db, col, d.id)))
  await Promise.all(deletions)
  console.log(`  🗑️  Cleared ${snapshot.size} existing documents`)
}

async function migrateUsers() {
  await clearCollection("users")
  console.log("\n📦 Migrating users...")
  
  for (const member of seedMembers) {
    const id = `u${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
    const userData = {
      ...member,
      photo: null,
      createdAt: now,
      createdAtTimestamp: serverTimestamp()
    }
    
    await setDoc(doc(db, "users", id), userData)
    console.log(`  ✅ Created user: ${member.name} (${member.role})`)
  }
  
  console.log("\n✅ Users migration complete!")
}

async function migrateProjects() {
  await clearCollection("projects")
  console.log("\n📦 Migrating projects...")
  
  for (const project of seedProjects) {
    const id = `p${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
    const projectData = {
      ...project,
      leadId: "",
      memberIds: [],
      createdAt: now,
      createdAtTimestamp: serverTimestamp()
    }
    
    await setDoc(doc(db, "projects", id), projectData)
    console.log(`  ✅ Created project: ${project.name}`)
  }
  
  console.log("\n✅ Projects migration complete!")
}

async function migrateTasks() {
  const projQ = query(collection(db, "projects"), orderBy("createdAtTimestamp"))
  const projSnap = await getDocs(projQ)
  const projects = projSnap.docs.map(d => ({ id: d.id, ...d.data() }))
  
  await clearCollection("tasks")
  console.log("\n📦 Migrating tasks...")
  
  for (let i = 0; i < seedTasks.length; i++) {
    const task = seedTasks[i]
    const id = `t${Date.now()}_${Math.random().toString(36).slice(2, 5)}`
    const taskData = {
      ...task,
      projectId: projects[i % projects.length]?.id || "",
      assignedTo: "",
      progressNote: "",
      description: "",
      createdAt: now,
      createdAtTimestamp: serverTimestamp()
    }
    
    await setDoc(doc(db, "tasks", id), taskData)
    console.log(`  ✅ Created task: ${task.title}`)
  }
  
  console.log("\n✅ Tasks migration complete!")
}

async function showStatus() {
  console.log("\n📊 Firestore Status")
  console.log("====================")
  console.log(`Users: ${seedMembers.length}`)
  console.log(`Projects: ${seedProjects.length}`)
  console.log(`Tasks: ${seedTasks.length}`)
}

async function main() {
  switch (mode) {
    case 'users':
      await migrateUsers()
      break
    case 'projects':
      await migrateProjects()
      break
    case 'tasks':
      await migrateTasks()
      break
    case 'all':
      console.log("\n🚀 Starting full migration...")
      console.log("==============================\n")
      await migrateUsers()
      await migrateProjects()
      await migrateTasks()
      console.log("🚀 Full migration complete!")
      break
    case 'status':
      await showStatus()
      break
    default:
      console.log("\n📦 Usage: npm run migrate -- <command>")
      console.log("Commands: users | projects | tasks | all | status")
  }
  process.exit(0)
}

main()

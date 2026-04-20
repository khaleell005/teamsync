# Firebase Setup Guide

## 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the steps
3. Enable **Authentication**:
   - Go to Authentication → Sign-in method
   - Enable "Email/Password"
4. Enable **Firestore Database**:
   - Go to Firestore Database → Create database
   - Start in **Test mode** (or set up security rules)

## 2. Get Firebase Config

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" 
3. Click web icon (</>)
4. Copy the firebaseConfig object

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 4. Set Up Firestore Security Rules (for production)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admins can read/write all users
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.token.admin == true;
    }
    
    // Team members can read projects/tasks they belong to
    match /projects/{projectId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
    
    match /tasks/{taskId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.token.admin == true;
    }
  }
}
```

## Using the Hooks

### Authentication (useAuth)
```jsx
import { useAuth } from "./hooks/useAuth"

function Login() {
  const { login, error } = useAuth()
  
  const handleLogin = async () => {
    await login("email@example.com", "password")
  }
}
```

### Firestore Data (useFirestore)
```jsx
import { useFirestore } from "./hooks/useFirestore"

function Projects() {
  const { documents: projects, loading, add, remove } = useFirestore("projects")
  
  const handleAdd = async () => {
    await add({ name: "New Project", status: "active" })
  }
}
```

## Collection Structure

### users
- `name`: string
- `email`: string
- `role`: "admin" | "pm" | "member" | "viewer"
- `color`: string
- `photo`: string | null

### projects
- `name`: string
- `description`: string
- `leadId`: string (user id)
- `memberIds`: array of user ids
- `status`: "active" | "completed"

### tasks
- `title`: string
- `description`: string
- `projectId`: string
- `assignedTo`: string | null
- `status`: "not_started" | "in_progress" | "completed"
- `priority`: "low" | "medium" | "high"
- `deadline`: string
- `progressNote`: string
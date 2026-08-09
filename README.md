# 🚀 DevTrack

> A modern full-stack developer productivity platform designed to help developers manage projects, tasks, productivity and development activity in one centralized workspace.

---

# 📌 About The Project

**DevTrack** is a full-stack project management and productivity application created specifically for developers.

The platform provides a centralized workspace where developers can:

- Create and manage projects
- Create and manage tasks
- Track task progress
- Set priorities and deadlines
- Monitor development activity
- Manage developer profiles
- Configure application preferences
- Receive real-time application notifications
- Track productivity information

DevTrack is inspired by platforms such as **Trello**, **Jira**, **Notion**, and **GitHub Projects**, while focusing specifically on the workflow and needs of software developers.

The main goal of the project is to create a professional developer productivity platform while applying modern full-stack development practices.

---

# ✨ Features

## 🔐 Authentication

DevTrack includes a JWT-based authentication system.

Features:

- User registration
- User login
- Email validation
- Password hashing
- Password change
- JWT authentication
- Protected routes
- Session management
- Logout functionality

### Security

- Passwords are hashed using `bcrypt`
- Authentication uses JSON Web Tokens
- Protected API endpoints require authentication
- User-specific resources are isolated by authenticated user ID

---

# 📊 Dashboard

The dashboard provides an overview of the user's development workspace.

Features:

- Personalized welcome message
- Dynamic greeting based on the current time
- Current date display
- Project statistics
- Task statistics
- Recent projects
- Recent tasks
- Productivity information
- Development overview

The dashboard acts as the main workspace after authentication.

---

# 📁 Project Management

DevTrack provides complete project management functionality.

Features:

- Create projects
- View all user projects
- View individual projects
- Update projects
- Delete projects
- Project descriptions
- Project colors
- Project status
- Project priority
- Project creation timestamps
- Project update timestamps

### Project Status

Projects can be organized using statuses such as:

- Planning
- In Progress
- Completed

### Project Priority

Projects support priority levels such as:

- Low
- Medium
- High

---

# ✅ Task Management

DevTrack includes a complete task management system designed for software development workflows.

Features:

- Create tasks
- View tasks
- Update tasks
- Delete tasks
- Assign tasks to projects
- Task descriptions
- Task statuses
- Task priorities
- Task deadlines
- Task creation timestamps
- Task update timestamps

### Task Status

Tasks can be organized using workflow statuses such as:

- To Do
- In Progress
- Completed

### Task Priority

Tasks support priority levels such as:

- Low
- Medium
- High

Tasks are associated with projects, allowing development work to remain organized inside each project.

---

# 🔔 Notifications

DevTrack includes a notification system connected to both projects and tasks.

Notifications are generated automatically when important actions occur.

## Project Notifications

Supported events:

- Project Created
- Project Updated
- Project Deleted

## Task Notifications

Supported events:

- Task Created
- Task Updated
- Task Deleted

### Notification Features

- Unread notification counter
- Notification dropdown
- Mark individual notifications as read
- Mark all notifications as read
- Delete all notifications
- Notification timestamps
- Notification types
- Automatic Navbar updates

The frontend listens for notification update events and refreshes the notification list automatically after project or task operations.

This allows new notifications to appear without manually refreshing the page.

---

# 📝 Activity Tracking

DevTrack includes a separate activity tracking system.

Activities record important actions performed by the user.

Examples:

- Task Created
- Task Updated
- Task Deleted
- Project activity

Activities contain:

- Activity ID
- User ID
- Activity type
- Activity title
- Activity description
- Creation timestamp

Recent activities can be retrieved through the authenticated Activities API.

The activity system is intentionally separated from the notification system.

### Activities vs Notifications

**Activities** represent the user's development history.

**Notifications** represent events that require the user's attention.

This separation allows DevTrack to maintain a cleaner architecture and makes future activity tracking easier to expand.

---

# 📝 Notes

DevTrack is designed to support development notes and structured project information.

Potential use cases include:

- Project notes
- Development ideas
- Documentation
- Technical references
- Personal development information

The notes system can be expanded as the project continues to evolve.

---

# 👤 Profile

DevTrack includes a developer-focused profile system.

Profile information includes:

- Full name
- Username
- Email
- Developer role
- Country
- Country flag
- Avatar
- Skills
- Profile information
- Recent activity

### Profile Features

- View profile
- Edit profile
- Change avatar
- Update profile information
- View developer skills
- View project statistics
- View task statistics
- Access account actions

---

# 🧑‍💻 Skills

The profile includes a dedicated skills section for developer technologies.

Skills can represent technologies and tools used by the developer.

Examples:

- React
- TypeScript
- Node.js
- Express
- Git

The skills system is separated into its own component, making it easier to expand in the future.

---

# ⚙️ Settings

DevTrack provides a dedicated settings system for managing account and application preferences.

## Profile Settings

Users can view:

- Full name
- Username
- Email
- Developer role

---

## 🎨 Appearance

Users can switch between:

- Dark Mode
- Light Mode

The theme is managed through a React Context and can be changed directly from the Settings page or Navbar.

---

# 🔔 Notification Settings

Users can independently control which events generate notifications.

## Project Notifications

- Project Created
- Project Updated
- Project Deleted

## Task Notifications

- Task Created
- Task Updated
- Task Deleted

Each notification type can be enabled or disabled independently.

Notification preferences are stored in the database and respected by the backend before creating a notification.

---

# 🔑 Password Management

Users can change their account password directly from Settings.

The password change system includes:

- Current password verification
- New password validation
- Minimum password length validation
- Password confirmation
- Prevention of reusing the current password
- Secure password hashing
- Success and error feedback

---

# 🚪 Account Management

Users can safely log out from the application.

Logout clears the locally stored authentication information and redirects the user to the login page.

---

# 🎨 Interface

DevTrack uses a modern developer-focused interface.

Features:

- Dark mode
- Light mode
- Responsive design
- Sidebar navigation
- Top navigation bar
- Notification system
- Dashboard layout
- Reusable components
- Modal interfaces
- Interactive cards
- Form interfaces
- Developer-focused visual design

---

# 📱 Responsive Design

The application is designed to adapt to different screen sizes.

Supported layouts include:

- Desktop
- Laptop
- Tablet
- Mobile

Responsive CSS is implemented throughout the application.

---

# 🛠️ Tech Stack

## Frontend

### Core

- React
- TypeScript
- Vite

### Routing

- React Router DOM

### UI

- CSS
- React Icons
- Framer Motion

### Data Visualization

- Recharts

### Data Management

- TanStack Query

---

# 🖥️ Backend

### Core

- Node.js
- Express
- TypeScript

### Authentication

- JSON Web Tokens (JWT)
- bcrypt

### Database Communication

- `pg` (node-postgres)

### API

- REST API architecture

---

# 🗄️ Database

DevTrack uses:

- PostgreSQL

The backend communicates directly with PostgreSQL using the `pg` package.

The database stores information such as:

- Users
- Projects
- Tasks
- Notifications
- Activities
- User settings
- Skills
- Profile information

---

# 🔌 API

The backend exposes a REST API.

Main API areas include:

```text
/api/auth
/api/projects
/api/tasks
/api/skills
/api/profile
/api/notifications
/api/activities
/api/settings

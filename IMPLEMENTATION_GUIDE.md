# Wisdom - Educational Platform

A comprehensive React-based educational platform with course management, student enrollment, messaging, and reporting features.

## 🚀 Features Implemented

### Public Routes
- **Landing Page** (`/`) - Welcome screen with feature overview
- Role toggle between Admin and Student views (for testing)

### Admin Dashboard Routes
- **Dashboard** (`/dashboard`) - Admin overview with stats and activities
- **Course Management** (`/dashboard/courses`) - Create, edit, delete courses
- **Course Materials** (`/dashboard/courses/:id/materials`) - Manage course content
- **Student Management** (`/dashboard/students`) - Manage student accounts
- **Student Enrollments** (`/dashboard/students/enrollments`) - Track enrollments & progress
- **Blog Management** (`/dashboard/blog`) - Create and publish blog posts
- **Report Management** (`/dashboard/reports`) - Generate and download reports

### Student Routes
- **Student Dashboard** (`/student-dashboard`) - Personal course overview
- **Course List** (`/courses`) - Browse and enroll in courses
- **Course Page** (`/courses/:id`) - Detailed course view with lessons
- **Lesson Page** (`/lessons/:id`) - Watch lessons and participate in discussions
- **Blog** (`/blog`) - Read blog posts by category
- **Messages** (`/messages`) - Chat with instructors and peers
- **Notifications** (`/notifications`) - View all notifications

## 📁 Project Structure

```
src/
├── components/
│   ├── Common/
│   │   ├── Navbar.jsx      # Top navigation bar
│   │   └── Sidebar.jsx     # Side menu navigation
│   ├── Landing/
│   ├── Dashboard/
│   ├── Courses/
│   ├── Lessons/
│   ├── Blog/
│   ├── Students/
│   ├── Messages/
│   └── Reports/
├── pages/
│   ├── LandingPage.jsx
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── CourseManagement.jsx
│   ├── CourseMaterialManagement.jsx
│   ├── CourseList.jsx
│   ├── CoursePage.jsx
│   ├── LessonPage.jsx
│   ├── BlogManagement.jsx
│   ├── BlogStudent.jsx
│   ├── StudentManagement.jsx
│   ├── StudentEnrollments.jsx
│   ├── MessagePortal.jsx
│   ├── ReportManagement.jsx
│   └── Notification.jsx
├── hooks/       (for custom hooks)
├── context/     (for global state)
├── utils/       (for utilities)
├── styles/      (for global styles)
├── App.jsx      (Main router and layout)
└── main.jsx     (Entry point)
```

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **React Router v7** - Client-side routing
- **Tailwind CSS 4.1** - Utility-first CSS
- **Lucide React** - Icon library
- **Vite 7** - Build tool

## 📦 Dependencies

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.13.0",
  "lucide-react": "^latest",
  "tailwindcss": "^4.1.18"
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.19+ or 22.12+
- npm 10.7+

### Installation

```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173/`

## 🎨 Key UI Components

### Navbar
- Logo and menu toggle
- User profile dropdown
- Notifications badge
- Role toggle (Admin/Student)

### Sidebar
- Collapsible navigation menu
- Dynamic menu based on user role
- Active route highlighting
- Submenu support

### Common Patterns
- **Tables** - Course list, student list, enrollments with sorting/filtering
- **Cards** - Course cards with progress tracking
- **Forms** - Input fields with validation
- **Modals** - Dialog components for actions
- **Status badges** - Color-coded status indicators
- **Progress bars** - Visual progress tracking

## 🔄 Routing Architecture

```
/                          (Landing Page)
├── /dashboard            (Admin)
│   ├── /courses
│   ├── /courses/:id/materials
│   ├── /students
│   ├── /students/enrollments
│   ├── /blog
│   └── /reports
│
└── /student-dashboard    (Student)
    ├── /courses
    ├── /courses/:id
    ├── /lessons/:id
    ├── /blog
    ├── /messages
    └── /notifications
```

## 💡 Features to Add Next

1. **Authentication** - Login/Register pages and protected routes
2. **API Integration** - Connect to backend services
3. **State Management** - Redux or Context API for global state
4. **Search & Filter** - Enhanced search capabilities
5. **Responsive Design** - Mobile optimization
6. **Dark Mode** - Theme switcher
7. **Notifications** - Real-time notifications system
8. **Video Player** - Embedded video player for lessons
9. **Quiz System** - Interactive quizzes
10. **Certificate Generation** - Course completion certificates

## 📝 Notes

- The app includes a role toggle in the Navbar for testing between Admin and Student views
- All components are built with Tailwind CSS for consistent styling
- Sidebar automatically hides for student view on non-dashboard routes
- Icons from Lucide React provide a professional look
- The structure is scalable and ready for backend integration

## 🎯 Next Steps

1. Set up authentication with protected routes
2. Create API service layer for backend communication
3. Implement global state management (Context/Redux)
4. Add form validation and error handling
5. Optimize images and assets
6. Add unit and integration tests
7. Set up CI/CD pipeline
8. Deploy to cloud platform (Azure, Vercel, etc.)

---

**Built with ❤️ for learning and education**

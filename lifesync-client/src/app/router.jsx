import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";

// auth pages
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// guards & layouts
import ProtectedRoute from "./guards/ProtectedRoutes";
import AppLayout from "../components/layouts/AppLayout";
import SpaceLayout from "../components/layouts/SpaceLayout";

// space pages
import SpacesDashboard from "../pages/spaces/SpaceDashboard";
import SpaceHome from "../pages/spaces/SpaceHome";

// future pages
import TasksPage from "../pages/tasks/TaskPage";
import ActivityPage from "../pages/activity/ActivityPage";
import AppShell from "./AppShell";
import Members from "../pages/spaces/Member";

const router = createBrowserRouter([
  // ---------- AUTH ----------
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  // ---------- APP (PROTECTED) ----------
  {
    path: "/app",
    element: (
      <AppShell>
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      </AppShell>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/app/spaces" replace />,
      },
      {
        path: "spaces",
        element: <SpacesDashboard />,
      },
      {
        path: "spaces/:spaceId",
        element: <SpaceLayout />,
        children: [
          { index: true, element: <SpaceHome /> },
          { path: "tasks", element: <TasksPage /> },
          { path: "activity", element: <ActivityPage /> },
          { path: "members", element: <Members /> },
        ],
      },
    ],
  },
]);

export default router;

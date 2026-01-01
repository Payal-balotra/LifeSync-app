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
import AcceptInvitePage from "../components/spaces/AcceptInvitePage";

// future pages
import TasksPage from "../pages/tasks/TaskPage";


const router = createBrowserRouter([
  // ---------- AUTH ----------
  { path: "/", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  { path: "/forgot-password", element: <ForgotPassword /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },

  { path: "/accept-invite/:token", element: <ProtectedRoute><AcceptInvitePage /></ProtectedRoute> },


  // ---------- APP (PROTECTED) ----------
  {
    path: "/app",
    element: (
    
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
     
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
          { index: true, element: <SpaceHome  /> },
          { path: "tasks", element: <TasksPage /> },

        ],
      },
    ],
  },
]);

export default router;

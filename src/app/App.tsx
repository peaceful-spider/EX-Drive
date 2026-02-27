import React from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider, useLocation } from 'react-router';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DashboardProvider } from './context/DashboardContext';
import { BottomNav } from './components/BottomNav';
import { Toaster } from 'sonner';
import { cn } from '../lib/utils';

// Page Imports
import Dashboard from "./routes/Dashboard";
import Auth from "./routes/Auth";
import Onboarding from "./routes/Onboarding";
import Plans from "./routes/Plans";
import Settings from "./routes/Settings";
import Profile from "./routes/Profile";
import Landing from "./routes/Landing";

// Layout for Mobile App feel
const AppLayout = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const hideNavPaths = ['/auth', '/onboarding', '/', '/landing'];
  const shouldHideNav = hideNavPaths.includes(location.pathname);

  return (
    <DashboardProvider>
      <div className="min-h-screen flex flex-col">
        <div className={cn("flex-1 overflow-auto", !shouldHideNav && "pb-20 md:pb-0")}>
          <Outlet />
        </div>
        {isAuthenticated && !shouldHideNav && <BottomNav />}
      </div>
    </DashboardProvider>
  );
};

// Route Guards
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Allow access to landing page even if authenticated, but redirect from /auth
  if (isAuthenticated && location.pathname === '/auth') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Router
const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, 
    children: [
      {
        index: true,
        element: <PublicRoute><Landing /></PublicRoute>
      },
      {
        path: "auth",
        element: <PublicRoute><Auth /></PublicRoute>
      },
      {
        path: "dashboard",
        element: <PrivateRoute><Dashboard /></PrivateRoute>
      },
      {
        path: "onboarding",
        element: <PrivateRoute><Onboarding /></PrivateRoute>
      },
      {
        path: "plans",
        element: <PrivateRoute><Plans /></PrivateRoute>
      },
      {
        path: "settings",
        element: <PrivateRoute><Settings /></PrivateRoute>
      },
      {
        path: "profile",
        element: <PrivateRoute><Profile /></PrivateRoute>
      }
    ]
  }
]);

export default function App() {
  React.useEffect(() => {
    // Inject Mobile App Meta Tags
    const metaTags = [
      { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { name: 'mobile-web-app-capable', content: 'yes' },
      { name: 'theme-color', content: '#4f46e5' }
    ];

    metaTags.forEach(tag => {
      let element = document.querySelector(`meta[name="${tag.name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute('name', tag.name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', tag.content);
    });

    document.body.style.overscrollBehaviorY = 'none';
  }, []);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
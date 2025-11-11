import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import React from 'react'; // Explicitly import React
import { AuthProvider, useAuth } from './context/AuthContext'; // Import Auth Context

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import Drivers from "./pages/Drivers";
import Tracking from "./pages/Tracking";
import Fuel from "./pages/Fuel";
import Maintenance from "./pages/Maintenance";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login"; // Import the Login page

const queryClient = new QueryClient();

// 1. Component to protect routes. If not logged in, redirects to /login.
const ProtectedRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    // Show a minimal loader while authentication state is being determined
    return <div className="min-h-screen flex items-center justify-center text-gray-700">Checking Authentication...</div>;
  }

  // If the user is not logged in, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If logged in, render the intended element.
  return element as React.ReactElement; 
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {/* 2. Wrap the entire routing structure in the AuthProvider */}
      <AuthProvider> 
        <BrowserRouter>
          <Routes>
            
            {/* PUBLIC ROUTE: Login */}
            <Route path="/login" element={<Login />} />
            
            {/* PROTECTED NESTED ROUTES: All routes inside Index (the layout) are protected */}
            <Route path="/" element={<ProtectedRoute element={<Index />} />}>
              <Route index element={<Dashboard />} />
              <Route path="vehicles" element={<Vehicles />} />
              <Route path="drivers" element={<Drivers />} />
              <Route path="tracking" element={<Tracking />} />
              <Route path="fuel" element={<Fuel />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="reports" element={<Reports />} />
            </Route>
            
            {/* CATCH-ALL ROUTES: Only redirect to NotFound if the path wasn't covered above */}
            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
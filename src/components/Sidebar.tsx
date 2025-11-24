import { LayoutDashboard, Users, MapPin, Fuel, Wrench, FileText, LogOut, Truck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", to: "/", icon: LayoutDashboard },
  { name: "Vehicles", to: "/vehicles", icon: Truck },
  { name: "Drivers", to: "/drivers", icon: Users },
  { name: "GPS Tracking", to: "/tracking", icon: MapPin },
  { name: "Fuel Management", to: "/fuel", icon: Fuel },
  { name: "Maintenance", to: "/maintenance", icon: Wrench },
  { name: "Reports", to: "/reports", icon: FileText },
];

interface SidebarProps {
  onLogout: () => void;
  userName: string;
  userEmail: string;
}

export function Sidebar({ onLogout, userName, userEmail }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 flex flex-col bg-sidebar border-r border-sidebar-border">
      
      {/* LOGO */}
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <img src="/logo.svg" alt="FleetPro Logo" className="h-8 w-8" />
        <span className="ml-3 text-xl font-bold text-sidebar-foreground">FleetPro</span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )
            }
          >
            <item.icon className="h-5 w-5 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* USER + LOGOUT */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">{userName}</p>
            <p className="text-xs text-sidebar-foreground/60">{userEmail}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors text-red-500 bg-red-500/10 hover:bg-red-500/20"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

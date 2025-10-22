import { LayoutDashboard, Truck, Users, MapPin, Fuel, Wrench, FileText } from "lucide-react";
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

export function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 items-center px-6 border-b border-sidebar-border">
        <Truck className="h-8 w-8 text-sidebar-primary" />
        <span className="ml-3 text-xl font-bold text-sidebar-foreground">FleetPro</span>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
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

      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <Users className="h-5 w-5 text-sidebar-primary" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-sidebar-foreground">Admin User</p>
            <p className="text-xs text-sidebar-foreground/60">admin@fleetpro.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

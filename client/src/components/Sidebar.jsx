import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      roles: ["CEO", "Manager", "Dispatcher", "Safety Officer", "Finance"],
    },
    {
      path: "/notifications",
      label: "Approvals & Requests",
      roles: ["CEO", "Manager"],
    },
    {
      path: "/users",
      label: "User Directory",
      roles: ["CEO", "Manager"],
    },
    {
      path: "/vehicles",
      label: "Fleet Registry",
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/dispatch",
      label: "Trip Dispatch",
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/maintenance",
      label: "Maintenance Logs",
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/drivers",
      label: "Driver Staff",
      roles: ["CEO", "Manager", "Safety Officer"],
    },
    {
      path: "/finance",
      label: "Fuel & Expenses",
      roles: ["CEO", "Manager", "Finance"],
    },
    {
      path: "/analytics",
      label: "Analytics & ROI",
      roles: ["CEO", "Manager", "Finance"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <aside className="w-64 h-screen glass-card rounded-none border-y-0 border-l-0 hidden md:flex flex-col sticky top-0">
      <div className="p-6 border-b border-white/10">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-brand-indigo to-brand-emerald">
          FleetFlow
        </h2>
        <div className="mt-2 status-pill status-available inline-block">
          {user?.role}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {filteredMenu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-brand-indigo/20 text-brand-indigo font-medium" : "text-slate-400 hover:bg-white/5 hover:text-slate-200"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-slate-400 hover:text-brand-rose hover:bg-brand-rose/10 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

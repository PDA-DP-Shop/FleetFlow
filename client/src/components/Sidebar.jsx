import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { 
  BarChart3, 
  Truck, 
  Users, 
  Bell, 
  ClipboardList, 
  FileText, 
  Wallet, 
  LayoutDashboard,
  LogOut,
  UserCheck
} from "lucide-react";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      path: "/",
      label: "Dashboard",
      icon: LayoutDashboard,
      roles: ["CEO", "Manager", "Dispatcher", "Safety Officer", "Finance"],
    },
    {
      path: "/notifications",
      label: "Approvals",
      icon: Bell,
      roles: ["CEO", "Manager"],
    },
    {
      path: "/users",
      label: "User Directory",
      icon: Users,
      roles: ["CEO", "Manager"],
    },
    {
      path: "/drivers",
      label: "Driver Staff",
      icon: UserCheck,
      roles: ["CEO", "Manager", "Safety Officer"],
    },
    {
      path: "/vehicles",
      label: "Vehicles Registry",
      icon: Truck,
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/dispatch",
      label: "Trip Dispatch",
      icon: ClipboardList,
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/maintenance",
      label: "Maintenance",
      icon: FileText,
      roles: ["CEO", "Manager", "Dispatcher"],
    },
    {
      path: "/finance",
      label: "Finance & Fuel",
      icon: Wallet,
      roles: ["CEO", "Manager", "Finance"],
    },
    {
      path: "/analytics",
      label: "Analytics & ROI",
      icon: BarChart3,
      roles: ["CEO", "Manager", "Finance"],
    },
  ];

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role),
  );

  return (
    <aside className="w-72 h-screen glass-card rounded-none border-y-0 border-l-0 hidden lg:flex flex-col sticky top-0 z-50">
      <div className="p-8">
        <div className="flex items-center gap-3 group px-2">
          <div className="w-10 h-10 bg-linear-to-br from-brand-indigo to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-indigo/20 group-hover:scale-110 transition-transform duration-300">
            <Truck className="text-white w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white italic">
            FLEET<span className="text-brand-indigo">FLOW</span>
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-2 custom-scrollbar">
        <nav className="space-y-1.5 px-4">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
            Main Menu
          </p>
          {filteredMenu.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                    isActive 
                      ? "bg-brand-indigo/10 text-brand-indigo font-bold shadow-sm" 
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm tracking-wide">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5 bg-white/[0.01]">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-brand-indigo font-bold">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-bold text-brand-indigo uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-brand-rose hover:bg-brand-rose/10 rounded-xl transition-all duration-300 font-medium text-sm group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

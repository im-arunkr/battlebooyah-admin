"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Trophy, 
  Swords, 
  ListChecks, 
  Wallet, 
  Users, 
  Settings,
  LogOut 
} from "lucide-react";
import { cn } from "../../lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  // Sabhi links ke aage /dashboard/ hona zaroori hai App Router routing ke liye
  const menuItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tournaments", href: "/dashboard/tournaments", icon: Trophy },
    { name: "Matches", href: "/dashboard/matches", icon: Swords },
    { name: "Results", href: "/dashboard/results", icon: ListChecks },
    { name: "Wallet", href: "/dashboard/wallet", icon: Wallet },
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    window.location.href = "/login";
  };

  return (
    <div className="w-64 bg-slate-950 text-white h-screen p-5 fixed left-0 top-0 flex flex-col">
      <div className="mb-10 px-2">
        <h2 className="text-2xl font-black tracking-tighter text-blue-500">
          BATTLE BOOYAH
        </h2>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
          Admin Panel v1.0
        </p>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 font-medium",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button at Bottom */}
      <button 
        onClick={handleLogout}
        className="flex items-center gap-3 px-3 py-2.5 text-red-400 hover:bg-red-950/20 rounded-lg transition-colors mt-auto"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
}
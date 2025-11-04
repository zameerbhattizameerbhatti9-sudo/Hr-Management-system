"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  FileText,
  Settings,
  BarChart as ChartBar,
  GraduationCap,
  DollarSign,
  FileBox,
} from "lucide-react";

const adminRoutes = [
  {
    href: "/Dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/employees",
    label: "Employees",
    icon: Users,
  },
  {
    href: "/attendance",
    label: "Attendance",
    icon: CalendarDays,
  },
  {
    href: "/leaves",
    label: "Leave Requests",
    icon: FileText,
  },
  {
    href: "/performance",
    label: "Performance",
    icon: ChartBar,
  },
  {
    href: "/training",
    label: "Training",
    icon: GraduationCap,
  },
  {
    href: "/salary",
    label: "Salary",
    icon: DollarSign,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: FileBox,
  },
  {
    href: "/settings",
    label: "Settings",
    icon: Settings,
  },
];

const employeeRoutes = [
  {
    href: "/Dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/attendance",
    label: "Attendance",
    icon: CalendarDays,
  },
  {
    href: "/leaves",
    label: "Leave Requests",
    icon: FileText,
  },
  {
    href: "/performance",
    label: "Performance",
    icon: ChartBar,
  },
  {
    href: "/training",
    label: "Training",
    icon: GraduationCap,
  },
  {
    href: "/salary",
    label: "Salary",
    icon: DollarSign,
  },
  {
    href: "/documents",
    label: "Documents",
    icon: FileBox,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const routes = user?.role === "admin" ? adminRoutes : employeeRoutes;

  return (
    <div className="relative flex h-full flex-col gap-6 px-3 py-6">
      <div className="px-3">
        <h2 className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
          HR Management
        </h2>
        <p className="text-sm text-slate-400">
          {user?.role === "admin" ? "Admin Panel" : "Employee Portal"}
        </p>
      </div>
      <div className="flex-1 space-y-1 px-1">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.href;
          return (
            <Button
              key={route.href}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-3 py-6 text-base transition-all hover:scale-[1.02]",
                {
                  "border border-slate-800 bg-gradient-to-r from-slate-800 to-slate-800/50 font-medium text-white": isActive,
                  "text-slate-400 hover:bg-slate-800/50 hover:text-white": !isActive,
                }
              )}
              asChild
            >
              <Link href={route.href}>
                <Icon className={cn("h-5 w-5 shrink-0", {
                  "text-indigo-400": isActive,
                })} />
                {route.label}
              </Link>
            </Button>
          );
        })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
    </div>
  );
}

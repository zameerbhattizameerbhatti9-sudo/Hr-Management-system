"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="sticky top-0 z-10 border-b border-slate-800 bg-slate-900/95 backdrop-blur supports-[backdrop-filter]:bg-slate-900/60">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="md:hidden">
          {/* Mobile menu button would go here */}
        </div>
        <div className="ml-auto flex items-center gap-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 w-10 rounded-full border border-slate-800 bg-slate-900 hover:bg-slate-800"
                >
                  <Avatar className="h-9 w-9 transition-transform hover:scale-105">
                    <AvatarFallback className="border border-slate-700 bg-gradient-to-br from-indigo-600 to-purple-600 text-sm font-medium text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-56 border border-slate-800 bg-slate-900 text-slate-300" 
                align="end" 
                forceMount
              >
                <DropdownMenuItem className="flex-col items-start space-y-1 px-4 py-3 focus:bg-slate-800">
                  <div className="text-sm font-medium text-slate-200">{user.name}</div>
                  <div className="text-xs text-slate-400 capitalize">
                    {user.role}
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="focus:bg-slate-800 text-red-400 focus:text-red-400"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

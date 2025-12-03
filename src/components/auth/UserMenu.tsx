"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogOut, User, Settings, LayoutDashboard } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown, DropdownItem, DropdownDivider } from "@/components/ui/Dropdown";

export function UserMenu() {
  const { data: session } = useSession();

  if (!session?.user) {
    return null;
  }

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-50 transition-colors">
          <Avatar
            src={session.user.image}
            alt={session.user.name || session.user.username}
            size="sm"
          />
        </button>
      }
    >
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-medium text-slate-900">
          {session.user.name || session.user.username}
        </p>
        <p className="text-xs text-slate-500">@{session.user.username}</p>
      </div>
      <Link href="/dashboard">
        <DropdownItem>
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </DropdownItem>
      </Link>
      <Link href={`/profile/${session.user.username}`}>
        <DropdownItem>
          <User className="w-4 h-4" />
          Profile
        </DropdownItem>
      </Link>
      <Link href="/dashboard/settings">
        <DropdownItem>
          <Settings className="w-4 h-4" />
          Settings
        </DropdownItem>
      </Link>
      <DropdownDivider />
      <DropdownItem danger onClick={() => signOut()}>
        <LogOut className="w-4 h-4" />
        Sign out
      </DropdownItem>
    </Dropdown>
  );
}


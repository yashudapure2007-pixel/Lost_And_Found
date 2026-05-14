"use client";

import { signOut } from "@/actions/auth";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <DropdownMenuItem
      onClick={() => signOut()}
      className="text-destructive focus:text-destructive cursor-pointer"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </DropdownMenuItem>
  );
}

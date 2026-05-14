"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toggleAdminRole, toggleUserSuspension } from "@/actions/admin";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, ShieldAlert, ShieldCheck, MoreVertical, Ban, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface UserActionsProps {
  user: {
    id: string;
    email: string;
    role: string;
    status: string;
  };
  currentAdminRole: string;
}

export function UserActions({ user, currentAdminRole }: UserActionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleRoleToggle = () => {
    if (user.email === "devakadu2007@gmail.com") {
      toast.error("Cannot modify the Super Admin.");
      return;
    }
    
    const makeAdmin = user.role !== "ADMIN";
    startTransition(async () => {
      const res = await toggleAdminRole(user.id, makeAdmin);
      if (res.error) toast.error(res.error);
      else toast.success(`User role updated to ${makeAdmin ? "ADMIN" : "STUDENT"}`);
    });
  };

  const handleSuspendToggle = () => {
    if (user.email === "devakadu2007@gmail.com") {
      toast.error("Cannot suspend the Super Admin.");
      return;
    }

    const suspend = user.status !== "SUSPENDED";
    startTransition(async () => {
      const res = await toggleUserSuspension(user.id, suspend);
      if (res.error) toast.error(res.error);
      else toast.success(`User has been ${suspend ? "suspended" : "unsuspended"}`);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={isPending || user.email === "devakadu2007@gmail.com"}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-8 w-8"
      >
        <MoreVertical className="h-4 w-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currentAdminRole === "SUPER_ADMIN" && (
          <DropdownMenuItem onClick={handleRoleToggle}>
            {user.role === "ADMIN" ? (
              <><Shield className="mr-2 h-4 w-4" /> Revoke Admin</>
            ) : (
              <><ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" /> Make Admin</>
            )}
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem 
          onClick={handleSuspendToggle}
          className={user.status === "SUSPENDED" ? "text-emerald-500" : "text-destructive focus:text-destructive"}
        >
          {user.status === "SUSPENDED" ? (
            <><CheckCircle className="mr-2 h-4 w-4" /> Unsuspend User</>
          ) : (
            <><Ban className="mr-2 h-4 w-4" /> Suspend User</>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

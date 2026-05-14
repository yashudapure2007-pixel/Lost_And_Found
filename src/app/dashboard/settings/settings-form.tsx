"use client";

import { useState, useTransition } from "react";
import { updateUserProfile, deleteAccount } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Trash2, Save } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface SettingsFormProps {
  user: {
    id: string;
    phone: string | null;
    hostel: string | null;
    department: string | null;
    role: string;
  };
}

export function SettingsForm({ user }: SettingsFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateUserProfile(formData);
      if (res.error) toast.error(res.error);
      else toast.success("Profile updated successfully");
    });
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you absolutely sure you want to delete your account? This will permanently delete all your items, claims, and messages. This action cannot be undone."
    );
    
    if (!confirmed) return;
    
    setIsDeleting(true);
    const res = await deleteAccount();
    
    if (res.error) {
      toast.error(res.error);
      setIsDeleting(false);
    } else {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="break-words">
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your contact details and academic information.
          </CardDescription>
        </CardHeader>
        <form key={`${user.phone}-${user.hostel}-${user.department}`} onSubmit={handleSubmit}>
          <CardContent className="space-y-4 break-words min-w-0">
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={user.phone || ""}
                placeholder="+91 9876543210"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hostel">Hostel / Room No.</Label>
              <Input
                id="hostel"
                name="hostel"
                defaultValue={user.hostel || ""}
                placeholder="E.g. Block A, Room 204"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                defaultValue={user.department || ""}
                placeholder="E.g. Computer Science"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isDeleting || user.role === "SUPER_ADMIN"}
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
          {user.role === "SUPER_ADMIN" && (
            <p className="text-xs text-destructive mt-2">
              Super Admin account cannot be deleted.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

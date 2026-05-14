import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAdminUsers, requireAdmin } from "@/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Users, ShieldAlert } from "lucide-react";
import { UserActions } from "./user-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function AdminUsersPage() {
  const currentAdmin = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                User Management
              </h1>
              <p className="text-muted-foreground mt-1">
                View platform users, assign roles, and manage suspensions.
              </p>
            </div>
          </div>

          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground text-xs uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Items</th>
                    <th className="px-6 py-3">Claims</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((u) => (
                    <tr key={u.id} className={u.status === "SUSPENDED" ? "bg-destructive/5" : "hover:bg-muted/50 transition-colors"}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{u.name}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === "SUPER_ADMIN" ? (
                          <Badge className="bg-amber-500 hover:bg-amber-600">Super Admin</Badge>
                        ) : u.role === "ADMIN" ? (
                          <Badge variant="default">Admin</Badge>
                        ) : (
                          <Badge variant="secondary">Student</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.status === "SUSPENDED" ? (
                          <Badge variant="destructive" className="flex w-fit items-center gap-1">
                            <ShieldAlert className="h-3 w-3" /> Suspended
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">
                            Active
                          </Badge>
                        )}
                      </td>
                      <td className="px-6 py-4">{u._count.items}</td>
                      <td className="px-6 py-4">{u._count.claims}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <UserActions user={u} currentAdminRole={currentAdmin.role} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

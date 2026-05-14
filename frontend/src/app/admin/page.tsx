import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { getAdminStats, getAdminItems } from "@/actions/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Package, CheckCircle, AlertTriangle } from "lucide-react";
import { AdminItemActions } from "./admin-item-actions";

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  const { items } = await getAdminItems(1);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Platform overview and moderation tools.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeItems} active
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.resolutionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {stats.returnedItems} items returned
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalClaims}</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Items List */}
          <h2 className="text-xl font-bold tracking-tight mb-4">Recent Items</h2>
          <div className="bg-background rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted text-muted-foreground text-xs uppercase border-b">
                  <tr>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Title / User</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map((item) => (
                    <tr key={item.id} className={item.deletedAt ? "opacity-50 bg-muted/50" : "hover:bg-muted/50 transition-colors"}>
                      <td className="px-6 py-4">
                        <Badge variant={item.type === "LOST" ? "destructive" : "default"}>
                          {item.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-foreground">{item.title}</div>
                        <div className="text-muted-foreground text-xs mt-0.5">{item.user.email}</div>
                      </td>
                      <td className="px-6 py-4">{item.category.name}</td>
                      <td className="px-6 py-4">
                        <Badge variant="outline">{item.status}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {!item.deletedAt && (
                          <AdminItemActions itemId={item.id} />
                        )}
                        {item.deletedAt && (
                          <Badge variant="secondary">Deleted</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                        No items found
                      </td>
                    </tr>
                  )}
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

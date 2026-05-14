import { AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/actions/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="max-w-md w-full border-destructive/20 shadow-lg shadow-destructive/5">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto bg-destructive/10 w-16 h-16 flex items-center justify-center rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Account Suspended</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            Your account has been temporarily suspended by an administrator due to a violation of our community guidelines.
          </p>
          <div className="bg-muted p-4 rounded-lg text-sm text-left">
            <p className="font-medium text-foreground mb-1">What does this mean?</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>You cannot report new items.</li>
              <li>You cannot claim found items.</li>
              <li>You cannot send messages.</li>
            </ul>
          </div>
          <p className="text-sm text-muted-foreground">
            If you believe this is a mistake, please contact campus administration.
          </p>
          <div className="pt-4 flex justify-center border-t">
            <form action={signOut}>
              <Button variant="outline">
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Home() {
  const router = useRouter();
  const userName = "Asit" // replace with real user data
  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/signin");
    }
  }, []);


  // LOGOUT
  const handleLogout = async () => {
    await signOut(auth); // Firebase logout
    localStorage.removeItem("user"); // Clear localStorage
    router.push("/signin"); // Redirect
  };

  return (
    <>
      <div className="min-h-screen p-6 width__098_ground">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Welcome back, {userName} 👋
          </h1>
          <p className="mt-1 text-muted-foreground">
            Here’s what’s happening with your account today
          </p>
        </div>

        {/* User Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Status</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              Complete ✅
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Last Login</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              Today
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              12
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Plan</CardTitle>
            </CardHeader>
            <CardContent className="text-xl font-semibold">
              Free
            </CardContent>
          </Card>
        </div>

        {/* Actions + Activity */}
        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>🎉 Account created successfully</p>
              <p>🔐 Logged in</p>
              <p>🛒 Viewed products</p>
              <p>⚙️ Updated profile</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full">Update Profile</Button>
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
              <Button variant="secondary" className="w-full" onClick={handleLogout}>
                LOGOUT
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

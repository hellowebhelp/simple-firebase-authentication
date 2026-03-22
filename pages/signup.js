import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation";


import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";
// 🔑 IMPORT THESE FOR Firestore
import { doc, setDoc } from "firebase/firestore";

export default function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    try {
      setLoading(true);

      // Auth save data : createUserWithEmailAndPassword
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      // Get UID
      const uid = userCred.user.uid;

      // 🔥 Save extra data in Firestore
      await setDoc(doc(db, "users", uid), {
        fullName: form.fullname,
        age: "26",
        class: "BBA",
        email: "ashitmondal66@gmail.com",
        role: "user",
        createdAt: new Date(),
      });

      // ✅ Save Full Name Here
      await updateProfile(userCred.user, {
        displayName: form.fullname,
      });

      router.push("/signin"); // Redirect
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center justify-center min-h-screen px-4 bg-muted">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Fill in the details to register. and if you have not register then you can <Link href="/signin" className="link__9djmf"> Login </Link>
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              name="fullname"
              placeholder="Full Name"
              value={form.fullname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identifier">Email or Username</Label>
            <Input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </CardContent>

        <CardFooter>
          <Button disabled={loading} className="w-full">
            {loading ? "Creating..." : "Register"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
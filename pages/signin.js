"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { auth } from "../lib/firebase";
import { db } from "../lib/firebase";

import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function LoginForm() {

    const router = useRouter();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setLoading(true);

            let email = identifier;

            // ✅ If user enters username instead of email
            if (!identifier.includes("@")) {
                const q = query(
                    collection(db, "auth"),
                    where("username", "==", identifier)
                );

                const snapshot = await getDocs(q);

                if (snapshot.empty) {
                    alert("User not found");
                    setLoading(false);
                    return;
                }

                email = snapshot.docs[0].data().email;
            }

            // ✅ Login with email
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            console.log("Logged in user:", user);

            // 🔥 Save user basic info to localStorage
            localStorage.setItem("user", JSON.stringify({
                uid: user.uid,
                email: user.email,
            }));
            
            // 🔥 Redirect after login
            router.push("http://localhost:3000/");

        } catch (error) {
            console.log(error);
            alert("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen px-4 bg-muted">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email or username and password and if you have not register then you can{" "}
                        <Link href="/signup" className="text-blue-500 underline">
                            Register
                        </Link>
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="identifier">Email or Username</Label>
                        <Input
                            id="identifier"
                            type="text"
                            placeholder="you@example.com or username"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </CardContent>

                <CardFooter>
                    <Button
                        className="w-full"
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
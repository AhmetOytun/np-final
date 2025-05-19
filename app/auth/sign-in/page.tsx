"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch("/api/users/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (res.status === 200) {
        const { token, user } = await res.json();
        useAuthStore.getState().login(user, token);
        router.push("/library");
      } else if (res.status === 401) {
        alert("Invalid email or password.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert(
        "Failed to connect to the server. Please check your internet connection."
      );
      console.error("Sign-in error:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-green-600 to-blue-600 items-center justify-center px-4 text-white">
      <ArrowLeft
        className="absolute top-8 left-8 text-white cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
        size={36}
      />
      <div className="bg-white text-gray-800 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-blue-600">
          Welcome Back
        </h2>
        <form className="space-y-4" onSubmit={handleSignIn}>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl shadow-md hover:bg-green-700 transition hover:cursor-pointer"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <button
            className="text-blue-600 hover:underline hover:cursor-pointer"
            onClick={() => {
              router.push("/auth/sign-up");
            }}
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

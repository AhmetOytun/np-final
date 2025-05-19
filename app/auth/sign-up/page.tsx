"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/users/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (res.status === 201) {
        router.push("/auth/sign-in");
      } else {
        const data = await res.json();
        alert(data?.message || "Sign up failed. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
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
          Welcome!
        </h2>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="block mb-1 text-sm font-medium">Username</label>
            <input
              type="text"
              placeholder="Joe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
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
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

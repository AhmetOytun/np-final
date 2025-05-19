"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    router.push("/library");
    return null;
  } else {
    return (
      <div className="flex min-h-screen from-green-600 to-blue-600 bg-gradient-to-b text-white">
        <div className="flex flex-col items-center justify-center w-full px-4 py-10 max-w-xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold drop-shadow-md mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500">
            Musify
          </h1>
          <p className="text-lg sm:text-2xl font-light mb-8 drop-shadow-sm">
            The best way to rate your music online!
          </p>
          <div className="flex flex-col space-y-4 w-full max-w-xs">
            <button
              className="w-full py-3 bg-white text-green-700 font-semibold rounded-xl shadow-md hover:bg-green-100 transition hover:cursor-pointer"
              onClick={() => {
                router.push("/auth/sign-in");
              }}
            >
              Sign In
            </button>
            <button
              className="w-full py-3 bg-white text-blue-700 font-semibold rounded-xl shadow-md hover:bg-blue-100 transition  hover:cursor-pointer"
              onClick={() => {
                router.push("/auth/sign-up");
              }}
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    );
  }
}

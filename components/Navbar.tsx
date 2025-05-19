import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <nav className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-4 shadow-md flex justify-between items-center">
      <h1
        className="text-lg sm:text-2xl font-bold hover:cursor-pointer"
        onClick={() => {
          router.push("/library");
        }}
      >
        Musify
      </h1>
      <ul className="flex space-x-6 text-sm sm:text-base">
        <li
          className="text-xs sm:text-base hover:underline cursor-pointer"
          onClick={() => router.push("/profile")}
        >
          Signed in as: {user?.username}
        </li>
        <li
          className="hover:underline cursor-pointer text-red-400 hover:text-red-600 text-xs sm:text-base"
          onClick={() => {
            useAuthStore.getState().logout();
            router.push("/");
          }}
        >
          Sign Out
        </li>
      </ul>
    </nav>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  email: string;
  createdAt: string;
  password: string;
  username: string;
  reviews: {
    albumId: number;
    content: string;
    createdAt: string;
    id: number;
    rating: number;
    title: string;
    userId: number;
    album: {
      artist: string;
      description: string;
      id: number;
      imageUrl: string;
      rating: number;
      title: string;
    };
  }[];
}

export default function Profile() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const logout = useAuthStore((state) => state.logout);
  const [user, setUser] = useState<User | null>(null);
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  // New states for editing user profile
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedUsername, setEditedUsername] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedPassword, setEditedPassword] = useState(""); // optional password update

  const fetchUser = async () => {
    const res = await fetch("/api/users", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch user");
    }

    const data = await res.json();
    setUser(data);
    // Set initial profile edit form values
    setEditedUsername(data.username);
    setEditedEmail(data.email);
  };

  useEffect(() => {
    if (!token) return;
    const fetchUser = async () => {
      const res = await fetch("/api/users", {
        method: "POST",
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }

      const data = await res.json();
      setUser(data);
      // Set initial profile edit form values
      setEditedUsername(data.username);
      setEditedEmail(data.email);
    };
    fetchUser();
  }, [token]);

  const handleDeleteReview = async (reviewId: number) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      fetchUser();
    }
  };

  const handleEditReview = (
    reviewId: number,
    title: string,
    content: string
  ) => {
    setEditingReviewId(reviewId);
    setEditedTitle(title);
    setEditedContent(content);
  };

  const handleSaveReview = async (reviewId: number) => {
    const res = await fetch(`/api/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: editedTitle,
        content: editedContent,
      }),
    });

    if (res.ok) {
      setEditingReviewId(null);
      fetchUser();
    }
  };

  // New handlers for user profile edit & delete
  const handleSaveProfile = async () => {
    if (!user) return;

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        id: user.id,
        username: editedUsername,
        email: editedEmail,
        password: editedPassword ? editedPassword : undefined,
      }),
    });

    if (res.ok) {
      setIsEditingProfile(false);
      setEditedPassword("");
      fetchUser();
    } else {
      alert("Failed to update profile");
    }
  };

  const handleDeleteUser = async () => {
    if (!user) return;

    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;

    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: user.id }),
    });

    if (res.ok) {
      // logout or redirect to homepage or login page after deletion
      alert("User account deleted");
      logout();
      router.push("/auth/sign-in");
      // clear token or redirect logic here
    } else {
      alert("Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-50 text-gray-800 pb-10">
      <Navbar />
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
        {/* Header & Profile */}
        <div className="mb-10">
          {isEditingProfile ? (
            <div className="space-y-3 max-w-md">
              <input
                className="border rounded w-full p-2"
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                placeholder="Username"
              />
              <input
                className="border rounded w-full p-2"
                value={editedEmail}
                onChange={(e) => setEditedEmail(e.target.value)}
                placeholder="Email"
                type="email"
              />
              <input
                className="border rounded w-full p-2"
                value={editedPassword}
                onChange={(e) => setEditedPassword(e.target.value)}
                placeholder="New Password (optional)"
                type="password"
              />
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save Profile
                </button>
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold">{user?.username}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <button
                onClick={() => setIsEditingProfile(true)}
                className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 hover:cursor-pointer"
              >
                Edit Profile
              </button>
              <button
                onClick={handleDeleteUser}
                className="mt-3 ml-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 hover:cursor-pointer"
              >
                Delete Account
              </button>
            </>
          )}
        </div>

        {/* Review History */}
        {user?.reviews && user.reviews.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Reviews</h2>
            <div className="space-y-8">
              {user.reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex flex-col md:flex-row gap-6 bg-gray-50 border rounded-xl p-4 shadow-sm"
                >
                  {/* Album Image */}
                  <Image
                    src={review.album.imageUrl}
                    alt={review.album.title}
                    width={200}
                    height={200}
                    className="rounded-md"
                  />

                  {/* Review Content */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {review.album.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {review.album.artist}
                      </p>

                      {editingReviewId === review.id ? (
                        <>
                          <input
                            className="border rounded w-full p-1 mb-2"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                          />
                          <textarea
                            className="border rounded w-full p-1 mb-2"
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                          />
                        </>
                      ) : (
                        <>
                          <p className="text-gray-700 mb-1">
                            <strong>{review.title}</strong>
                          </p>
                          <p className="text-sm text-gray-800">
                            {review.content}
                          </p>
                        </>
                      )}
                    </div>

                    {/* Rating & Actions */}
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-yellow-500 text-sm">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <div className="flex gap-2">
                        {editingReviewId === review.id ? (
                          <button
                            onClick={() => handleSaveReview(review.id)}
                            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600 hover:cursor-pointer"
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleEditReview(
                                review.id,
                                review.title,
                                review.content
                              )
                            }
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 hover:cursor-pointer"
                          >
                            Edit
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 hover:cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!user?.reviews?.length && (
          <p className="text-center text-gray-600 mt-10">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import StarRating from "@/components/StarRating";
import { useAuthStore } from "@/stores/useAuthStore";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Review {
  title: string;
  content: string;
  rating: number;
  user: {
    username: string;
  };
}

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export default function Album() {
  const { id } = useParams();
  const [album, setAlbum] = useState<AlbumData | null>(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState<number>(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [hasReviewed, setHasReviewed] = useState(false);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const response = await fetch(`/api/albums/${id}`);
        if (!response.ok) throw new Error("Failed to fetch album");
        const data = await response.json();
        setAlbum(data);
      } catch (error) {
        console.error("Error fetching album:", error);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/reviews/${id}`);
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data: Review[] = await response.json();
        setReviews(data);

        if (user) {
          const alreadyReviewed = data.some(
            (review) => review.user.username === user.username
          );
          setHasReviewed(alreadyReviewed);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchAlbum();
    fetchReviews();
  }, [id, user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/${id}`);
      if (!response.ok) throw new Error("Failed to fetch reviews");
      const data: Review[] = await response.json();
      setReviews(data);

      if (user) {
        const alreadyReviewed = data.some(
          (review) => review.user.username === user.username
        );
        setHasReviewed(alreadyReviewed);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/albums/${id}`);
      if (!response.ok) throw new Error("Failed to fetch album");
      const data = await response.json();
      setAlbum(data);
    } catch (error) {
      console.error("Error fetching album:", error);
    }
  };

  const handleSubmit = async () => {
    if (!reviewComment || reviewRating <= 0 || !reviewTitle) {
      alert("Please fill out all fields");
      return;
    }

    try {
      const response = await fetch(`/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          albumId: Number(id),
          title: reviewTitle,
          content: reviewComment,
          rating: reviewRating,
          userId: user?.id,
        }),
      });

      if (response.status === 409) {
        alert("You have already reviewed this album.");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      setReviewComment("");
      setReviewRating(0);
      setReviewTitle("");

      fetchReviews();
      fetchAlbum();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  if (!album) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100">
        <Navbar />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 text-gray-800 pb-20">
      <Navbar />
      <div className="flex flex-col md:flex-row items-center justify-center px-6 py-10 max-w-6xl mx-auto">
        <Image
          src={album.imageUrl}
          alt={album.title}
          width={400}
          height={400}
          className="mb-10 md:mr-10 md:mb-0 rounded-lg shadow"
        />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2">{album.title}</h1>
          <p className="text-xl text-green-700 font-medium mb-2">
            by {album.artist}
          </p>
          <p className="text-md text-gray-700 max-w-xl text-start">
            {album.description}
          </p>
          <p className="text-md max-w-xl mt-5 font-medium">
            Rating: {album.rating.toFixed(2)} ★
          </p>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white shadow-md max-w-5xl mx-auto p-6 rounded-lg mt-10">
        <h2 className="text-2xl font-semibold mb-4">Write a Review</h2>
        {hasReviewed ? (
          <p className="text-gray-500 italic">
            You have already submitted a review for this album.
          </p>
        ) : (
          <>
            <textarea
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value)}
              placeholder="Review Title"
              className="w-full border border-gray-300 p-3 rounded mb-4"
              rows={1}
              disabled={hasReviewed}
            />
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Write your review..."
              className="w-full border border-gray-300 p-3 rounded mb-4"
              rows={4}
              disabled={hasReviewed}
            />
            <StarRating
              rating={reviewRating}
              onRatingChange={(rating) => setReviewRating(rating)}
              disabled={hasReviewed}
            />
            <button
              onClick={handleSubmit}
              className={`mt-4 px-4 py-2 rounded text-white hover:cursor-pointer ${
                hasReviewed
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={hasReviewed}
            >
              Submit Review
            </button>
          </>
        )}
      </div>

      {/* Review List */}
      {reviews.length > 0 && (
        <div className="bg-white shadow-md max-w-5xl mx-auto p-6 rounded-lg mt-10">
          <h2 className="text-2xl font-semibold mb-6">Reviews</h2>
          <div className="space-y-6">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-1">
                  {review.title}
                </h3>
                <p className="text-gray-700 mb-2">{review.content}</p>
                <div className="flex items-center space-x-2 mb-1">
                  <StarRating
                    disabled
                    rating={review.rating}
                    onRatingChange={() => {}}
                  />
                </div>
                <p className="text-sm text-gray-600 italic">
                  by {review.user.username}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

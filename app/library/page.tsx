"use client";

import AlbumCard from "@/components/AlbumCard";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

interface AlbumProps {
  id: number;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
  rating: number;
}

export default function Library() {
  const [albums, setAlbums] = useState<AlbumProps[]>([]);

  const fetchAlbums = async () => {
    const res = await fetch("/api/albums", {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const data = await res.json();
      setAlbums(data);
    } else {
      console.error("Failed to fetch albums");
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 text-gray-800">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album, idx) => (
            <AlbumCard
              key={idx}
              id={album.id}
              artist={album.artist}
              title={album.title}
              image={album.imageUrl}
              rating={Number(album.rating.toFixed(2))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

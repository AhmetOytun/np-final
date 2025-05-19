"use client";

import { useState, useEffect } from "react";

type AlbumType = {
  id: number;
  title: string;
  artist: string;
  description: string;
  imageUrl: string;
};

function Admin() {
  const [albums, setAlbums] = useState<AlbumType[]>([]);
  const [album, setAlbum] = useState({
    id: null as number | null,
    title: "",
    artist: "",
    description: "",
    imageUrl: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch albums on mount
  useEffect(() => {
    fetchAlbums();
  }, []);

  const fetchAlbums = async () => {
    try {
      const res = await fetch("/api/albums");
      if (!res.ok) throw new Error("Failed to fetch albums");
      const data = await res.json();
      setAlbums(data);
    } catch {
      setErrorMessage("Failed to load albums.");
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setAlbum({ ...album, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const method = album.id ? "PUT" : "POST";
      const url = album.id ? `/api/albums/${album.id}` : "/api/albums";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: album.title,
          artist: album.artist,
          description: album.description,
          imageUrl: album.imageUrl,
        }),
      });

      if (!res.ok) throw new Error("Failed to save album");

      setSuccessMessage(
        album.id ? "Album updated successfully!" : "Album created successfully!"
      );
      setErrorMessage("");
      setAlbum({
        id: null,
        title: "",
        artist: "",
        description: "",
        imageUrl: "",
      });
      fetchAlbums(); // Refresh list
    } catch (err) {
      setErrorMessage(
        album.id ? "Failed to update album." : "Failed to create album."
      );
      setSuccessMessage("");
      console.error(err);
    }
  };

  const handleEdit = (albumToEdit: AlbumType) => {
    setAlbum(albumToEdit);
    setSuccessMessage("");
    setErrorMessage("");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this album?")) return;

    try {
      const res = await fetch(`/api/albums/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete album");
      setSuccessMessage("Album deleted successfully!");
      setErrorMessage("");
      if (album.id === id) {
        // Reset form if deleting currently edited album
        setAlbum({
          id: null,
          title: "",
          artist: "",
          description: "",
          imageUrl: "",
        });
      }
      fetchAlbums();
    } catch (err) {
      setErrorMessage("Failed to delete album.");
      setSuccessMessage("");
      console.error(err);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">
        Admin Panel
      </h1>
      <p className="text-center mb-8 text-gray-600">
        {album.id
          ? "Edit the album below."
          : "Create a new album by filling out the form below."}
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <input
          type="text"
          name="title"
          placeholder="Album Title"
          value={album.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="text"
          name="artist"
          placeholder="Artist"
          value={album.artist}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={album.description}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <input
          type="url"
          name="imageUrl"
          placeholder="Image URL"
          value={album.imageUrl}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          {album.id ? "Update Album" : "Create Album"}
        </button>
      </form>

      {successMessage && (
        <p className="mt-6 text-center text-green-600 font-semibold">
          {successMessage}
        </p>
      )}
      {errorMessage && (
        <p className="mt-6 text-center text-red-600 font-semibold">
          {errorMessage}
        </p>
      )}

      <hr className="my-8" />

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Existing Albums
      </h2>
      {albums.length === 0 ? (
        <p className="text-center text-gray-500">No albums found.</p>
      ) : (
        <ul className="space-y-4">
          {albums.map(({ id, title, artist }) => (
            <li
              key={id}
              className="flex justify-between items-center border border-gray-200 rounded-md p-3 hover:shadow"
            >
              <div>
                <p className="font-semibold text-lg">{title}</p>
                <p className="text-gray-600 text-sm">{artist}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(albums.find((a) => a.id === id)!)}
                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="px-3 py-1 text-red-600 border border-red-600 rounded hover:bg-red-50 transition"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Admin;

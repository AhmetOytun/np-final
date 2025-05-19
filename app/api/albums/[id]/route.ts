import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop(); // or use req.nextUrl.searchParams if in query
  const albumId = Number(id);

  const album = await prisma.album.findUnique({
    where: { id: albumId },
  });

  if (!album) {
    return new Response(JSON.stringify({ error: "Album not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(album), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PUT(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const albumId = Number(id);
  const body = await req.json();
  const { title, artist, description, imageUrl } = body;

  if (!title || !artist || !description || !imageUrl) {
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const updatedAlbum = await prisma.album.update({
    where: { id: albumId },
    data: {
      title,
      artist,
      description,
      imageUrl,
    },
  });

  return new Response(JSON.stringify(updatedAlbum), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.pathname.split("/").pop();
  const albumId = Number(id);

  try {
    await prisma.review.deleteMany({
      where: { albumId },
    });

    await prisma.album.delete({
      where: { id: albumId },
    });

    return new Response(JSON.stringify({ message: "Album deleted" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting album:", error);
    return new Response(
      JSON.stringify({ error: "Album not found or could not be deleted" }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

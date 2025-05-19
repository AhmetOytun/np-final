import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { title, artist, description, imageUrl } = body;

    if (!title || !artist || !description || !imageUrl) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const album = await prisma.album.create({
      data: {
        title,
        artist,
        description,
        imageUrl,
      },
    });

    return new Response(JSON.stringify(album), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating album:", error);

    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  const albums = await prisma.album.findMany();
  return new Response(JSON.stringify(albums), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { albumId, title, content, rating, userId } = body;

    if (!albumId || !content || !rating || !userId) {
      return new Response("Missing required fields", { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        title,
        content,
        rating: parseFloat(rating),
        album: { connect: { id: albumId } },
        user: { connect: { id: userId } },
      },
    });

    const reviews = await prisma.review.findMany({
      where: { albumId },
    });

    const newAverage =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await prisma.album.update({
      where: { id: albumId },
      data: { rating: newAverage },
    });

    return new Response(JSON.stringify(review), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error creating review:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new Response("You have already reviewed this album.", {
        status: 409,
      });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}

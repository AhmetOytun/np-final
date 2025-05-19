import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Helper to extract the ID from the URL
function getIdFromRequest(req: NextRequest): number {
  const id = req.nextUrl.pathname.split("/").pop();
  return Number(id);
}

export async function GET(req: NextRequest) {
  const albumId = getIdFromRequest(req);

  const reviews = await prisma.review.findMany({
    where: { albumId },
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!reviews || reviews.length === 0) {
    return new Response(JSON.stringify({ error: "Reviews not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(reviews), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req: NextRequest) {
  const reviewId = getIdFromRequest(req);

  try {
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { albumId: true },
    });

    if (!review) {
      return new Response(JSON.stringify({ error: "Review not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    const remainingReviews = await prisma.review.findMany({
      where: { albumId: review.albumId },
      select: { rating: true },
    });

    const newAverage =
      remainingReviews.length > 0
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) /
          remainingReviews.length
        : 0;

    await prisma.album.update({
      where: { id: review.albumId },
      data: { rating: newAverage },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete review and update rating:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete review and update rating" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PUT(req: NextRequest) {
  const reviewId = getIdFromRequest(req);
  const body = await req.json();
  const { title, content } = body;

  if (!title || !content) {
    return new Response(
      JSON.stringify({ error: "Title and content are required" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: { title, content },
    });

    return new Response(JSON.stringify(updatedReview), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ error: "Failed to update review" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

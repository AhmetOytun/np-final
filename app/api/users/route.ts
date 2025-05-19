import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function GET() {
  const users = await prisma.user.findMany();
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set in the environment");
    }

    const decoded = jwt.verify(token, secret) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        reviews: {
          include: {
            album: true,
          },
        },
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("JWT verification error:", error);
    return new Response("Unauthorized or invalid token", { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, username, email, password } = body;

    if (!id || !username || !email) {
      return new Response(
        JSON.stringify({ error: "ID, username and email are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const dataToUpdate: { username: string; email: string; password?: string } =
      {
        username,
        email,
      };

    if (password) {
      // Hash the new password using bcrypt with 10 salt rounds
      const hashedPassword = await bcrypt.hash(password, 10);
      dataToUpdate.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: dataToUpdate,
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });

    return new Response(JSON.stringify(updatedUser), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to update user profile" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 1. Get all albumIds that the user reviewed before deleting
    const userReviews = await prisma.review.findMany({
      where: { userId: Number(id) },
      select: { albumId: true },
    });

    const albumIds = [...new Set(userReviews.map((r) => r.albumId))]; // unique album ids

    // 2. Delete user (cascades to reviews)
    await prisma.user.delete({
      where: { id: Number(id) },
    });

    // 3. For each album, recalculate rating based on remaining reviews
    for (const albumId of albumIds) {
      const reviews = await prisma.review.findMany({
        where: { albumId },
        select: { rating: true },
      });

      // Calculate average rating or 0 if no reviews left
      const newRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      // 4. Update album rating
      await prisma.album.update({
        where: { id: albumId },
        data: { rating: newRating },
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete user:", error);
    return new Response(JSON.stringify({ error: "Failed to delete user" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

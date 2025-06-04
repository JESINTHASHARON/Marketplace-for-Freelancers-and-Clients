import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// DELETE USER
export const deleteUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id); // Extract user ID from request params

    // Find user by ID
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return next(createError(404, "User not found!"));
    }
    // Check if the logged-in user is trying to delete their own account
    if (req.userId !== user.id) {
      return next(createError(403, "You can delete only your account!"));
    }
    // Delete user
    await prisma.user.delete({ where: { id: userId } });

    res.status(200).send("User deleted successfully.");
  } catch (err) {
    next(err);
  }
};

// GET USER
export const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return next(createError(404, "User not found!"));
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};



export const getUserDetailsById = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Fetch user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        img: true,
        country: true,
        phone: true,
        desc: true,
        isSeller: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Manually fetch related gigs, projects, and reviews

    // Fetch user's gigs
    const gigs = await prisma.gig.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        shortTitle: true,
        price: true,
        cover: true,
        sales: true,
      },
    });

    // Fetch user's projects
    const projects = await prisma.project.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        budget: true,
        isCompleted: true,
        createdAt: true,
      },
    });

    // Fetch user's reviews
    const reviews = await prisma.review.findMany({
      where: { userId },
    });

    // Calculate average rating from reviews
    const totalStars = reviews.reduce((sum, r) => sum + r.star, 0);
    const averageRating = reviews.length > 0 ? totalStars / reviews.length : null;

    // Respond with user details along with gigs, projects, reviews, and rating
    res.status(200).json({ 
      ...user,
      gigs,
      projects,
      averageRating,
      reviewCount: reviews.length,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

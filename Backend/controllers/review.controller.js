import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";

const prisma = new PrismaClient();
export const createReview = async (req, res, next) => {
  if (req.isSeller) {
    return next(createError(403, "Sellers can't create a review!"));
  }

  try {
    const gigId = parseInt(req.body.gigId, 10); // Convert gigId to an integer
    const star = parseInt(req.body.star, 10);   // Convert star to an integer

    if (isNaN(gigId) || isNaN(star)) {
      return next(createError(400, "Invalid gig ID or star value!"));
    }

    // Check if the review already exists
    const existingReview = await prisma.review.findFirst({
      where: {
        gigId: gigId,
        userId: req.userId,
      },
    });

    if (existingReview) {
      return next(createError(403, "You have already created a review for this gig!"));
    }

    // Check if the user has purchased the gig
    const order = await prisma.order.findFirst({
      where: {
        gigId: gigId,
        buyerId: req.userId,
      },
    });

    if (!order) {
      return next(createError(403, "You can only review gigs that you have purchased!"));
    }

    // Create the review
    const savedReview = await prisma.review.create({
      data: {
        gigId: gigId,
        userId: req.userId,
        desc: req.body.desc,
        star: star,  // Ensure it's an integer
      },
    });

    // Update gig rating
    await prisma.gig.update({
      where: { id: gigId },
      data: {
        totalStars: { increment: star },
        starNumber: { increment: 1 },
      },
    });

    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};
export const getReviews = async (req, res, next) => {
  try {
    const gigId = parseInt(req.params.gigId, 10); // Convert gigId to an integer

    if (isNaN(gigId)) {
      return next(createError(400, "Invalid gig ID!"));
    }

    const reviews = await prisma.review.findMany({
      where: { gigId: gigId },
    });
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const reviewId = parseInt(req.params.id, 10); // Convert review ID to integer

    if (isNaN(reviewId)) {
      return next(createError(400, "Invalid review ID!"));
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return next(createError(404, "Review not found!"));
    }

    if (review.userId !== req.userId) {
      return next(createError(403, "You can only delete your own reviews!"));
    }

    await prisma.review.delete({
      where: { id: review.id },
    });

    // Update gig rating
    await prisma.gig.update({
      where: { id: review.gigId },
      data: {
        totalStars: { decrement: review.star },
        starNumber: { decrement: 1 },
      },
    });

    res.status(200).json({ message: "Review deleted successfully!" });
  } catch (err) {
    next(err);
  }
};



export const getReviewsByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // First find all gigs by this user
    const gigs = await prisma.gig.findMany({
      where: { userId },
      select: { id: true }
    });

    const gigIds = gigs.map(gig => gig.id);

    // Then find reviews for those gigs
    const reviews = await prisma.review.findMany({
      where: {
        gigId: { in: gigIds }
      }
    });

    res.status(200).json(reviews);
  } catch (err) {
    console.error("Error fetching reviews:", err);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";

const prisma = new PrismaClient();

// CREATE A GIG
export const createGig = async (req, res, next) => {
  if (!req.isSeller){
    console.log("Error"); 
    return next(createError(403, "Only sellers can create a gig!"));
  }
  console.log("Request Body:", req.body);
  try {
    const {
      title,
      desc,
      cat,
      price,
      cover,
      images = [],
      shortTitle,
      shortDesc,
      deliveryTime,
      features = [],
    } = req.body;

    if (!title || !desc || !cat || !price || !cover || !shortTitle || !shortDesc || !deliveryTime ) {
      console.log("Missing required fields");
      return next(createError(400, "Missing required fields!"));
    }

    const newGig = await prisma.gig.create({
      data: {
        userId: req.userId,
        title,
        desc,
        cat,
        price: parseFloat(price),
        cover,
        images: { set: images },
        shortTitle,
        shortDesc,
        deliveryTime: Number(deliveryTime),
        features: { set: features },
      },
    });

    res.status(201).json(newGig);
  } catch (err) {
    next(err);
  }
};

// DELETE A GIG
export const deleteGig = async (req, res, next) => {
  try {
    const gigId = Number(req.params.id);
    if (isNaN(gigId)) return next(createError(400, "Invalid gig ID"));

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) return next(createError(404, "Gig not found!"));
    if (gig.userId !== req.userId) return next(createError(403, "You can delete only your gig!"));

    await prisma.gig.delete({ where: { id: gigId } });
    res.status(200).json({ message: "Gig has been deleted!" });
  } catch (err) {
    next(err);
  }
};

// GET A SINGLE GIG
export const getGig = async (req, res, next) => {
  try {
    const gigId = Number(req.params.id);
    if (isNaN(gigId)) return next(createError(400, "Invalid gig ID"));

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    if (!gig) return next(createError(404, "Gig not found!"));

    res.status(200).json(gig);
  } catch (err) {
    next(err);
  }
};

// GET ALL GIGS WITH FILTERS
export const getGigs = async (req, res, next) => {
  try {
    const { userId, cat, search, min, max, sort } = req.query;

    const filters = {
      where: {
        ...(userId && !isNaN(userId) ? { userId: Number(userId) } : {}),
        ...(cat ? { cat } : {}),
        ...(search ? { title: { contains: search, mode: "insensitive" } } : {}),
        ...(min || max
          ? { price: { gte: min ? parseFloat(min) : undefined, lte: max ? parseFloat(max) : undefined } }
          : {}),
      },
      orderBy: sort ? { [sort]: "desc" } : undefined,
    };

    const gigs = await prisma.gig.findMany(filters);
    res.status(200).json(gigs);
  } catch (err) {
    next(err);
  }
};


export const getGigsByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.userId);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const gigs = await prisma.gig.findMany({
      where: { userId },
    });

    res.status(200).json(gigs);
  } catch (err) {
    console.error("Error fetching gigs by user:", err);
    res.status(500).json({ error: "Failed to fetch gigs" });
  }
};

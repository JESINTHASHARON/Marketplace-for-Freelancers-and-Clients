import { PrismaClient } from "@prisma/client";
import createError from "../utils/createError.js";

const prisma = new PrismaClient();

export const createConversation = async (req, res, next) => {
  try {
    const conversationId = `${req.userId}${req.body.to}`; // Ensure it's a string

    // Check if conversation already exists
    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (existingConversation) {
      return res.status(200).json(existingConversation); // Return existing conversation
    }

    // Create new conversation if it doesn't exist
    const conversation = await prisma.conversation.create({
      data: {
        id: conversationId, // Ensure ID is a string
        sellerId: parseInt(req.isSeller ? req.userId : req.body.to, 10), // Convert to Int
        buyerId: parseInt(req.isSeller ? req.body.to : req.userId, 10), // Convert to Int
        readBySeller: req.isSeller,
        readByBuyer: !req.isSeller,
      },
    });

    res.status(201).json(conversation);
  } catch (err) {
    next(err);
  }
};



export const updateConversation = async (req, res, next) => {
    try {
      const updatedConversation = await prisma.conversation.update({
        where: { id: req.params.id },
        data: {
          ...(req.isSeller ? { readBySeller: true } : { readByBuyer: true }),
        },
      });
  
      res.status(200).json(updatedConversation);
    } catch (err) {
      next(err);
    }
  };
  
  
export const getSingleConversation = async (req, res, next) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
    });

    if (!conversation) return next(createError(404, "Not found!"));

    res.status(200).json(conversation);
  } catch (err) {
    next(err);
  }
};

export const getConversations = async (req, res, next) => {
    try {
      const conversations = await prisma.conversation.findMany({
        where: req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId },
        orderBy: { updatedAt: "desc" },
      });
  
      // Fetch usernames for each sellerId and buyerId
      const userIds = [
        ...new Set(conversations.flatMap((c) => [c.sellerId, c.buyerId])),
      ];
  
      const users = await prisma.user.findMany({
        where: { id: { in: userIds } },
        select: { id: true, username: true },
      });
  
      // Convert users array to a lookup map for quick access
      const userMap = Object.fromEntries(users.map((u) => [u.id, u.username]));
  
      // Attach usernames to conversations
      const updatedConversations = conversations.map((c) => ({
        ...c,
        sellerUsername: userMap[c.sellerId],
        buyerUsername: userMap[c.buyerId],
      }));
  
      res.status(200).json(updatedConversations);
    } catch (err) {
      next(err);
    }
  };
  
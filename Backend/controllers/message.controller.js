import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createMessage = async (req, res, next) => {
    try {
      const newMessage = await prisma.message.create({
        data: {
          conversationId: req.body.conversationId.toString(), // Convert to string
          userId: req.userId,
          desc: req.body.desc,
        },
      });
  
      await prisma.conversation.update({
        where: { id: req.body.conversationId.toString() }, // Ensure it's a string
        data: {
          readBySeller: req.isSeller,
          readByBuyer: !req.isSeller,
          lastMessage: req.body.desc,
        },
      });
  
      res.status(201).json(newMessage);
    } catch (err) {
      next(err);
    }
  };
  

export const getMessages = async (req, res, next) => {
    try {
      const messages = await prisma.message.findMany({
        where: { conversationId: req.params.id }, // Ensure it remains a string
        orderBy: { createdAt: "asc" },
      });
  
      res.status(200).json(messages);
    } catch (err) {
      next(err);
    }
  };
  
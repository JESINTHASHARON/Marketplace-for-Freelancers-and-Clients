import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import stripe from "stripe"; // Assuming you're using Stripe for payments
const stripeClient = stripe(process.env.STRIPE_SECRET);

export const payForModule = async (req, res, next) => {
  try {
    const moduleId = parseInt(req.params.id);
    
    if (!moduleId) return res.status(400).json({ message: "Module ID required" });

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
    });
   
    if (!module) return res.status(404).json({ message: "Module not found" });

    const amount = module.amount;

    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    // Update the module status to COMPLETED and save the paymentIntent ID
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        status: "COMPLETED",
        paymentIntent: paymentIntent.id, // Save payment intent ID here
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      module: updatedModule,
    });
  } catch (err) {
    console.error("Error in payForModule:", err);
    next(err);
  }
};


export const createModule = async (req, res) => {
  const { name, details, deadlineDays, projectURL, status, projectId } = req.body;

  try {
    const module = await prisma.module.create({
      data: {
        name,
        details,
        deadlineDays: parseInt(deadlineDays),
        projectURL: projectURL || "",
        status: status || "WAITING",
        projectId: parseInt(projectId),
      },
    });

    res.status(201).json(module);
  } catch (err) {
    console.error("Error creating module:", err);
    res.status(500).json({ error: "Failed to create module" });
  }
};

export const getModulesByProjectId = async (req, res) => {
  const { projectId } = req.params;

  try {
    const modules = await prisma.module.findMany({
      where: {
        projectId: parseInt(projectId),
      },
    });

    res.status(200).json(modules);
  } catch (err) {
    console.error("Error fetching modules:", err);
    res.status(500).json({ error: "Failed to fetch modules" });
  }
};




  export const updateModule = async (req, res) => {
    const { id } = req.params;
    const { name, details, deadlineDays, images } = req.body;
  
    try {
      const existing = await prisma.module.findUnique({ where: { id: parseInt(id) } });
  
      if (!existing) return res.status(404).json({ error: "Module not found" });
  
      if (existing.updateCount >= 2)
        return res.status(403).json({ error: "Module update limit reached" });
  
      const updated = await prisma.module.update({
        where: { id: parseInt(id) },
        data: {
          name,
          details,
          deadlineDays: parseInt(deadlineDays),
          updateCount: { increment: 1 },
          ...(images && { images }), // only update if images is provided
        },
      });
  
      res.status(200).json(updated);
    } catch (err) {
      console.error("Error updating module:", err);
      res.status(500).json({ error: "Failed to update module" });
    }
  };
  
  export const submitModuleWork = async (req, res) => {
    const { id } = req.params;
    const { projectURL } = req.body;
  
    // If images were uploaded via form-data and came as an array of strings (Cloudinary URLs)
    let imageUrls = [];
  
    if (req.body.images) {
      if (Array.isArray(req.body.images)) {
        imageUrls = req.body.images;
      } else {
        imageUrls = [req.body.images];
      }
    }
  
    try {
      const updatedModule = await prisma.module.update({
        where: {
          id: parseInt(id),
        },
        data: {
          projectURL,
          images: imageUrls, // Assumes your DB has a `images` field of type String[] (array of strings)
          status: "SUBMITTED",
        },
      });
      
      res.status(200).json(updatedModule);
    } catch (err) {
      console.error("Error submitting module work:", err);
      res.status(500).json({ error: "Failed to submit work" });
    }
  };
  


export const updateModuleStatus = async (req, res) => {
  const moduleId = parseInt(req.params.id);
  const { status, amount } = req.body;

  try {
    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: {
        status,
        ...(amount !== undefined && { amount: parseFloat(amount) }),
      },
    });

    res.status(200).json(updatedModule);
  } catch (err) {
    console.error("Error updating module status:", err);
    res.status(500).json({ message: "Failed to update module status" });
  }
};

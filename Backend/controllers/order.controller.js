import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET);



// export const createOrder = async (req, res, next) => {
//   try {
//     const gigId = parseInt(req.params.gigId);
//     if (!gigId) return res.status(400).json({ message: "Gig ID required" });

//     const gig = await prisma.gig.findUnique({ where: { id: gigId } });
//     if (!gig) return res.status(404).json({ message: "Gig not found" });

//     const order = await prisma.order.create({
//       data: {
//         gigId: gig.id,
//         title: gig.title,
//         img: gig.cover,
//         price: gig.price,
//         buyerId: req.userId,
//         sellerId: gig.userId,
//         isCompleted: false,
//         isPaid: false,
//         requirements: null,
//         workUrl: null,
//       },
//     });

//     await prisma.gig.update({
//       where: { id: gigId },
      
//     });

//     res.status(201).json(order);
//   } catch (err) {
//     next(err);
//   }
// };
export const createOrder = async (req, res, next) => {
  try {
    const gigId = parseInt(req.params.gigId);
    console.log("Creating order for gigId:", gigId);

    if (!gigId) return res.status(400).json({ message: "Gig ID required" });

    const gig = await prisma.gig.findUnique({ where: { id: gigId } });
    console.log("Fetched gig:", gig);

    if (!gig) return res.status(404).json({ message: "Gig not found" });

    const order = await prisma.order.create({
      data: {
        gigId: gig.id,
        title: gig.title,
        img: gig.cover,
        price: gig.price,
        buyerId: req.userId,
        sellerId: gig.userId,
        isCompleted: false,
        isPaid: false,
        requirements: null,
        workUrl: null,
      },
    });

    console.log("Order created:", order);

    res.status(201).json(order);
  } catch (err) {
    console.error("Error in createOrder:", err);
    next(err);
  }
};

// Submit Requirements
export const submitRequirements = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { requirements } = req.body;

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { requirements },
    });

    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Pay for Order
export const payForOrder = async (req, res, next) => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: parseInt(req.params.orderId) },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: "usd",
      automatic_payment_methods: { enabled: true },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: paymentIntent.id, isPaid: true},
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    next(err);
  }
};

export const confirmPayment = async (req, res, next) => {
  try {
    // Step 1: Find the order by paymentIntent
    const order = await prisma.order.findUnique({
      where: { paymentIntent: req.body.payment_intent },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Step 2: Update the order to mark it as paid
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },  // Use the ID to update the order
      data: { isPaid: true , sales: { increment: 1 } },
    });

    // Step 3: Increment the sales count of the related gig
    await prisma.gig.update({
      where: { id: updatedOrder.gigId },
      data: { sales: { increment: 1 } },
    });

    res.status(200).send("Payment confirmed.");
  } catch (err) {
    next(err);
  }
};


// Upload Work
export const uploadWork = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { fileUrl } = req.body;

    console.log("Incoming uploadWork request", {
      userId: req.userId,
      orderId,
      fileUrl,
    });

    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.sellerId !== req.userId) {
      console.log("Unauthorized access attempt.");
      return res.status(403).json({ message: "Unauthorized" });
    }
    const updated = await prisma.order.update({
      where: { id: orderId },
      data: { workUrl: fileUrl, isCompleted: true },
    });
    res.status(200).json({ message: "Work uploaded", order: updated });
  } catch (err) {
    console.error("uploadWork error:", err); // FULL ERROR LOG
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};





// Delete Order (within 1 day)
export const deleteOrder = async (req, res) => {
  try {
    const orderId = parseInt(req.params.id);
    const order = await prisma.order.findUnique({ where: { id: orderId } });

    if (!order || order.buyerId !== req.userId)
      return res.status(403).json({ message: "Unauthorized" });

    const oneDay = 24 * 60 * 60 * 1000;
    if (new Date() - new Date(order.createdAt) > oneDay)
      return res.status(400).json({ message: "Cannot delete after 1 day" });

    await prisma.order.delete({ where: { id: orderId } });
    res.status(200).json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
// Get Order by ID
export const getOrder = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const order = await prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        workUrl: true,
        buyerId: true,
        sellerId: true,
        isCompleted: true,
        isPaid: true,
      },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: only buyer or seller can access
    if (req.userId !== order.buyerId && req.userId !== order.sellerId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.status(200).json(order);
  } catch (err) {
    next(err);
  }
};

// Get All Orders (Buyer/Seller)
export const getOrders = async (req, res) => {
  const userId = req.userId;
  const isSeller = req.isSeller;

  try {
    const orders = await prisma.order.findMany({
      where: isSeller ? { sellerId: userId } : { buyerId: userId },
      orderBy: { createdAt: "desc" },
    });

    const enrichedOrders = await Promise.all(
      orders.map(async (order) => {
        const user = await prisma.user.findUnique({
          where: {
            id: isSeller ? order.buyerId : order.sellerId,
          },
          select: {
            id: true,
            username: true,
            email: true,
            img: true,
          },
        });

        const gig = await prisma.gig.findUnique({
          where: { id: order.gigId },
        });

        return {
          ...order,
          user,
          gigExists: !!gig,
        };
      })
    );

    res.status(200).json(enrichedOrders);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// Get Order Details
export const getOrderDetails = async (req, res, next) => {
  try {
    const orderId = parseInt(req.params.id);

    // Step 1: Fetch order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.sellerId !== req.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Step 2: Fetch buyer manually using buyerId
    const buyer = await prisma.user.findUnique({
      where: { id: order.buyerId },
      select: {
        id: true,
        username: true,
        email: true,
        img: true,
        country: true,
      },
    });

    // Step 3: Get delivery time
    const delivery = await prisma.gig.findUnique({
      where: { id: order.gigId },
      select: { deliveryTime: true },
    });

    // Step 4: Calculate deadline and time left
    const deadline = new Date(order.createdAt);
    deadline.setDate(deadline.getDate() + delivery.deliveryTime);
    const now = new Date();
    const timeLeft = Math.max(0, deadline - now);

    // Step 5: Return all details
    res.status(200).json({
      order,
      buyer,
      requirements: order.requirements,
      timeLeftInMs: timeLeft,
      deliveryDeadline: deadline,
      status: order.isCompleted
        ? "Completed"
        : order.workUrl
        ? "Delivered"
        : "In Progress",
    });
  } catch (err) {
    console.error("Error in getOrderDetails:", err);
    next(err);
  }
};

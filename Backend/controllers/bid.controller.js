import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


// Update bid status (Accept or Reject)
export const updateBidStatus = async (req, res) => {
  const { bidId, action } = req.params; // Get bidId and action (accept/reject) from the URL

  if (!['accept', 'reject'].includes(action)) {
    return res.status(400).json({ error: "Invalid action. Must be 'accept' or 'reject'." });
  }

  try {
    // Find the bid
    const bid = await prisma.bid.findUnique({
      where: { id: parseInt(bidId) },
    });

    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }

    // Update the status based on the action
    const updatedBid = await prisma.bid.update({
      where: { id: parseInt(bidId) },
      data: {
        status: action.toUpperCase(), // Set status to 'ACCEPTED' or 'REJECTED'
      },
    });

    res.status(200).json(updatedBid);
  } catch (err) {
    console.error("Error updating bid status:", err);
    res.status(500).json({ error: "Failed to update bid status" });
  }
};



// Get Project by ID
export const getProjectsByBidder = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    // Step 1: Find all bids made by the user
    const bids = await prisma.bid.findMany({
      where: {
        freelancerId: parseInt(userId),
      },
    });

    if (bids.length === 0) {
      return res.status(200).json({ message: "No bids found for this user" });
    }

    // Step 2: Extract all unique projectIds from bids
    const projectIds = [...new Set(bids.map(bid => bid.projectId))];

    // Step 3: Fetch projects manually using the extracted projectIds
    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
    });

    // Step 4: Combine bids with corresponding projects
    const projectBids = bids.map(bid => {
      const project = projects.find(proj => proj.id === bid.projectId);
      return {
        project,
        bid,
      };
    });

    // Step 5: Return the combined data
    res.status(200).json({
      userId: parseInt(userId),
      bidCount: bids.length,
      projectBids,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch projects for the user" });
  }
};

// In your controller (bid.controller.js)
export const createBid = async (req, res) => {
    try {
      const { amount, projectId, freelancerId } = req.body;
  
      // Make sure that the user is valid (optional check, based on your business logic)
      if (!amount || !projectId || !freelancerId) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      // Create a new bid in the database (assuming you're using Prisma or similar ORM)
      const newBid = await prisma.bid.create({
        data: {
          amount,
          projectId: parseInt(projectId),
          freelancerId: parseInt(freelancerId),
        },
      });
  
      return res.status(201).json(newBid);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Something went wrong" });
    }
  };  





  export const checkIfBidExists = async (req, res) => {
    const { freelancerId, projectId } = req.query;
  
    try {
      const bid = await prisma.bid.findFirst({
        where: {
          freelancerId: parseInt(freelancerId),
          projectId: parseInt(projectId),
        },
      });
  
      res.status(200).json({ hasBid: !!bid });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error checking bid" });
    }
  };
  
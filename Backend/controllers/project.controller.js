import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      budget,
      images,
      numberOfModules,
      userId,
    } = req.body;

    const newProject = await prisma.project.create({
        data: {
          title,
          description,
          category,
          budget: parseInt(budget),
          numberOfModules: parseInt(numberOfModules),
          images: {
            set: images, // assuming images is an array of URLs
          },
          userId: parseInt(userId), // Set the scalar field directly
        },
      });
      

    res.status(201).json(newProject);
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
};
export const getAllProjects = async (req, res) => {
  const userId = req.userId; // assuming you're attaching userId from auth middleware

  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: userId, // Fetch only projects posted by this user
      },
      orderBy: {
        createdAt: 'desc', // Order by creation date (newest first)
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true, // Add category field
        budget: true, // Add budget field
        images: true, // Add images field
        numberOfModules: true, // Add numberOfModules field
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
        userId: true, // Include userId to pass it to the frontend
      },
    });

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};


export const getProjectById = async (req, res, next) => {
  try {
    const projectId = Number(req.params.id);
    if (isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }
    console.log(projectId);
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    const user = await prisma.user.findUnique({
      where: { id: project.userId },
      select: {
        id: true,
        username: true,
        email: true,
        img: true,
        country: true,
        phone: true,
        desc: true,
        isSeller: true,
      },
    });
    res.status(200).json({ ...project, user });
  } catch (err) {
    console.error("Error fetching project:", err);
    res.status(500).json({ error: "Failed to fetch project" });
  }
};



// Optional: Delete a project
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.project.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};


export const getBidsForProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);

    // Fetch all bids for the project that are NOT REJECTED
    const bids = await prisma.bid.findMany({
      where: {
        projectId: projectId,
        status: {
          not: "REJECT", // 🔥 filter out rejected bids
        },
      },
    });

    if (!bids.length) {
      return res.status(404).json({ message: "No bids found for this project." });
    }

    // Manually join with user data using freelancerId
    const bidsWithFreelancer = await Promise.all(
      bids.map(async (bid) => {
        const freelancer = await prisma.user.findUnique({
          where: { id: bid.freelancerId },
          select: { username: true, img: true },
        });

        return {
          ...bid,
          freelancer, // Add freelancer details to the bid
        };
      })
    );

    res.status(200).json(bidsWithFreelancer);
  } catch (err) {
    console.error("Error fetching bids for project:", err);
    res.status(500).json({ error: "Failed to fetch bids" });
  }
};



export const getProjectByUserId = async (req, res) => {
  try {
    const userId = Number(req.params.userId);

    // Check if userId is valid
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    console.log(`Fetching projects for userId: ${userId}`);

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        description: true,
        category: true,
        budget: true,
        images: true,
        numberOfModules: true,
        isCompleted: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Log the result for debugging
    console.log(`Found projects:`, projects);

    if (projects.length === 0) {
      return res.status(404).json({ message: "No projects found for this user." });
    }

    res.status(200).json(projects);
  } catch (err) {
    console.error("Error fetching projects by user ID:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};


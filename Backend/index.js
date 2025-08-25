import express from "express";
import dotenv from "dotenv";
import userRoute from "./routes/user.routes.js"
import reviewRoute from "./routes/review.routes.js";
import orderRoute from "./routes/order.routes.js";
import messageRoute from "./routes/message.routes.js";
import gigRoute from "./routes/gig.routes.js";
import conversationRoute from "./routes/conversation.routes.js";
import authRoute from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import projectRoutes from "./routes/project.routes.js"
import bidRoutes from "./routes/bid.routes.js";
import moduleRoutes from "./routes/module.routes.js";
import cors from "cors";
import getPrismaInstance from "./utils/prismaClient.js";
const prisma = getPrismaInstance();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", async (req, res) => {
    try {
        const users = await prisma.user.findMany();
        res.json(users);
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ message: "Database connection failed" });
    }
});

//middlewares
app.use(cookieParser())
app.use(express.json())
//app.use(cors())
//app.use(cors({origin:"http://localhost:5173",credential:true}))

app.use(cors({
    origin: "http://localhost:5173",  // Must match exactly
    credentials: true,  // Needed for cookies and auth headers
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"],  // Important headers
}));

//api
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/reviews",reviewRoute)
app.use("/api/orders",orderRoute)
app.use("/api/messages",messageRoute)
app.use("/api/gigs",gigRoute)
app.use("/api/conversations",conversationRoute)
app.use("/api/projects", projectRoutes);
app.use("/api/bids",bidRoutes);
app.use("/api/modules",moduleRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error-handling middleware (must be after all routes)
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        success: false,
        status: err.status || 500,
        message: err.message || "Something went wrong!",
    });
});

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

// REGISTER USER
export const register = async (req, res, next) => {
  try {
    // Hash the password
    const hash = bcrypt.hashSync(req.body.password, 5);

    // Create a new user in the database using Prisma
    const newUser = await prisma.user.create({
      data: {
        username: req.body.username,
        email: req.body.email,
        password: hash,
        img: req.body.img,
        country: req.body.country,
        phone: req.body.phone,
        desc: req.body.desc,
        isSeller: req.body.isSeller || false,
      },
    });

    res.status(201).json({ message: "User has been created.", user: newUser });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    console.log("Login attempt for:", req.body.username); // Debugging log

    // Validate request body
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Username and password are required!" });
    }

    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: req.body.username },
    });

    if (!user) {
      console.log("User not found!"); // Debugging log
      return res.status(404).json({ message: "User not found!" });
    }

    // Compare hashed password
    const isCorrect = bcrypt.compareSync(req.body.password, user.password);
    if (!isCorrect) {
      console.log("Incorrect password!"); // Debugging log
      return res.status(400).json({ message: "Wrong password or username!" });
    }

    // Check if JWT secret key is available
    if (!process.env.jWT_KEY) {
      console.error("JWT_KEY is missing in environment variables!");
      return res.status(500).json({ message: "Server configuration error!" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        isSeller: user.isSeller,
      },
      process.env.jWT_KEY,
      { expiresIn: "2h" } // Token expires in 2 hours
    );

    // Exclude password before sending response
    const { password, ...info } = user;

    // Set HTTP-only cookie for authentication
    res
      .cookie("accessToken", token, { httpOnly: true, secure: true, sameSite: "None" })
      .status(200)
      .json({ message: "Login successful!", user: info });

  } catch (err) {
    console.error("Login error:", err);
    next(err);
  }
};
// LOGOUT USER
export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out.");
};

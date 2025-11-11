import { configDotenv } from "dotenv"
import { prisma } from "../db/prisma.js"
import { hashPass, verifyPass } from "../utils/hashPassword.js";
import { generateToken } from "../utils/token.js"
configDotenv();
export const signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  try {
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    const hashedPassword = await hashPass(password);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken(newUser.id);
    return res.status(201).json({ message: "User created successfully!", token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required!" });
  }

  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const isPasswordValid = await verifyPass(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = generateToken(user.id);

    return res.status(200).json({ message: "Login successful!", token });
  } catch (err) {
    return res.status(500).json({ message: "Server Error!" });
  }
};
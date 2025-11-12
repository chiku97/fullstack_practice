require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Enable CORS for all origins (adjust as needed for production)
const app = express();
app.use(cors());

const prisma = new PrismaClient();
app.use(express.json());

const SECRET = process.env.SECRET_KEY;
if (!SECRET) {
  console.warn(
    "Warning: SECRET_KEY is not set in .env. Set SECRET_KEY to a secure value for production."
  );
}

app.post("/signup", async (req, res) => {
  try {
    let { name, email, password } = req.body;

    name = String(name || "").trim();
    email = String(email || "")
      .trim()
      .toLowerCase();
    password = String(password || "");

    // basic validation
    if (!name || !email || !password) {
      return res
        .status(422)
        .json({ message: "Name, email and password are required" });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(422).json({ message: "Invalid email address" });
    }
    if (password.length < 6) {
      return res
        .status(422)
        .json({ message: "Password must be at least 6 characters" });
    }

    // check whether user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // return created user without password
    const { password: _p, ...safeUser } = created;
    return res
      .status(201)
      .json({ message: "User created successfully", user: safeUser });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(422)
        .json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email: String(email).toLowerCase() },
    });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET || "dev_secret",
      { expiresIn: "8h" }
    );
    return res.status(200).json({ token, email: user.email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});

async function isValidToken(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header missing or malformed" });
    }
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, SECRET || "dev_secret");
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "You are not authorized" });
  }
}

app.get("/users", isValidToken, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });
    return res.status(200).json({ data: users });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
});
app.get("/protected", isValidToken, (req, res) => { 
    return res.status(200).json({ message: "This is protected data." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

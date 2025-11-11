import { loginUser, signupUser } from "../controllers/authController.js"
import { Router } from "express";
const router = Router();

router.post("/signup", signupUser)
router.post("/login", loginUser)

export default router;
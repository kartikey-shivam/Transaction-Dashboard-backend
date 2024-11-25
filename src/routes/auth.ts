import express from "express";
import { tokenIdentification,register, login } from "../services/authService";

const router = express.Router();

router.post("/", tokenIdentification);
router.post("/register", register);
router.post("/login", login);

export default router;

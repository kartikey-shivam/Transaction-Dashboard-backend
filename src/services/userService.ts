import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";


export const getUser = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;

    // Find user
    console.log(user);
    const userId = user.id;
    const userById = await User.findById(userId);


    res.status(200).json({ success:true, user:userById });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { verifyToken } from "../utils/jwtHelper";

export const tokenIdentification = async (req: Request, res: Response) => {
      const { token } = req.body;
  
    try {
      const decoded = verifyToken(token); 
      console.log(decoded,"13")
      req.body.user = decoded;
      return res.status(200).json({success:true,message:"Token verified"});
    } catch (error) {
      return res.status(401).json({ success:false,message: "Unauthorized: Invalid token" });
    }
  
};


export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
  
    const hashedPassword = await bcrypt.hash(password, 10);


    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    
    res.status(201).json({success:true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error registering user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });
    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "4h",
    });
    res.status(200).json({ success:true,token:token });
  } catch (error) {
    res.status(500).json({ error: "Error logging in" });
  }
};

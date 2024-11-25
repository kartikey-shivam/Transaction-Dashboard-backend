import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string || "flagright";
const JWT_EXPIRY = "2h"; // Default token expiry duration

// Generate JWT token for a given payload
export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

// Verify the authenticity of a JWT token
export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

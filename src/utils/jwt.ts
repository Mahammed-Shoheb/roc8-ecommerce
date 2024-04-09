import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET!;

export const verifyJWT = (token: string) =>
  jwt.verify(token, SECRET_KEY) as JwtPayload;

export const generateAccessToken = (userId: string) =>
  jwt.sign({ userId: userId }, SECRET_KEY, {
    expiresIn: "1h",
  });

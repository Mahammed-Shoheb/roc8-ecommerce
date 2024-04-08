import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;

export const verifyJWT = (token: string) =>
  jwt.verify(token, SECRET_KEY as string) as any;

export const generateAccessToken = (user: any) =>
  jwt.sign({ userId: user.id }, SECRET_KEY as string, {
    expiresIn: "1h",
  });

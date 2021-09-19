import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/usersModel";

const secret: string = process.env.JWT_SECRET as string;
export async function auth(req: any, res: Response, next: NextFunction): Promise<void> {
    try {
        const token = req.cookies.jwt;
        const decoded: any = jwt.verify(token, secret);
        const user = await User.findOne({ _id: decoded.id, "tokens.token": token });
        if (!user) {
            throw new Error("Error");
        }
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json("Not Logged In");
    }
}
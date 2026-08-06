import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export function authenticateToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access token required"
        });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }

    console.log("========== JWT DEBUG ==========");
    console.log("JWT_SECRET:", process.env.JWT_SECRET);
    console.log("TOKEN:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET as string
        ) as {
            id: number;
            email: string;
        };

        console.log("TOKEN VALID!");
        console.log(decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.error("JWT VERIFY ERROR:");
        console.error(error);

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
}
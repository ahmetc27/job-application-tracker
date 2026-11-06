import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../lib/config.ts";

export const requireAuth = (request: Request, response: Response, next: NextFunction) => {
    // 1. Header aus request.headers.authorization holen
    const authHeader = request.headers.authorization;
    // 2. fehlt er: 401 mit { message: "not logged in" }, dann return
    if (!authHeader) {
        response.status(401).json({ message: "not logged in" });
        return;
    }
    // 3. Token abschneiden: split(" ") und davon Index 1
    const list = authHeader.split(" ");
    const token = list[1];
    // 4. try: jwt.verify(token, jwtSecret), danach next()
    try {
        jwt.verify(token, jwtSecret);
        next();
    }
    // 5. catch: 401 mit { message: "invalid token" }
    catch {
        response.status(401).json({ message: "invalid token" });
    }
};
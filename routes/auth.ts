import express from "express";
import jwt from "jsonwebtoken";
import { jwtSecret } from "../lib/config.ts";
import { prisma } from "../lib/prisma.ts";
import bcrypt from "bcryptjs";
export const authRouter = express.Router();

authRouter.post("/register", async (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (!email || !password) {
        response.status(400).json({ message: "email and password are required" });
        return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
        response.status(400).json({ message: "invalid password or email" });
        return;
    }

    if (password.length < 8) {
        response.status(400).json({ message: "password must be at least 8 characters" });
        return;
    }

    if (!email.includes("@")) {
        response.status(400).json({ message: "invalid email" });
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existing !== null) {
        response.status(409).json({ message: "email already exists" });
        return;
    }

    const hash = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
        data: { email: normalizedEmail, password: hash }
    });

    response.status(201).json({ id: user.id, email: user.email });
});

authRouter.post("/login", async (request, response) => {
    const email = request.body.email;
    const password = request.body.password;

    if (!email || !password) {
        response.status(400).json({ message: "email and password are required" });
        return;
    }

    if (typeof email !== "string" || typeof password !== "string") {
        response.status(400).json({ message: "invalid password or email" });
        return;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({ where: { email: normalizedEmail }});

    if (!user) {
        response.status(401).json({ message: "invalid email or password"});
        return;
    }
    
    const isCorrect = await bcrypt.compare(password, user.password);
    
    if (!isCorrect) {
        response.status(401).json({ message: "invalid email or password" });
        return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: "1h" });

    response.status(200).json({ token: token })
});
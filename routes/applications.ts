import express from "express";
import { prisma } from "../lib/prisma.ts";

export const applicationsRouter = express.Router();

applicationsRouter.get("/", async (request, response) => {
    response.json({ userId: request.userId });
});

applicationsRouter.post("/", async (request, response) => {
    // 1. abbrechen, wenn request.userId fehlt -> 401
    if (!request.userId) {
        response.status(401).json({ message: "not logged in" });
        return;
    }
    // 2. company, position, status und note aus request.body holen
    const company = request.body.company;
    const position = request.body.position;
    const status = request.body.status || "applied";
    const note = request.body.note;

    if (!company || !position) {
        response.status(400).json({ message: "company and position are required" });
        return;
    }

    const newApplication = await prisma.application.create({
        data: { company, position, status, note, userId: request.userId },
    });
    response.status(201).json(newApplication);
});
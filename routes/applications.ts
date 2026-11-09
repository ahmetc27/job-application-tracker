import express from "express";
import { prisma } from "../lib/prisma.ts";

export const applicationsRouter = express.Router();

applicationsRouter.get("/", async (request, response) => {
    // 1. wenn request.userId fehlt: 401 und return - dieselben vier Zeilen wie in POST
    if (!request.userId) {
        response.status(401).json({ message: "not logged in" });
        return;
    }
    // 2. Bewerbungen holen:
    //    await prisma.application.findMany({ where: { userId: request.userId } })
    //    und in eine Variable applications speichern
    const applications = await prisma.application.findMany({
        where: {
            userId: request.userId
        }
    })
    // 3. mit response.json(applications) antworten
    response.json(applications);
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

    if (typeof company !== "string" || typeof position !== "string") {
        response.status(400).json({ message: "company and position must be text" });
        return;
    }

    if (typeof status !== "string") {
        response.status(400).json({ message: "status must be text" });
        return;
    }

    if (typeof note !== "string" && note !== undefined) {
        response.status(400).json({ message: "note must be text" });
        return;
    }

    const newApplication = await prisma.application.create({
        data: { company, position, status, note, userId: request.userId },
    });
    response.status(201).json(newApplication);
});

applicationsRouter.get("/:id", async (request, response) => {
    if (!request.userId) {
        response.status(401).json({ message: "not logged in" });
        return;
    }
    const id = Number(request.params.id);
    if (Number.isNaN(id)) {
        response.status(400).json({ message: "invalid id" });
        return;
    }
    const application = await prisma.application.findUnique({
        where: {
            id: id
        }
    })

    if (application === null || request.userId !== application.userId) {
        response.status(404).json({ message: "application not found" });
        return;
    }

    response.json(application);
});
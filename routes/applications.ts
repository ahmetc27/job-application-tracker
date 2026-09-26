import express from "express";

export const applicationsRouter = express.Router();

applicationsRouter.get("/", async (request, response) => {
    response.json({ message: "ok" });
});
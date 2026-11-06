import express from "express";
import { authRouter } from "./routes/auth.ts";
import { applicationsRouter } from "./routes/applications.ts";
import { requireAuth } from "./middleware/requireAuth.ts";

const app = express();
app.disable("x-powered-by");
app.use(express.json());

app.use("/applications", requireAuth, applicationsRouter);
app.use("/auth", authRouter);

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
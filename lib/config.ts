import "dotenv/config";

const value = process.env.JWT_SECRET;

if (!value) {
    throw new Error("JWT_SECRET is missing in .env");
}

export const jwtSecret = value;
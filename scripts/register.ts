import "dotenv/config";

const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST_EMAIL, "password": process.env.TEST_PASSWORD }),
});

console.log("Status:", response.status);
console.log("Neuer User:", await response.json());
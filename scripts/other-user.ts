import "dotenv/config";

const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST2_EMAIL, "password": process.env.TEST2_PASSWORD }),
});

console.log("Status:", response.status);
console.log("Neuer User:", await response.json());

const loginResponse = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST2_EMAIL, "password": process.env.TEST2_PASSWORD }),
});

const loginData = await loginResponse.json();
const token = loginData.token;

const applicationsResponse = await fetch("http://localhost:3000/applications", {
    headers: { Authorization: `Bearer ${token}` },
});

const applicationData = await applicationsResponse.json();
console.log("Status:", applicationsResponse.status);
console.log(applicationData);
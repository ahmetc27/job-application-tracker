export {};

const response = await fetch("http://localhost:3000/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": "ahmet@test.at", "password": "geheim123" }),
});

console.log("Status:", response.status);
console.log("Neuer User:", await response.json());
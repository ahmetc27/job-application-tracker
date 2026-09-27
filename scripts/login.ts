export {};

const response = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": "neu@test.at", "password": "geheim123" }),
});

console.log("Status:", response.status);
console.log(await response.json());
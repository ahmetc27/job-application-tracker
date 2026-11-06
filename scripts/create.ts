import "dotenv/config";

const loginResponse = await fetch("http://localhost:3000/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST_EMAIL, "password": process.env.TEST_PASSWORD }),
});

const loginData = await loginResponse.json();
const token = loginData.token;

const applicationsResponse = await fetch("http://localhost:3000/applications", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ company: "Beispiel GmbH", position: "Junior Backend Developer" }),
});

const applicationData = await applicationsResponse.json();
console.log("Status:", applicationsResponse.status);
console.log(applicationData);
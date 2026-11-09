import "dotenv/config";

const BASE_URL = process.env.BASE_URL;

const register1Response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST_EMAIL, "password": process.env.TEST_PASSWORD }),
});

const register2Response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST2_EMAIL, "password": process.env.TEST2_PASSWORD }),
});

const login1Response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST_EMAIL, "password": process.env.TEST_PASSWORD }),
});
const login1Data = await login1Response.json();
const token1 = login1Data.token;

const login2Response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "email": process.env.TEST2_EMAIL, "password": process.env.TEST2_PASSWORD }),
});
const login2Data = await login2Response.json();
const token2 = login2Data.token;

const applicationsResponse = await fetch(`${BASE_URL}/applications`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`
    },
    body: JSON.stringify({ company: "Beispiel GmbH", position: "Junior Backend Developer" }),
});
const application1Data = await applicationsResponse.json();
const id = application1Data.id;

console.log(`Vorbereitung fertig, Test-Bewerbung hat id ${id}`);

const cases = [
    { name: "Login richtig", method: "POST", path: "/auth/login", token: undefined,
      body: { email: process.env.TEST_EMAIL, password: process.env.TEST_PASSWORD }, expected: 200 },
    { name: "Login falsch", method: "POST", path: "/auth/login", token: undefined,
      body: { email: process.env.TEST_EMAIL, password: "falsch123" }, expected: 401 
    },
    { name: "Registrieren mit zu kurzem Passwort", method: "POST", path: "/auth/register", token: undefined,
      body: { email: process.env.TEST_EMAIL, password: "kurz" }, expected: 400 
    },
    { name: "GET /applications ohne Token", method: "GET", path: "/applications", token: undefined,
      body: undefined, expected: 401 
    },
    { name: "POST /applications gültig", method: "POST", path: "/applications", token: token1,
      body: { company: "Test GmbH", position: "Junior Developer" }, expected: 201
    },
    { name: "POST /applications ohne company", method: "POST", path: "/applications", token: token1,
      body: { position: "Junior Developer" }, expected: 400
    },
    { name: "POST /applications ohne Token", method: "POST", path: "/applications", token: undefined,
      body: { company: "Test GmbH", position: "Junior Developer" }, expected: 401
    },
    { name: "GET eigener Eintrag", method: "GET", path: `/applications/${id}`, token: token1,
      body: undefined, expected: 200
    },
    { name: "GET fremder Eintrag", method: "GET", path: `/applications/${id}`, token: token2,
      body: undefined, expected: 404
    },
    { name: "GET ungültige id", method: "GET", path: `/applications/abc`, token: token1,
      body: undefined, expected: 400
    },
    { name: "PATCH nur Status", method: "PATCH", path: `/applications/${id}`, token: token1,
      body: { status: "interview" }, expected: 200
    },
    { name: "PATCH Status als Zahl", method: "PATCH", path: `/applications/${id}`, token: token1,
      body: { status: 5 }, expected: 400
    },
    { name: "PATCH fremder Eintrag", method: "PATCH", path: `/applications/${id}`, token: token2,
      body: { status: "interview" }, expected: 404
    },
    { name: "DELETE fremder Eintrag", method: "DELETE", path: `/applications/${id}`, token: token2,
      body: undefined, expected: 404
    },
    { name: "DELETE eigener Eintrag", method: "DELETE", path: `/applications/${id}`, token: token1,
      body: undefined, expected: 204
    },
];

let passed = 0;

for (const testCase of cases) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (testCase.token) {
        headers.Authorization = `Bearer ${testCase.token}`;
    }

    const response = await fetch(`${BASE_URL}${testCase.path}`, {
        method: testCase.method,
        headers: headers,
        body: testCase.body ? JSON.stringify(testCase.body) : undefined,
    });
    
    if (response.status === testCase.expected) {
        passed = passed + 1;
        console.log(`Passed: ${testCase.name}`);
    } else {
        console.log(`Failed: ${testCase.name}, expected: ${testCase.expected}, actual: ${response.status}`);
    }
}

console.log(`${passed} of ${cases.length} checks passed`);
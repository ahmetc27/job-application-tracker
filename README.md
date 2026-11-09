# Job Application Tracker

A REST API for tracking job applications.

## Features

- User registration with passwords hashed using bcrypt
- Login returns a JWT that is valid for 1 hour
- Full CRUD for job applications (create, list, read, update, delete)
- Users can only access their own applications
- Input validation with proper HTTP status codes (400, 401, 404, 409)

## Tech Stack

- **Node.js** + **TypeScript**
- **Express** – web framework
- **PostgreSQL** – database
- **Prisma** – ORM and migrations
- **jsonwebtoken** – JWT authentication
- **bcryptjs** – password hashing

## Prerequisites

- Node.js 24 or newer
- Docker

## Setup

**1. Clone the repository and install dependencies**

```bash
git clone https://github.com/ahmetc27/job-application-tracker.git
cd job-application-tracker
npm install
```

**2. Create the environment file**

```bash
cp .env.example .env
```

Open `.env` and set your own values. Generate a secret with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**3. Start the database**

```bash
docker run --name jat-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=applications -p 5433:5432 -d postgres:17
```

The password must match the one in `DATABASE_URL`.

**4. Apply the migrations**

```bash
npx prisma migrate deploy
npx prisma generate
```

**5. Start the server**

```bash
node server.ts
```

The API runs on `http://localhost:3000`.


## API Endpoints

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Create a new user | no |
| POST | `/auth/login` | Log in and receive a JWT | no |
| GET | `/applications` | List your own applications | yes |
| POST | `/applications` | Create an application | yes |
| GET | `/applications/:id` | Get one of your applications | yes |
| PATCH | `/applications/:id` | Update one of your applications | yes |
| DELETE | `/applications/:id` | Delete one of your applications | yes |

## Tests

Set `TEST_EMAIL`, `TEST_PASSWORD`, `TEST2_EMAIL` and `TEST2_PASSWORD` in your `.env`, start the server, then run:

```bash
node scripts/check.ts
```

The script creates two users and a test application, then runs 15 checks against the API — including cases that must fail, such as accessing another user's data. Expected output: `15 von 15 bestanden`.
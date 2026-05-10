# Workout Tracker API

A production-grade, RESTful backend API for tracking workouts, exercises, measurements, and progress. Built with Express, Prisma, and MariaDB.

## Features

- JWT Authentication (Access/Refresh Tokens)
- Workout Planning & Scheduling
- Custom Exercise Management
- Physical Progress Tracking
- Data Aggregation & Reporting

## Tech Stack

- Language: TypeScript (Node.js)
- Database: MariaDB
- ORM: Prisma
- Validation: Zod
- Testing: Vitest (TDD)

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables: `cp .env.example .env`
4. Run migrations: `npx prisma migrate dev`
5. Seed database: `tsx prisma/seed.ts`
6. Start development server: `npm run dev`

## Documentation

Comprehensive API documentation and usage guides are available in the `wiki/` directory.

## Testing

Run the test suite to ensure system integrity:
`npm test`

## License

ISC

---

[Roadmap.sh](https://roadmap.sh/projects/fitness-workout-tracker)

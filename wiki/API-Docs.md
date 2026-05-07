# API Endpoints Documentation

This document defines the RESTful API endpoints for the Workout Tracker application. Fields marked with `(optional)` are not required in the request body.

## Authentication

### Sign Up

- **Endpoint:** `POST /api/auth/signup`
- **Inputs:** `email` (required), `password` (required)
- **Outputs:** `userId`
- **Success:** 201 Created
- **Fail:** 400 Bad Request
- **Security:** Public

### Login

- **Endpoint:** `POST /api/auth/login`
- **Inputs:** `email` (required), `password` (required)
- **Outputs:** `accessToken`, `refreshToken`
- **Success:** 200 OK
- **Fail:** 401 Unauthorized
- **Security:** Public

### Logout

- **Endpoint:** `POST /api/auth/logout`
- **Inputs:** `refreshToken` (required)
- **Outputs:** `message`
- **Success:** 200 OK
- **Fail:** 400 Bad Request
- **Security:** Authenticated (via Refresh Token)

### Refresh Access Token

- **Endpoint:** `POST /api/auth/refresh`
- **Inputs:** `refreshToken` (required)
- **Outputs:** `accessToken`, `refreshToken`
- **Success:** 200 OK
- **Fail:** 401 Unauthorized
- **Security:** Public

## Workouts

### Create Workout

- **Endpoint:** `POST /api/workouts`
- **Inputs:** `title` (required), `scheduledAt` (required), `status` (optional), `comments` (optional), `exercises[]` (optional: contains `exerciseId`, `sequence`, `sets`, `reps`, `weight`, `weightUnit`, `duration`)
- **Outputs:** `workoutId`
- **Success:** 201 Created
- **Security:** Authenticated (JWT)

### List Workouts

- **Endpoint:** `GET /api/workouts`
- **Inputs:** `status` (query param - optional)
- **Outputs:** `workouts[]`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Get Workout Details

- **Endpoint:** `GET /api/workouts/:id`
- **Inputs:** None
- **Outputs:** `workout` (with exercises)
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Update Workout

- **Endpoint:** `PATCH /api/workouts/:id`
- **Inputs:** `title` (optional), `status` (optional), `comments` (optional), `startedAt` (optional), `endedAt` (optional), `exercises[]` (optional: items can be added, updated, or removed)
- **Outputs:** `updatedWorkout`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Delete Workout

- **Endpoint:** `DELETE /api/workouts/:id`
- **Inputs:** None
- **Outputs:** `message`
- **Success:** 204 No Content
- **Security:** Authenticated (JWT)

## Exercises & Progress

### List Categories

- **Endpoint:** `GET /api/exercises/categories`
- **Inputs:** None
- **Outputs:** `categories[]`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### List Exercises

- **Endpoint:** `GET /api/exercises`
- **Inputs:** `categoryId` (query param - optional)
- **Outputs:** `exercises[]`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Create Custom Exercise

- **Endpoint:** `POST /api/exercises`
- **Inputs:** `name` (required), `categoryId` (required), `description` (optional), `muscleGroup` (optional)
- **Outputs:** `exerciseId`
- **Success:** 201 Created
- **Security:** Authenticated (JWT)

### Get Measurement Details

- **Endpoint:** `GET /api/measurements/:id`
- **Inputs:** None
- **Outputs:** `measurement`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Log Measurement

- **Endpoint:** `POST /api/measurements`
- **Inputs:** `weight` (required), `date` (optional), `notes` (optional)
- **Outputs:** `measurementId`
- **Success:** 201 Created
- **Security:** Authenticated (JWT)

### List Measurements

- **Endpoint:** `GET /api/measurements`
- **Inputs:** None
- **Outputs:** `measurements[]`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Delete Measurement

- **Endpoint:** `DELETE /api/measurements/:id`
- **Inputs:** None
- **Outputs:** `message`
- **Success:** 204 No Content
- **Security:** Authenticated (JWT)

### Update Measurement

- **Endpoint:** `PATCH /api/measurements/:id`
- **Inputs:** `weight` (optional), `date` (optional), `notes` (optional)
- **Outputs:** `updatedMeasurement`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

### Generate Reports

- **Endpoint:** `GET /api/reports/progress`
- **Inputs:** `startDate` (query param - optional), `endDate` (query param - optional)
- **Outputs:** `reportData`
- **Success:** 200 OK
- **Security:** Authenticated (JWT)

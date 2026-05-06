# Workout Tracker (Small MVP)

App to let users track their workouts and progress.

This project involves creating a backend system
for a workout tracker application where users
can create workout plans, and track their progress.

The system will feature CRUD operations for workouts,
and generate reports on past workouts.

---

## Requirements

You are required to develop an API for a workout tracker application
that allows users to manage their workouts and track their progress.

Your first task is to think about the database schema and the API endpoints
that will be needed to support the application's functionality.

Here are some of the key features you should consider:

---

## Exercise Data

You should write a data seeder to populate the database with a list of exercises.

Each exercise should have a name, description, and category
(e.g., cardio, strength, flexibility) or muscle group (e.g., chest, back, legs).
Exercises will be used to create workout plans.

---

## Workout Management

Users will be able to create their workout plans.
Workout plans should consist of multiple exercises,
each with a set number of repetitions, sets, and weights.
Users should be able to update and delete their workout plans.
Additionally, users should be able to schedule workouts for specific dates and times.

- Create Workout: Allow users to create workouts composed of multiple exercises.

- Update Workout: Allow users to update workouts and add comments.

- Delete Workout: Allow users to delete workouts.

- Schedule Workouts: Allow users to schedule workouts for specific dates and times.

- List Workouts: List active or pending workouts sorted by date and time.

- Generate Reports: Generate reports on past workouts and progress.

---

## Constraints

- Database:
  Use a relational database to store user data, workout plans, and exercise data.

- API: Develop a RESTful API to interact with the database.

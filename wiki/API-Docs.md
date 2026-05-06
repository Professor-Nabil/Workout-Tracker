- POST `/user`
  - Feature: Create new user
  - Inputs: `name`
  - Outputs: `user` `message`
  - Success: 201

- POST `/workout`
  - Feature: Create new workout plan
  - Inputs: `user id` `exercise id` `number-of-repetitions` `sets` `weights` `exercise time` `comment`
  - Outputs: `workout plan` `message`
  - Success: 201

- DELETE `/workout`
  - Feature: Delete old workout plan
  - Inputs: `user id` `workout plan id`
  - Outputs: `message`
  - Success: 204

- PUT `/workout`
  - Feature: Schedule Workouts (exercise time) | plan status
  - Inputs: `user id` `workout plan id` `date and time` | `plan status`
  - Outputs: `workout plan` `message`
  - Success: 200

- GET `/workout/list`
  - Feature: List active or pending workouts sorted by date and time.
  - Inputs: `user id` | `plan status`
  - Outputs: `workout plans` `message`
  - Success: 200

- GET `/workout/progress`
  - Feature: Generate reports on past workouts and progress.
  - Inputs: `user id`
  - Outputs: `workouts progress`
  - Success: 200

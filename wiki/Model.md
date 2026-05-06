# Data Models - Workout Tracker (Small MVP)

- User
  - id `unique` `required`
  - name `required` `string`

- Category
  - id `unique` `required`
  - name `unique` `required` `string`

- Exercise
  - id `unique` `required`
  - name `unique` `required` `string`
  - description `optional` `string`
  - category --> (Category) `required`

- Exercise plan
  - id `unique` `required`
  - exercise --> (Exercise)
  - number-of-repetitions `required` `integer`
  - sets `required` `integer`
  - weights `optional` `float`
  - exercise time `optional` `date and time`
  - comment `optional` `string`

- Plan Status
  - id `unique` `required`
  - name `unique` `required`

- Workout plans
  - id `unique` `required`
  - user --> (User)
  - exercise plan --> (Exercise plan)
  - plan status --> (Plan Status)

- Workouts Progress
  - id `unique` `required`
  - user --> (User)
  - number-of-completed-exercises `required` `integer`

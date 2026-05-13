# Request Lifecycle

- `server.ts`: (Turn on)
  - Call `app`
  - Check the `PORT`
  - Start the server
  - Listen for connections

- `app.ts`: (The brain)
  - Load global security `middlewares`
  - Check request `URL`
  - Call `routes`

- `routes`: (The gatekeeper)
  - Check request `method`
  - Check request `URL`
  - Call `controllers`

- `controllers`: (The coordinator)
  - Check request body using `zod` schemas
  - Call `services`
  - Preparing response `body`
  - Preparing response `status`
  - Return the response

- `services`: (The worker)
  - Check if user exists
  - Hash the password using `bcrypt`
  - Preparing `JWT`
  - Save the user on database using `prisma`
  - Filter the data
  - Return the data to `controllers`

- `global.error.middlewares`: (The safety net)
  - Return the standard `JSON` error response

# How invalid emails should look like

```ts
const invalidEmails = [
  "plainaddress", // No @ symbol
  "#@%^%#$@#$@#.com", // Random characters
  "@example.com", // No local part
  "Joe Smith <email@example.com>", // Extra text
  "email.example.com", // No @ symbol
  "email@example@example.com", // Multiple @ symbols
];
```

## Using Faker Module

```ts
import { faker } from "@faker-js/faker";

describe("Invalid Email Generation", () => {
  it("Should fail with various faker-generated invalid emails", async () => {
    const invalidEmails = [
      faker.lorem.word(), // Just a word: "voluptas"
      faker.internet.userName(), // Just a username: "Nabil_88"
      `${faker.lorem.word()}@`, // No domain: "test@"
      `@${faker.internet.domainName()}`, // No local part: "@google.com"
      faker.string.symbol(10), // Random symbols: "!@#$%^&*()"
      `${faker.internet.email()}@extra.com`, // Double @ symbols
    ];

    for (const email of invalidEmails) {
      const result = await request(app)
        .post("/auth/signup")
        .send({
          email,
          password: faker.internet.password({ length: 10 }),
        });

      expect(result.status).toBe(400);
      expect(result.body.message).toContain("Invalid email format");
    }
  });
});
```

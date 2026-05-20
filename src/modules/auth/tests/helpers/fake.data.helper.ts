import { faker } from "@faker-js/faker";

export const fakeUser = () => {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
};

export const fakeEmail = () => {
  return faker.internet.email();
};

export const fakePasswd = () => {
  return faker.internet.password();
};

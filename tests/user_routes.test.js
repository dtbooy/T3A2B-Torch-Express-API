import app from "../app.js";
import request from "supertest";
import bcrypt from "bcrypt";

describe("User routes", () => {
  describe("Get /users", () => {
    let res;
    beforeEach(async () => {
      res = await request(app).get("/users");
    });
    test("Returns JSON content", () => {
      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toContain("json");
    });
    test("Returns an Array", () => {
      expect(res.body).toBeInstanceOf(Array);
    });
    test("Array has 3 elements", () => {
      // Seed data has 3 elements
      expect(res.body.length).toBe(3);
    });
    test("Array contents are correct", async () => {
      // match an exact route
      expect(res.body[0].name).toBe("Test Administrator");
      // match something in a specified an element
      expect(res.body[0]).toMatchObject({
        name: "Test Administrator",
        email: "admin@example.com",
        DOB: new Date(1995, 3, 12).toISOString(),
        is_admin: true,
      });
      expect(res.body[0].reservations).toBeInstanceOf(Array);
    });
    test("Password is hashed", async () => {
      const correctPassword = await bcrypt.compare(
        "admin1234",
        res.body[0].password
      );
      expect(correctPassword).toBe(true);
      const wrongPassword = await bcrypt.compare(
        "wrongpassword",
        res.body[0].password
      );
      expect(wrongPassword).toBe(false);
    });
  });

  describe("POST / entries", () => {
    let cats;
    let res;
    beforeAll(async () => {
      // create test user
      res = await request(app).post("/users").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
    });
    afterAll(async () => {
      // clean up post from the database
      const del = await request(app).delete(`/users/${res.body._id}`);
      console.log("deleted", del.status);
    });

    test("Returrns JSON with 201 Status", () => {
      expect(res.status).toBe(201);
      expect(res.header["content-type"]).toContain("json");
    });
    test("POST Returns correct structure", () => {
      // test response has the correct structure
      expect(res.body._id).toBeDefined();
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
      expect(res.body.password).toBeDefined();
      expect(res.body.DOB).toBeDefined();
      expect(res.body.is_admin).toBeDefined();
      expect(res.body.reservations).toBeDefined();
    });
    test("POST returns the correct content", () => {
      expect(res.body.name).toBe("James Holden");
      expect(res.body.email).toBe("Holden@rocinante.com");
      //ensure password is hashed
      expect(res.body.password).not.toEqual("password");
      expect(res.body.DOB).toBe(new Date("1990-04-11").toISOString());
      expect(res.body.is_admin).toBe(false);
      expect(res.body.reservations).toBeInstanceOf(Array);
      expect(res.body.reservations.length).toBe(0);
    });
  });
});

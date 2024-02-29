import app from "../app.js";
import request from "supertest";
import bcrypt from "bcrypt";

//   let user = await request(app).post("/login").send({
//     email: "user@example.com",
//     password: "123456",
//   })
//   userToken = res.body.token

describe("User routes", () => {
  describe("Get /users with admin credentials", () => {
    let res;
    let token;
    beforeAll(async () => {
      // login & get auth token test user
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
    });

    beforeEach(async () => {
      res = await request(app).get("/users").set({ Authorization: token });
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
  describe("Get /users/:id with admin credentials", () => {
    let res;
    let token;
    let userId;
    beforeAll(async () => {
      // login & get auth token test user
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
      userId = admin.body.user._id;
    });

    beforeEach(async () => {
      res = await request(app)
        .get(`/users/${userId}`)
        .set({ Authorization: token });
    });
    test("Returns JSON content", () => {
      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toContain("json");
    });
    test("Returns correct structure", () => {
      // test response has the correct structure
      expect(res.body._id).toBeDefined();
      expect(res.body.name).toBeDefined();
      expect(res.body.email).toBeDefined();
      expect(res.body.password).toBeDefined();
      expect(res.body.DOB).toBeDefined();
      expect(res.body.is_admin).toBeDefined();
      expect(res.body.reservations).toBeDefined();
    });
    test("Array contents are correct", async () => {
      // match an exact route
      expect(res.body.name).toBe("Test Administrator");
      // match something in a specified an element
      expect(res.body).toMatchObject({
        name: "Test Administrator",
        email: "admin@example.com",
        DOB: new Date(1995, 3, 12).toISOString(),
        is_admin: true,
      });
      expect(res.body.reservations).toBeInstanceOf(Array);
    });
    test("Password is hashed", async () => {
      const correctPassword = await bcrypt.compare(
        "admin1234",
        res.body.password
      );
      expect(correctPassword).toBe(true);
      const wrongPassword = await bcrypt.compare(
        "wrongpassword",
        res.body.password
      );
      expect(wrongPassword).toBe(false);
    });
  });
  describe("POST /users ", () => {
    let res;
    let token;
    beforeAll(async () => {
      //make sure new user doesn't exist
      let check = await request(app).post("/login").send({
        email: "Holden@rocinante.com",
        password: "password",
      });
      if (check?.body?.user) {
        await request(app)
          .delete(`/users/${check.body.user._id}`)
          .set({ Authorization: check.body?.token || "none" });
      }
      // create test user
      res = await request(app).post("/users/signup").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
      token = res.body.token;
    });

    afterAll(async () => {
      // clean up post from the database
      const del = await request(app)
        .delete(`/users/${res.body.user._id}`)
        .set({ Authorization: token });
    });

    test("Returrns JSON with 201 Status", () => {
      expect(res.status).toBe(201);
      expect(res.header["content-type"]).toContain("json");
    });
    test("POST Returns correct structure", () => {
      // test response has the correct structure
      expect(res.body.user._id).toBeDefined();
      expect(res.body.user.name).toBeDefined();
      expect(res.body.user.email).toBeDefined();
      expect(res.body.user.password).toBeDefined();
      expect(res.body.user.DOB).toBeDefined();
      expect(res.body.user.is_admin).toBeDefined();
      expect(res.body.user.reservations).toBeDefined();
      expect(res.body.token).toBeDefined();
    });
    test("POST returns the correct content", () => {
      expect(res.body.user.name).toBe("James Holden");
      expect(res.body.user.email).toBe("Holden@rocinante.com");
      //ensure password is hashed
      expect(res.body.user.password).not.toEqual("password");
      expect(res.body.user.DOB).toBe(new Date("1990-04-11").toISOString());
      expect(res.body.user.is_admin).toBe(false);
      expect(res.body.user.reservations).toBeInstanceOf(Array);
      expect(res.body.user.reservations.length).toBe(0);
    });
  });
  describe("DELETE /users/:id entry - with user authority", () => {
    let res;
    let token;
    let userId;
    beforeEach(async () => {
      // Create a new user
      const testUser = await request(app).post("/users/signup").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
      token = testUser.body.token;
      userId = testUser?.body?.user?._id;
      res = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
    });

    test("Returns 204 Status & no content", async () => {
      expect(res.status).toBe(204);
    });
    test("Deletes the user from the database", async () => {
      // check user exists
      const getAfterUserResponse = await request(app)
        .get(`/users/${userId}`)
        .set({ Authorization: token });
      expect(getAfterUserResponse.status).toBe(404);
    });
    test("Returns 401 Unauthorized status code if user attached to credentials doesn't exist", async () => {
      // try to delete user again (now it does not exist)
      const secondDeleteResponse = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
      expect(secondDeleteResponse.status).toBe(401);
    });
  });
  describe("DELETE /user/:id entry with ADMIN authority", () => {
    let res;
    let token;
    let userId;
    beforeAll(async () => {
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
    });
    beforeEach(async () => {
      // Create a new user
      const testUser = await request(app).post("/users/signup").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
      userId = testUser?.body?.user?._id;
      res = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
    });

    test("Returns 204 Status & no content", async () => {
      expect(res.status).toBe(204);
    });
    test("Deletes the user from the database", async () => {
      // check user exists
      const getAfterUserResponse = await request(app)
        .get(`/users/${userId}`)
        .set({ Authorization: token });
      expect(getAfterUserResponse.status).toBe(404);
    });
    test("Returns 404 (Not Found) status code if user does not exist", async () => {
      // try to delete user again
      const secondDeleteResponse = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
      expect(secondDeleteResponse.status).toBe(404);
    });
  });
  describe("PUT /user/:id entry - user credentials", () => {
    let res;
    let token;
    let userId;
    beforeAll(async () => {
      // create test user
      res = await request(app).post("/users/signup").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
      // assign test user variables
      token = res.body.token;
      userId = res.body.user._id;
    });

    afterAll(async () => {
      // clean up post from the database
      const del = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
    });

    test("Returns 200 status code and updated user object on successful update", async () => {
      const updateUserResponse = await request(app)
        .put(`/users/${userId}`)
        .send({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          DOB: "1990-01-01",
        })
        .set({ Authorization: token });
      expect(updateUserResponse.status).toBe(200);
      expect(updateUserResponse.header["content-type"]).toContain("json");
      expect(updateUserResponse.status).toBe(200);
      expect(updateUserResponse.body.name).toBe("Jane Smith");
      expect(updateUserResponse.body.email).toBe("jane.smith@example.com");
      expect(updateUserResponse.body.DOB).toBe(
        new Date("1990-01-01").toISOString()
      );
    });
    test("Returns 404 status code if user does not exist", async () => {
      const nonExistentUserId = "5f3dd8318adac102d8a8e801";
      const updateUserResponse = await request(app)
        .put(`/users/${nonExistentUserId}`)
        .send({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          DOB: "1990-01-01",
        })
        .set({ Authorization: token });
      expect(updateUserResponse.status).toBe(404);
    });
  });
  describe("PUT /user/:id entry - Admin credentials", () => {
    let res;
    let token;
    let userId;
    beforeAll(async () => {
      // create test user
      res = await request(app).post("/users/signup").send({
        name: "James Holden",
        email: "Holden@rocinante.com",
        password: "password",
        DOB: "1990-04-11",
      });
      // assign test user variables
      userId = res.body.user._id;
      // login & get auth token test user
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
    });

    afterAll(async () => {
      // clean up post from the database
      const del = await request(app)
        .delete(`/users/${userId}`)
        .set({ Authorization: token });
    });

    test("Returns 200 status code and updated user object on successful update", async () => {
      const updateUserResponse = await request(app)
        .put(`/users/${userId}`)
        .send({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          DOB: "1990-01-01",
        })
        .set({ Authorization: token });
      expect(updateUserResponse.status).toBe(200);
      expect(updateUserResponse.header["content-type"]).toContain("json");
      expect(updateUserResponse.body.name).toBe("Jane Smith");
      expect(updateUserResponse.body.email).toBe("jane.smith@example.com");
      expect(updateUserResponse.body.DOB).toBe(
        new Date("1990-01-01").toISOString()
      );
    });
    test("Returns 404 status code if user does not exist", async () => {
      const nonExistentUserId = "5f3dd8318adac102d8a8e801";
      const updateUserResponse = await request(app)
        .put(`/users/${nonExistentUserId}`)
        .send({
          name: "Jane Smith",
          email: "jane.smith@example.com",
          DOB: "1990-01-01",
        })
        .set({ Authorization: token });
      expect(updateUserResponse.status).toBe(404);
    });
  });
});

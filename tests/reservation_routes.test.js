import app from "../app.js";
import request from "supertest";

describe("Reservations routes", () => {
  describe("GET /reservations, with admin credentials", () => {
    let res;
    let token;
    beforeAll(async () => {
      // login & get auth token admin user
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
    });

    beforeEach(async () => {
      res = await request(app)
        .get("/reservations")
        .set({ Authorization: token });
    });

    test("Returns JSON content", () => {
      expect(res.status).toBe(200);
      expect(res.header["content-type"]).toContain("json");
    });
    test("Returns an Array", () => {
      expect(res.body).toBeInstanceOf(Array);
    });
    test("Array contents are correct", async () => {
      // match something in a specified an element
      expect(res.body[0]).toMatchObject({
        user: {
          name: "Test Administrator",
          email: "admin@example.com",
          DOB: "1995-04-11T14:00:00.000Z",
          is_admin: true,
          __v: 0,
        },
        busService: {
          busNumber: 123,
          collectionTime: "2032-08-22T21:30:00.000Z",
          estimatedTravelTime: 30,
          capacity: 40,
          __v: 0,
        },
        __v: 0,
      });
    });
  });
  describe("GET /reservations, with user credentials", () => {
    let res;
    let token;
    beforeAll(async () => {
      // login & get auth token user
      let user = await request(app).post("/login").send({
        email: "user@example.com",
        password: "123456",
      });
      token = user.body.token;
    });
    beforeEach(async () => {
      res = await request(app)
        .get("/reservations")
        .set({ Authorization: token });
    });
    test("Returns 403 Status (Forbidden", () => {
      expect(res.status).toBe(403);
    });
  });
  describe("POST /reservations, with admin credentials", () => {
    let res;
    let token;
    let reservationId;
    let users;
    let services;
    beforeAll(async () => {
      // login & get admin auth token
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;
      // get users
      users = await request(app).get("/users/").set({ Authorization: token });
      // get services
      services = await request(app)
        .get("/services/")
        .set({ Authorization: token });

      // create test reservation
      res = await request(app)
        .post("/reservations/")
        .send({
          user: users.body[0]._id,
          busService: services.body[0]._id,
          numberOfTickets: 1,
        })
        .set({ Authorization: token });

      reservationId = res.body[0]._id;
    });

    afterAll(async () => {
      // clean up post from the database
      const del = await request(app)
        .delete(`/reservations/${reservationId}`)
        .set({ Authorization: token });
    });
    test("Returrns JSON with 201 Status", () => {
      expect(res.status).toBe(201);
      expect(res.header["content-type"]).toContain("json");
    });
    test("POST Returns correct structure", () => {
      // test response has the correct structure
      expect(res.body[0]._id).toBeDefined();
      expect(res.body[0].busService).toBeDefined();
      expect(res.body[0].user).toBeDefined();
    });
    test("POST Returns correct data", () => {
      expect(res.body[0].busService).toBe(services.body[0]._id);
      expect(res.body[0].user).toBe(users.body[0]._id);
    });
  });

  describe("DELETE /reservation entry with admin credentials", () => {
    let res;
    let token;
    let reservationId;
    let users;
    let services;
    beforeAll(async () => {
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      // set credentials
      token = admin.body.token;

      // get users
      users = await request(app).get("/users/").set({ Authorization: token });
      // get services
      services = await request(app)
        .get("/services/")
        .set({ Authorization: token });
    });
    beforeEach(async () => {
      // create test reservation
      res = await request(app)
        .post("/reservations/")
        .send({
          user: users.body[0]._id,
          busService: services.body[0]._id,
          numberOfTickets: 1,
        })
        .set({ Authorization: token });

      reservationId = res.body[0]._id;

      // delete test reservation
      res = await request(app)
        .delete(`/reservations/${reservationId}`)
        .set({ Authorization: token });
    });
    test("Returns 204 Status & no content", async () => {
      expect(res.status).toBe(204);
    });
    test("Deletes the reservation from the database", async () => {
      // check reservation exists
      const getAfterDeleteResponse = await request(app)
        .get(`/reservations/${reservationId}`)
        .set({ Authorization: token });
      expect(getAfterDeleteResponse.status).toBe(404);
    });
    test("Returns 404 (Not Found) status code if reservation ID does not exist", async () => {
      // try to delete reservation again
      const secondDeleteResponse = await request(app)
        .delete(`/reservations/${reservationId}`)
        .set({ Authorization: token });
      expect(secondDeleteResponse.status).toBe(404);
    });
    test("Returns 401 (unauthorised) status code if no credentials", async () => {
      // try to delete reservation without credentials
      const secondDeleteResponse = await request(app).delete(
        `/reservations/${reservationId}`
      );
      expect(secondDeleteResponse.status).toBe(401);
    });
    test("Returns 404 (Not found) status code if reservation ID (user credentials)", async () => {
      let user = await request(app).post("/login").send({
        email: "user@example.com",
        password: "123456",
      });

      let userToken = user.body.token;
      // try to delete reservation
      const secondDeleteResponse = await request(app)
        .delete(`/reservations/${reservationId}`)
        .set({ Authorization: userToken });
      expect(secondDeleteResponse.status).toBe(404);
    });
  });
});

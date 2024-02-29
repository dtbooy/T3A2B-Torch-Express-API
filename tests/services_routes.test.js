import app from "../app.js";
import request from "supertest";

//   let user = await request(app).post("/login").send({
//     email: "user@example.com",
//     password: "123456",
//   })
//   userToken = res.body.token

describe("Services routes", () => {
  describe("GET /services, with admin credentials", () => {
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
      res = await request(app).get("/services").set({ Authorization: token });
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
        busNumber: 123,
        collectionTime: "2032-08-22T23:30:00.000Z",
        estimatedTravelTime: 30,
        pickupLocation: {
          _id: "65dee0e3300975a439fea05a",
          name: "South Bank",
          address: "40 Melbourne St, Southbank QLD 4101",
          directions:
            "Cultural Center Bus Station on the corner of Melbourne St and Grey St",
          __v: 0,
        },
        dropoffLocation: {
          _id: "65dee0e3300975a439fea05e",
          name: "Queensland Tennis Center",
          address: "40 Castlemaine St, Milton QLD 4064",
          directions: "Drop off point at 40 Castlemaine St",
          __v: 0,
        },
        capacity: 40,
      });
      expect(res.body[0].reservations).toBeInstanceOf(Array);
    });
  });
  describe("GET /services, with user credentials", () => {
    let res;
    let token;
    beforeAll(async () => {
      // login & get auth token test user
      let user = await request(app).post("/login").send({
        email: "user@example.com",
        password: "123456",
      });
      token = user.body.token;
    });
    beforeEach(async () => {
      res = await request(app).get("/services").set({ Authorization: token });
    });
    test("Returns status 403 forbibben", () => {
      expect(res.status).toBe(403);
    });
  });

  describe("POST /services with admin credentials", () => {
    let res;
    let token;
    let locs;
    beforeAll(async () => {
      // login & get admin auth token
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      token = admin.body.token;

      // get location ids
      locs = await request(app)
        .get("/locations/")
        .set({ Authorization: token });

      // create test service
      res = await request(app)
        .post("/services/")
        .send({
          busNumber: 666,
          collectionTime: new Date(2032, 7, 30).toISOString(),
          estimatedTravelTime: 50,
          pickupLocation: locs.body[0]._id,
          dropoffLocation: locs.body[1]._id,
          capacity: 50,
        })
        .set({ Authorization: token });
    });

    afterAll(async () => {
      // clean up post from the database
      const del = await request(app)
        .delete(`/services/${res.body._id}`)
        .set({ Authorization: token });
    });
    test("Returrns JSON with 201 Status", () => {
      expect(res.status).toBe(201);
      expect(res.header["content-type"]).toContain("json");
    });
    test("POST Returns correct structure", () => {
      // test response has the correct structure
      expect(res.body.busNumber).toBeDefined();
      expect(res.body._id).toBeDefined();
      expect(res.body.collectionTime).toBeDefined();
      expect(res.body.estimatedTravelTime).toBeDefined();
      expect(res.body.pickupLocation).toBeDefined();
      expect(res.body.dropoffLocation).toBeDefined();
      expect(res.body.capacity).toBeDefined();
      expect(res.body.reservations).toBeDefined();
    });
    test("POST Returns correct data", () => {
      expect(res.body.busNumber).toBe(666);
      expect(res.body.collectionTime).toBe(new Date(2032, 7, 30).toISOString());
      expect(res.body.estimatedTravelTime).toBe(50);
      expect(res.body.capacity).toBe(50);
      expect(res.body.reservations).toBeInstanceOf(Array);
      expect(res.body.reservations.length).toBe(0);
    });
  });

  describe("DELETE /services entry with admin credentials", () => {
    let res;
    let token;
    let serviceId;
    let locs;
    beforeAll(async () => {
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      // set credentials
      token = admin.body.token;
      // get location ids
      locs = await request(app)
        .get("/locations/")
        .set({ Authorization: token });
    });
    beforeEach(async () => {
      // Create a test Service
      const testService = await request(app)
        .post("/services/")
        .send({
          busNumber: 666,
          collectionTime: new Date(2032, 7, 30).toISOString(),
          estimatedTravelTime: 50,
          pickupLocation: locs.body[0]._id,
          dropoffLocation: locs.body[1]._id,
          capacity: 50,
        })
        .set({ Authorization: token });

      serviceId = testService?.body?._id;

      // delete service
      res = await request(app)
        .delete(`/services/${serviceId}`)
        .set({ Authorization: token });
    });

    test("Returns 204 Status & no content", async () => {
      expect(res.status).toBe(204);
    });
    test("Deletes the service from the database", async () => {
      // check user exists
      const getAfterUserResponse = await request(app)
        .get(`/services/${serviceId}`)
        .set({ Authorization: token });
      expect(getAfterUserResponse.status).toBe(404);
    });
    test("Returns 404 (Not Found) status code if user does not exist", async () => {
      // try to delete user again
      const secondDeleteResponse = await request(app)
        .delete(`/services/${serviceId}`)
        .set({ Authorization: token });
      expect(secondDeleteResponse.status).toBe(404);
    });
    test("Returns 401 (unauthorised) status code if no credentials", async () => {
      // try to delete user without credentials
      const secondDeleteResponse = await request(app).delete(
        `/services/${serviceId}`
      );
      expect(secondDeleteResponse.status).toBe(401);
    });
    test("Returns 403 (forbidden) status code if user credentials", async () => {
      let user = await request(app).post("/login").send({
        email: "user@example.com",
        password: "123456",
      });

      let userToken = user.body.token;
      // try to delete user again
      const secondDeleteResponse = await request(app)
        .delete(`/services/${serviceId}`)
        .set({ Authorization: userToken });
      expect(secondDeleteResponse.status).toBe(403);
    });
  });

  describe("PUT / routes - user credentials", () => {
    let res;
    let token;
    let serviceId;
    let locs;
    beforeAll(async () => {
      let admin = await request(app).post("/login").send({
        email: "admin@example.com",
        password: "admin1234",
      });
      // set credentials
      token = admin.body.token;
      // get location ids
      locs = await request(app)
        .get("/locations/")
        .set({ Authorization: token });
    });
    beforeEach(async () => {
      // Create a test Service
      const testService = await request(app)
        .post("/services/")
        .send({
          busNumber: 666,
          collectionTime: new Date(2032, 7, 30).toISOString(),
          estimatedTravelTime: 50,
          pickupLocation: locs.body[0]._id,
          dropoffLocation: locs.body[1]._id,
          capacity: 50,
        })
        .set({ Authorization: token });
      serviceId = testService.body._id;
    });
    afterAll(async () => {
      // delete service
      res = await request(app)
        .delete(`/services/${serviceId}`)
        .set({ Authorization: token });
    });

    test("Returns 200 status code and updated service object on successful update", async () => {
      const updateServiceResponse = await request(app)
        .put(`/services/${serviceId}`)
        .send({
          busNumber: 777,
          collectionTime: new Date(2032, 8, 30).toISOString(),
          estimatedTravelTime: 10,
        })
        .set({ Authorization: token });
      expect(updateServiceResponse.status).toBe(200);
      expect(updateServiceResponse.header["content-type"]).toContain("json");
      expect(updateServiceResponse.body.busNumber).toBe(777);
      expect(updateServiceResponse.body.collectionTime).toBe(
        new Date(2032, 8, 30).toISOString()
      );
      expect(updateServiceResponse.body.estimatedTravelTime).toBe(10);
    });

    test("Returns 404 status code if service does not exist", async () => {
      const nonExistentServiceId = "5f3dd8318adac102d8a8e801";
      const updateServiceResponse = await request(app)
        .put(`/users/${nonExistentServiceId}`)
        .send({
          busNumber: 777,
          collectionTime: new Date(2032, 8, 30).toISOString(),
          estimatedTravelTime: 10,
        })
        .set({ Authorization: token });
      expect(updateServiceResponse.status).toBe(404);
    });
  });
});

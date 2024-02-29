import app from "../app.js";
import request from "supertest";

describe("Location routes", () => {
  describe("GET /locations, with admin credentials", () => {
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
      res = await request(app).get("/locations").set({ Authorization: token });
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
        _id: "65dee0e3300975a439fea05a",
        name: "South Bank",
        address: "40 Melbourne St, Southbank QLD 4101",
        directions:
          "Cultural Center Bus Station on the corner of Melbourne St and Grey St",
        __v: 0,
      });
    });
    describe("GET /locations, with user credentials", () => {
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
          .get("/locations")
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
          _id: "65dee0e3300975a439fea05a",
          name: "South Bank",
          address: "40 Melbourne St, Southbank QLD 4101",
          directions:
            "Cultural Center Bus Station on the corner of Melbourne St and Grey St",
          __v: 0,
        });
      });
    });
    describe("POST /locations with admin credentials", () => {
      let res;
      let token;
      let locId;
      beforeAll(async () => {
        // login & get admin auth token
        let admin = await request(app).post("/login").send({
          email: "admin@example.com",
          password: "admin1234",
        });
        token = admin.body.token;

        // create test location
        res = await request(app)
          .post("/locations/")
          .send({
            name: "Test Location",
            address: "An Address, that is in, qld, 4101",
            directions: "A description of the location and directions",
          })
          .set({ Authorization: token });
        locId = res.body._id;
      });

      afterAll(async () => {
        // clean up post from the database
        const del = await request(app)
          .delete(`/locations/${locId}`)
          .set({ Authorization: token });
      });
      test("Returrns JSON with 201 Status", () => {
        expect(res.status).toBe(201);
        expect(res.header["content-type"]).toContain("json");
      });
      test("POST Returns correct structure", () => {
        // test response has the correct structure
        expect(res.body._id).toBeDefined();
        expect(res.body.name).toBeDefined();
        expect(res.body.address).toBeDefined();
        expect(res.body.directions).toBeDefined();
      });
      test("POST Returns correct data", () => {
        expect(res.body.name).toBe("Test Location");
        expect(res.body.address).toBe("An Address, that is in, qld, 4101");
        expect(res.body.directions).toBe(
          "A description of the location and directions"
        );
      });
    });

    describe("DELETE /locations entry with admin credentials", () => {
      let res;
      let token;
      let locId;
      beforeAll(async () => {
        let admin = await request(app).post("/login").send({
          email: "admin@example.com",
          password: "admin1234",
        });
        // set credentials
        token = admin.body.token;
      });
      beforeEach(async () => {
        // Create a test location
        const testLoc = await request(app)
          .post("/locations/")
          .send({
            name: "Test Location",
            address: "An Address, that is in, qld, 4101",
            directions: "A description of the location and directions",
          })
          .set({ Authorization: token });

        locId = testLoc?.body?._id;

        // delete test location
        res = await request(app)
          .delete(`/locations/${locId}`)
          .set({ Authorization: token });
      });
      test("Returns 204 Status & no content", async () => {
        expect(res.status).toBe(204);
      });
      test("Deletes the location from the database", async () => {
        // check location exists
        const getAfterDeleteResponse = await request(app)
          .get(`/locations/${locId}`)
          .set({ Authorization: token });
        expect(getAfterDeleteResponse.status).toBe(404);
      });
      test("Returns 404 (Not Found) status code if user does not exist", async () => {
        // try to delete location again
        const secondDeleteResponse = await request(app)
          .delete(`/locations/${locId}`)
          .set({ Authorization: token });
        expect(secondDeleteResponse.status).toBe(404);
      });
      test("Returns 401 (unauthorised) status code if no credentials", async () => {
        // try to delete user without credentials
        const secondDeleteResponse = await request(app).delete(
          `/locations/${locId}`
        );
        expect(secondDeleteResponse.status).toBe(401);
      });
      test("Returns 403 (forbidden) status code if user credentials", async () => {
        let user = await request(app).post("/login").send({
          email: "user@example.com",
          password: "123456",
        });

        let userToken = user.body.token;
        // try to delete location
        const secondDeleteResponse = await request(app)
          .delete(`/locations/${locId}`)
          .set({ Authorization: userToken });
        expect(secondDeleteResponse.status).toBe(403);
      });
    });

    describe("PUT /locations entry - admin credentials", () => {
      let res;
      let token;
      let locId;
      beforeAll(async () => {
        let admin = await request(app).post("/login").send({
          email: "admin@example.com",
          password: "admin1234",
        });
        // set credentials
        token = admin.body.token;
      });
      beforeEach(async () => {
        // Create a test location
        const testLoc = await request(app)
          .post("/locations/")
          .send({
            name: "Test Location",
            address: "An Address, that is in, qld, 4101",
            directions: "A description of the location and directions",
          })
          .set({ Authorization: token });

        locId = testLoc?.body?._id;
      });
      afterAll(async () => {
        // delete test location
        res = await request(app)
          .delete(`/locations/${locId}`)
          .set({ Authorization: token });
      });

      test("Returns 200 status code and updated location object on successful update", async () => {
        const updateLocResponse = await request(app)
          .put(`/locations/${locId}`)
          .send({
            name: "UPDATED Test Location",
            address: "UPDATED An Address, that is in, qld, 4101",
          })
          .set({ Authorization: token });
        expect(updateLocResponse.status).toBe(200);
        expect(updateLocResponse.header["content-type"]).toContain("json");
        expect(updateLocResponse.body.name).toBe("UPDATED Test Location");
        expect(updateLocResponse.body.address).toBe(
          "UPDATED An Address, that is in, qld, 4101"
        );
        expect(updateLocResponse.body.directions).toBe(
          "A description of the location and directions"
        );
      });

      test("Returns 404 status code if location does not exist", async () => {
        const nonExistentLocId = "5f3dd8318adac102d8a8e801";
        const updateLocResponse = await request(app)
          .put(`/users/${nonExistentLocId}`)
          .send({
            name: "Test Location",
            address: "An Address, that is in, qld, 4101",
            directions: "A description of the location and directions",
          })
          .set({ Authorization: token });
        expect(updateLocResponse.status).toBe(404);
      });
    });
  });
});

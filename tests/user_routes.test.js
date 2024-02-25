import app from "../app.js";
import request from "supertest"
import bcrypt from 'bcrypt'

describe("User routes", () => {
    describe("Get /users", () => {
        let res
        beforeEach(async ()=>{
            res = await request(app).get("/users")
        })
        test("Returns JSON content", () => {
                expect(res.status).toBe(200) 
                expect(res.header["content-type"]).toContain("json")
        })
        test("Returns an Array", () => {
                expect(res.body).toBeInstanceOf(Array)
        })
        test("Array has 3 elements", () => {
                // Seed data has 3 elements
                expect(res.body.length).toBe(3)
        })
        test("Array contents are correct", async () =>  {
            // password: "admin1234",
            // reservations: [],
            // await bcrypt.compare(password, user.password)
            // match an exact route 
            expect(res.body[0].name).toBe("Test Administrator")
            // match something in a specified an element  
            expect(res.body[0]).toMatchObject({ 
            name: "Test Administrator",
            email: "admin@example.com",
            DOB: new Date(1995, 3, 12).toISOString(),
            is_admin: true,
            })
            expect(res.body[0].reservations).toBeInstanceOf(Array)

        })
        test("Password is hashed", async () =>  {
            const correctPassword = await bcrypt.compare("admin1234", res.body[0].password)
            expect(correctPassword).toBe(true)
            const wrongPassword = await bcrypt.compare("wrongpassword", res.body[0].password)
            expect(wrongPassword).toBe(false)

        })
    })
})

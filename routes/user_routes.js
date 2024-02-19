import express from "express";
import { User } from "../db.js";

const userRouter = express.Router();


// /users - GET
// Get all users
userRouter.get("/", async (req, res) => {
    try {
        res.status(200).send(await User.find().exec())
    } catch (err) {
        res.status(500).send(err)
    }
})

// /users - POST

// /users/:id - GET

// /users/:id  - PUT

// /users/:id – DELETE

// /users/:id/reservations - GET

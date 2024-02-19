import express from "express";
import { User } from "../db.js";

const userRoutes = express.Router();


// /users - GET
// Get all users
userRoutes.get("/", async (req, res) => {
    try {
        res.status(200).send(await User.find().exec())
    } catch (err) {
        res.status(500).send({ error: err })
    }
})

// /users - POST
userRoutes.post("/", async (req, res) => {
    try {
        const newUser = await User.create(req.body)
        res.status(201).send(newUser)
    } catch (err) {
        res.status(500).send({ error: err })
    }
})

// /users/:id - GET
userRoutes.get("/:id", async (req, res) => {
    res.status(200).send(
        await User.findById(req.params.id).exec()
        .catch((err) => { 
            res.status(404).send({ error: err })
        })
    )
});


// /users/:id  - PUT


// /users/:id – DELETE


// /users/:id/reservations - GET



export default userRoutes
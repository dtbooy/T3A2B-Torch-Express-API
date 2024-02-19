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


// /users/:id - PUT
userRoutes.put("/:id", async (req, res) => {
    try {
      // findByIdAndUpdate
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      // res with newEntry, 200
      if (updatedUser) {
        res.send(updatedUser);
      } else {
        res.status(404).send({ error: "Entry not found" });
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  })


// /users/:id – DELETE
userRoutes.delete("/:id", async (req, res) => {
    try {
      // 
      const deletedUser = await User.findByIdAndDelete(req.params.id);
      // res with 204 (No content)
      if (deletedUser) {
        res.sendStatus(204);
      } else {
        res.status(404).send({ error: "Entry not found" });
      }
    } catch (err) {
      res.status(500).send({ error: err.message });
    }
  });
  

// /users/:id/reservations - GET


export default userRoutes
import express from "express";
import { Reservation, User } from "../db.js"
import bcrypt from "bcrypt"

// change when in production
// const salt = bcrypt.genSaltSync(10)
const salt = 10

const userRoutes = express.Router()


// /users - GET
// Get all users
userRoutes.get("/", async (req, res) => {
    try {
        res.status(200).send(await User.find().exec())
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// /users - POST
userRoutes.post("/signup", async (req, res) => {
    try {
        const { email, password, name, DOB} = req.body
        const user = await User.findOne({ email: email })

        if (user) {
          return res.status(409).json({ error: "User already exists" });
      }
        const hash = await bcrypt.hash(password, salt)

        const newUser = await User.create({
          name,
          email,
          password: hash,
          DOB,
          is_admin: false,
          reservations: []
        })
        
        res.status(201).send(newUser)
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// /users/:id - GET
userRoutes.get("/:id", async (req, res) => {
    res.status(200).send(
        await User.findById(req.params.id).exec()
        .catch((err) => { 
            res.status(404).send({ error: err.message })
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
userRoutes.get("/:id/reservations", async (req, res) => {
  try {
      const userData = await Reservation.find({ user: req.params.id }).populate("busService")
      res.status(200).send(userData)
  } catch (err) {
      res.status(500).send({error: err.message});
  }
})


export default userRoutes
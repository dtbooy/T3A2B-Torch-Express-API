import express from "express";
import { Reservation, User } from "../db.js"
import bcrypt from "bcrypt"
import { verifyAdmin, verifyUser } from "./auth.js";
import jwt from 'jsonwebtoken'

// change when in production
// const salt = bcrypt.genSaltSync(10)
const salt = 10

const userRoutes = express.Router()


// /users - GET
// Get all users - Auth(Admin only)
userRoutes.get("/", verifyAdmin, async (req, res) => {
    try {
        res.status(200).send(await User.find().exec())
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// /users - POST Auth(open)
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
        const token = jwt.sign({ userId: newUser._id, is_admin: newUser.is_admin, email: newUser.email }, process.env.SECRET_TOKEN, {expiresIn: '12h'})
        res.status(201).send({user: newUser, token})
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

// /users/:id - GET - ---------------------------------------------------NOT used
userRoutes.get("/:id", async (req, res) => {
  try {
      const user = await User.findById(req.params.id)
      if (user) {
          res.status(200).send(user);
      } else {
          res.status(404).send({ error: "User not found" })
      }
  } catch (err) {
      res.status(500).send({ error: err.message })
  }
})



// /users/:id - PUT Auth(user+Admin)
userRoutes.put("/:id", verifyUser, async (req, res) => {
    try {
      if (req.body.password) {
        const hash = await bcrypt.hash(req.body.password, salt)
        req.body.password = hash
      }
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


// /users/:id – DELETE - Auth(user+Admin)
userRoutes.delete("/:id", verifyUser, async (req, res) => {
  try {
      const user = await User.findById(req.params.id)

      if (!user) {
          return res.status(404).send({ error: "User not found" })
      }
      await Reservation.deleteMany({ user: user._id })
      await User.findByIdAndDelete(req.params.id)


      res.status(204).send({success: 'Location deleted'})
  } catch (err) {
      res.status(500).send({ error: err.message })
  }
})
  

// /users/:id/reservations - GET - Auth(user+admin)
userRoutes.get("/:id/reservations", verifyUser, async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.params.id })
      .populate("user")
      .populate({
        path: 'busService',
        populate: [
          { path: 'pickupLocation', model: 'Location' },
          { path: 'dropoffLocation', model: 'Location' }
        ]
      })
      .lean();

    res.status(200).send(reservations);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});


export default userRoutes
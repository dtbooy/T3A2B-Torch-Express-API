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
userRoutes.post("/", async (req, res) => {
  const errors = {}
    try {
      const { email, password, name, DOB} = req.body
      const fieldsToValidate = { email, password, name, DOB }

      const user = await User.findOne({ email: email })

        if (user) {
          errors.email = "You've already made an account"
      }

      for (let field in fieldsToValidate) {
        if (!fieldsToValidate[field]) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
        }
      } 
      // If any errors exist, return 400 Bad Request with error details
      if (Object.keys(errors).length > 0) {
          return res.status(400).json({ errors })
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
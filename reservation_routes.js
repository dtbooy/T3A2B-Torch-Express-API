import { Router } from "express";
import {Reservation} from "./db.js";

const router = Router()

// Get All Reservations 
router.get('/', async (req, res) => res.send(await Reservation.find()))

// Get Reservation by ID 

// Create new Reservation

// Delete Reservation

export default router
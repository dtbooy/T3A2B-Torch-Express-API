import { Router } from "express";
import {Reservation} from "../db.js";

const router = Router()

// Get All Reservations 
router.get('/', async (req, res) => {
    try {
        const all_reservations = await Reservation.find()
        res.status(200).send(all_reservations)
    } catch (err) {
        res.status(500).send({error : err.message})
    }
})

// Get Reservation by ID 
router.get('/:id', async (req, res) => {
    try {
        const single_reservation = await Reservation.findById(req.params.id)
    if(single_reservation) {
        res.send(single_reservation)
    } else (
        res.status(404).send({error: 'Reservation not found '})
    )
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Create new Reservation
router.post('/', async (req, res) => {
    try{
        const newReservation = await (Reservation.create(req.body))
        res.status(201).send(newReservation)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})


// Delete Reservation
router.delete('/:id', async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id)
        if (deletedReservation){
            res.status(204).send({success: 'Reservation deleted'})
        } else {
            res.status(404).send({error: 'Reservation not found'})
        }

    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

export default router
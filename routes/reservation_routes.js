import { Router } from "express";
import {BusService, Reservation, User} from "../db.js";

const router = Router()

// Get All Reservations 
router.get('/', async (req, res) => {
    try {
        const all_reservations = await Reservation.find().populate('busService')
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
    try {
        const newReservation = await Reservation.create(req.body);

        // Update the user document with the new reservation
        await User.findByIdAndUpdate(
            { _id: req.body.user},
            { $push: { reservations: newReservation._id } }
        ).exec();

        // Update the bus service document with the new reservation
        await BusService.findByIdAndUpdate(
            { _id: req.body.busService },
            { $push: { reservations: newReservation._id } }
        ).exec();

        res.status(201).send(newReservation);
    } catch (err) {
        res.status(500).send({ error: err.message });
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
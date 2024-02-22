import { Router } from "express";
import {BusService, Reservation, User} from "../db.js";
import { mongoose } from "mongoose";

const router = Router()

// Get All Reservations 
router.get('/', async (req, res) => {
    try {
        const all_reservations = await Reservation.find().populate('busService').populate('user')
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
    // create new reservations array
    let reservations = []
    for (let i = 0 ; i < req.body.numberOfTickets; i++) {
        reservations.push({
            user: new mongoose.Types.ObjectId(req.body.user),
            busService: new mongoose.Types.ObjectId(req.body.busService)
        })
    }
    console.log(reservations)
    try {
        const newReservations = await Reservation.insertMany(reservations);
        //get array of ids of new reservations
        const ids = newReservations.map(res => res._id);
        // Update the user document with the new reservations
        await User.findByIdAndUpdate(
            { _id: req.body.user},
            { $push: { reservations: {$each: ids }} }
        ).exec();

        // Update the bus service document with the new reservations
        await BusService.findByIdAndUpdate(
            { _id: req.body.busService },
            { $push: { reservations: {$each: ids }} }
        ).exec();

        res.status(201).send(newReservations);
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
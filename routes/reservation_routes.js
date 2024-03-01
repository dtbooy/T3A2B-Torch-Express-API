import { Router } from "express";
import {BusService, Reservation, User} from "../db.js";
import { mongoose } from "mongoose";
import { verifyAdmin, verifyUser } from "./auth.js";

const router = Router()

// Get All Reservations - Auth(Admin only)
router.get('/', verifyAdmin, async (req, res) => {
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

// Create new Reservation - Auth (user & admin)
router.post('/', verifyUser, async (req, res) => {
    try {
        const existingTickets = await Reservation.find({user: req.body.user, busService: req.body.busService})
        // console.log("tickets", existingTickets.length)
        if (existingTickets.length + parseInt(req.body.numberOfTickets) > 10 ){
            throw new Error(`User has ${existingTickets.length} tickets booked, maximum allowed is 10.`)
        }
        // create new reservations array
        let reservations = []
        for (let i = 0 ; i < parseInt(req.body.numberOfTickets); i++) {
            reservations.push({
                user: req.body.user,
                busService: req.body.busService
            })
        }


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
        res.status(400).send({ error: err.message });
    }
})

// Delete Reservation - Auth(user & Admin)
router.delete('/:id', verifyUser, async (req, res) => {
    try {
        const deletedReservation = await Reservation.findByIdAndDelete(req.params.id)
        if (deletedReservation) {
            // Remove reservation ID from corresponding bus service
            await BusService.updateOne(
                { _id: deletedReservation.busService }, // Filter by busService ID
                { $pull: { reservations: deletedReservation._id } } // Remove reservation ID from the array
            )
            await User.updateOne(
                { _id: deletedReservation.user }, // Filter by User ID
                { $pull: { reservations: deletedReservation._id } } // Remove reservation ID from the array
            )
            res.status(204).send({ success: 'Reservation deleted' })
        } else {
            res.status(404).send({ error: 'Reservation not found' })
        }
    } catch (err) {
        res.status(500).send({ error: err.message })
    }
})

export default router
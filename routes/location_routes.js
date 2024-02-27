import { Router } from "express";
import {Location} from "../db.js";
import { verifyAdmin } from "./auth.js";

const router = Router()

// Get all locations
router.get('/', async (req, res) => {
    try {
        const all_locations = await Location.find()
        res.status(200).send(all_locations)
    } catch (err) {
        res.status(500).send({error : err.message})
    }
})

// Get location by id 
router.get('/:id', async (req, res) => {
    try {
        const single_location = await Location.findById(req.params.id)
    if(single_location) {
        res.send(single_location)
    } else (
        res.status(404).send({error: 'Location not found '})
    )
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})


// Create a new location (ADMIN ONLY)
router.post('/', verifyAdmin, async (req, res) => {
    try{
        const instertedLocation = await (Location.create(req.body))
        res.status(201).send(instertedLocation)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Update a location (ADMIN ONLY)
router.put('/:id', verifyAdmin, async (req, res) => {
    try {
        const updatedLocation = await Location.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updatedLocation) {
            res.send(updatedLocation)
        } else {
            res.status(404).send({error: 'Location not found'})
        }
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Delete a location (ADMIN ONLY)
router.delete('/:id', verifyAdmin, async (req, res) => {
    try {
        const deletedLocation = await Location.findByIdAndDelete(req.params.id)
        if (deletedLocation){
            res.status(204).send({success: 'Location deleted'})
        } else {
            res.status(404).send({error: 'Location not found'})
        }

    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

export default router
import { Router } from "express";
import {BusService} from "../db.js";

const servicesRoutes = Router()

// Search bus routes
servicesRoutes.get('/search', async (req, res) => {
    /* query params
    date = YYYY-MM-DD
    pickup = id
    dropoff = id
    */

    try {
        let services = await BusService.find({
            pickupLocation: req.query.pickup, 
            dropoffLocation: req.query.dropoff, 
            // between date given 12:00Am and 12:am next day
            collectionTime: {
                $gte: new Date(Date.parse(req.query.date)), 
                $lt: new Date(Date.parse(req.query.date) + 86400000)
            }}).exec();

    if(services) {
        res.send(services)
    } else (
        res.status(404).send({error: 'No Service found '})
    )
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Get all Bus Services
servicesRoutes.get('/', async (req, res) => {
    try {
        const allServices = await BusService.find()
        res.status(200).send(allServices)
    } catch (err) {
        res.status(500).send({error : err.message})
    }
})

// Get Bus Service by id 
servicesRoutes.get('/:id', async (req, res) => {
    try {
        const service = await BusService.findById(req.params.id)
    if(service) {
        res.send(service)
    } else (
        res.status(404).send({error: 'Service not found '})
    )
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})


// Create a new Bus Service (ADMIN ONLY)
servicesRoutes.post('/', async (req, res) => {
    try{
        const newService = await (BusService.create(req.body))
        res.status(201).send(newService)
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Update a Bus Service (ADMIN ONLY)
servicesRoutes.put('/:id', async (req, res) => {
    try {
        const updatedService = await BusService.findByIdAndUpdate(req.params.id, req.body, { new: true })
        if (updatedService) {
            res.send(updatedService)
        } else {
            res.status(404).send({error: 'Service not found'})
        }
    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

// Delete a Bus Service (ADMIN ONLY)
servicesRoutes.delete('/:id', async (req, res) => {
    try {
        const deletedService = await BusService.findByIdAndDelete(req.params.id)
        if (deletedService){
            res.status(204).send({success: 'Service deleted'})
        } else {
            res.status(404).send({error: 'Service not found'})
        }

    } catch (err) {
        res.status(500).send({error: err.message})
    }
})

export default servicesRoutes
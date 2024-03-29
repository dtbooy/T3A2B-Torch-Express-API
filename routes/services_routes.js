import { Router } from "express";
import { BusService, Reservation } from "../db.js";
import mongoose from "mongoose";
import { verifyAdmin } from "./auth.js";

const servicesRoutes = Router();

// Search bus routes
servicesRoutes.get("/search", async (req, res) => {
  /* query params:
    date = YYYY-MM-DD
    pickup = id
    dropoff = id
  */
  let { pickup, dropoff, date } = req.query;
  const filters = {};
  if (pickup) {
    filters.pickupLocation = pickup;
  }
  if (dropoff) {
    filters.dropoffLocation = dropoff;
  }
  filters.collectionTime = {
    $gte: date
      ? new Date(Date.parse(date) - 36000000) // add 10 hours for timezone
      : new Date(Date.parse("2032/07/01") - 36000000),// add 10 hours for timezone
    $lt: date
      ? new Date(Date.parse(date) - 36000000 + 86400000)// add 10 hours for timezone + 24 hours for a full day
      : new Date(Date.parse("2032/08/30") - 36000000),// add 10 hours for timezone
  };
  try {
    let services = await BusService.find(filters).lean();

    if (services) {
      // replace reservations array with reservation count (limits exposure of Reservation ids)
      services = services.map((service) => ({
        ...service,
        reservations: service.reservations.length,
      }));
      res.send(services);
    } else res.status(404).send({ error: "No Service found " });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get all Bus Services
servicesRoutes.get("/", verifyAdmin, async (req, res) => {
  try {
    const allServices = await BusService.find()
      .populate("pickupLocation")
      .populate("dropoffLocation");
    res.status(200).send(allServices);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Get Bus Service by id
servicesRoutes.get("/:id", async (req, res) => {
  try {
    const service = await BusService.findById(req.params.id);
    if (service) {
      res.send(service);
    } else res.status(404).send({ error: "Service not found " });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Create a new Bus Service (ADMIN ONLY)
servicesRoutes.post("/", verifyAdmin, async (req, res) => {
  try {
    const newService = await BusService.create(req.body);

    await BusService.populate(newService, {
      path: "pickupLocation dropoffLocation",
      select: "name",
    });

    res.status(201).send(newService);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Update a Bus Service (ADMIN ONLY)
servicesRoutes.put("/:id", verifyAdmin, async (req, res) => {
  try {
    let service = { ...req.body };

    const updatedService = await BusService.findByIdAndUpdate(
      req.params.id,
      service,
      { new: true }
    );
    await BusService.populate(updatedService, {
      path: "pickupLocation dropoffLocation",
      select: "name",
    });
    if (updatedService) {
      res.send(updatedService);
    } else {
      res.status(404).send({ error: "Service not found" });
    }
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Delete a Bus Service (ADMIN ONLY)
servicesRoutes.delete("/:id", verifyAdmin, async (req, res) => {
  try {
    const service = await BusService.findById(req.params.id);

    if (!service) {
      return res.status(404).send({ error: "Service not found" });
    }
    await Reservation.deleteMany({ busService: service._id });
    await BusService.findByIdAndDelete(req.params.id);

    res.status(204).send({ success: "Location deleted" });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default servicesRoutes;

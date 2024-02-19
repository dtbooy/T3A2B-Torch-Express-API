import mongoose from 'mongoose'
import dotenv from 'dotenv'

// config method reads env file and sets up envioronment variables
dotenv.config()

try {
// connect mongoose Object Data Modelling as early as possible; between / and ? put _dbname_
// script will keep running until manually closed without 
    const m = await mongoose.connect(process.env.DB_URI)
        console.log(m.connection.readyState === 1 ? 'MongoDB connected!' : "MongoDB failed to connect")
}
catch(err) { 
        console.error(err)
}

const closeConnection = () => {
    console.log('Mongoose disconnecting...')
    mongoose.disconnect()
}
// Define Schemas
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    DOB: { type: Date, required: true },
    is_admin: { type: Boolean, required: true },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
})

const busServiceSchema = new mongoose.Schema({
    eventName: [{ type: String }],
    collectionTime: { type: Date, required: true},
    estimatedTravelTime: { type: Number, required: true },
    pickupLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    dropoffLocation: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true},
    capacity: { type: Number }
})

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    busService: { type: mongoose.Schema.Types.ObjectId, ref: 'BusService', required: true }
})

const locationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    directions: { type: String, required: true },
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
})

// Define Models
const User = mongoose.model('User', userSchema)
const BusService = mongoose.model('BusService', busServiceSchema)
const Reservation = mongoose.model('Reservation', reservationSchema)
const Location = mongoose.model('Location', locationSchema)

// Export models
export { User, BusService, Reservation, Location, closeConnection }
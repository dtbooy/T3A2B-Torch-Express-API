import express from 'express'


import locationRoutes from './location_routes.js'
import reservationRoutes from './reservation_routes.js'
// import cors from 'cors'

const app = express()

// app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'Torch API' }))


app.use('/locations', locationRoutes)
app.use('/reservations', reservationRoutes)

export default app


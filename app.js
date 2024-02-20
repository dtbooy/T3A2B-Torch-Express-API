import express from 'express'
import locationRoutes from './routes/location_routes.js'
import reservationRoutes from './routes/reservation_routes.js'
// import cors from 'cors'
import userRoutes from './routes/user_routes.js'

import servicesRoutes from './routes/services_routes.js'
import loginRoutes from './routes/login.js'


const app = express()

// app.use(cors())

app.use(express.json())

// Attach routers
app.use("/users", userRoutes)
app.use('/locations', locationRoutes)
app.use('/reservations', reservationRoutes)
app.use('/services', servicesRoutes)

app.get('/', (req, res) => res.send({ info: 'Torch API' }))



app.use('/locations', locationRoutes)
app.use('/reservations', reservationRoutes)
app.use('/login', loginRoutes)


export default app


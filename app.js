import express from 'express'
// import cors from 'cors'
import userRoutes from './routes/user_routes.js'


const app = express()

// app.use(cors())

app.use(express.json())

// Attach routers
app.use("/users", userRoutes)
app.get('/', (req, res) => res.send({ info: 'Torch API' }))

export default app


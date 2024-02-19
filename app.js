import express from 'express'
// import cors from 'cors'

const app = express()

// app.use(cors())

app.use(express.json())

app.get('/', (req, res) => res.send({ info: 'Torch API' }))

export default app


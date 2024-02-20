import { Router } from 'express'
import { User } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/', async (req, res) => {
    const { email, password } = req.body

    try { 
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ error: "Invalid username"})
        }
        console.log(password)
        console.log(user.password)

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid password" })
        }

        delete user.password

        const token = jwt.sign({ userId: user._id, is_admin: user.is_admin, email: user.email }, process.env.SECRET_TOKEN, {expiresIn: '12h'})

        res.send({user, token})



    } catch (err) {
        console.error(err)
        res.status(500).json({ "error": err.message })
    }
})

export default router
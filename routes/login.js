import { Router } from 'express'
import { User } from '../db.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const router = Router()

const maxAge = (3 * 24 * 60 * 60)


router.post('/', async (req, res) => {
    const { email, password } = req.body

    try { 
        const user = await User.findOne({ email: email })

        if (!user) {
            return res.status(401).json({ error: "Invalid username"})
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(403).json({ error: "Invalid password" })
        }

        delete user.password
        //reduce expiration in deployment
        const token = jwt.sign({ userId: user._id, is_admin: user.is_admin, email: user.email }, process.env.SECRET_TOKEN, {expiresIn: maxAge})

        res.cookie("accessToken", token, {
            httpOnly: true,
            // withCredentials: true,
            secure: true,
            maxAge: maxAge
        })
        
        res.status(200).send({user, token})


    } catch (err) {
        console.error(err)
        res.status(500).json({ "error": err.message })
    }
})



export default router
import jwt from 'jsonwebtoken'
import { User } from '../db.js'

const verifyAdmin = (req, res, next) => {
    const checkToken = req.header('Authorization')

    if (!checkToken) {
        return res.status(401).json({error: 'Authorization token is required'})
    }

    try {
        const decodedToken = jwt.verify(checkToken, process.env.SECRET_TOKEN)
        const is_admin = decodedToken.is_admin

        if (!is_admin) {
            return res.status(403).json({error: 'Admin access is required'})
        } else {
            next()
        }
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

const verifyUser = async (req, res, next) => {
    // Checks if jwt token is valid 
    const checkToken = req.header('Authorization')
    // console.log(req.params.id)
    if (!checkToken) {
        return res.status(401).json({error: 'Authorization token is required'})
    }

    try {
        const decodedToken = jwt.verify(checkToken, process.env.SECRET_TOKEN)
        const userId = decodedToken.userId
        const user = await User.findById(userId)
        if (!user){ 
            return res.status(401).json({error: 'Not Valid User'})
        }
        next()

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}


const authorisedUser = (token, userId) => {
    const checkToken = req.header('Authorization')

    if (!checkToken) {
        return false
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_TOKEN)
        return (userId === decodedToken.userId) || (decodedToken.is_admin)
        
    } catch (err) {
        return false
    }

}



export { verifyAdmin, verifyUser, authorisedUser }
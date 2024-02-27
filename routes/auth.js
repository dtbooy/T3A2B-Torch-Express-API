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
    // Checks if jwt token is a valid user, & is the 
    console.log('Received request with cookies:', req.headers.cookie);
    const checkToken = req.header('Authorization')
    // console.log(req.params.id)
    if (!checkToken) {
        return res.status(401).json({error: 'Authorization token is required'})
    }

    try {
        const decodedToken = jwt.verify(checkToken, process.env.SECRET_TOKEN)
        const userId = decodedToken.userId
        console.log(decodedToken.is_admin)
        const user = await User.findById(userId)
        if (!(user && (req.params.id === userId || decodedToken.is_admin))) {
            return res.status(401).json({error: 'Not Valid User'})
        }
        next()

    } catch (err) {
        res.status(500).json({error: err.message})
    }


}


const getUserId = (req, res, next) => {
    const checkToken = req.header('Authorization')

    if (!checkToken) {
        return res.status(401).json({error: 'Authorization token is required'})
    }

    try {
        const decodedToken = jwt.verify(checkToken, process.env.SECRET_TOKEN)
        req.user = decodedToken.userId
        next()
    } catch (err) {
        res.status(500).json({error: err.message})
    }

}



export { verifyAdmin, getUserId, verifyUser }
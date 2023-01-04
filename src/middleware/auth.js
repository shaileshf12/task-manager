const User = require('../models/user')
const jwt = require('jsonwebtoken')

const auth = async(req, res, next) =>{


    try {
        console.log(req.header('Authorization'))
        const token = req.header('Authorization').replace('Bearer ', '')
        console.log("Hello")


        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findOne({_id:decoded._id, 'tokens.token': token})

        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token

        next()
    } catch (error) {
        res.status(401).send({Error : "Please authenticate"})
    }
}

module.exports = auth
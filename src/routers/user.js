
const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail, sendDeleteAccountEmail} = require('../emails/account')


const router = new express.Router()

router.post('/users', async(req, res)=>{
    
    const user = new User(req.body)
    // user.save().then((result)=>{
    //     res.status(201).send(result)
    // }).catch((err)=>{
    //     res.status(400).send(err)
    // })

    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    } catch (err) {
        res.status(500).send(err)
    }
})

router.post('/users/login', async(req, res)=>{

    try {

    const user = await User.findCredentials(req.body.email, req.body.password)
    // res.send(user)
    const token = await user.generateAuthToken()
    res.send({user, token})
        
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }

})

router.post('/users/logout', auth,  async(req, res)=>{

    try {
        const user = req.user
        user.tokens = user.tokens.filter((each)=>{
            return each.token!==req.token
        })

        await user.save()

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post('/users/logoutAll', auth, async(req, res)=>{

    try {
        const user = req.user
        user.tokens = []
        await user.save()

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users',  async(req, res)=>{

    // User.find().then((users)=>{
    //     res.status(200).send(users)
    // }).catch((err)=>{
    //     res.status(500).send(err)
    // })

    try {
        const users = await User.find()
        res.status(200).send(users)
    } catch (err) {
        res.status(500).send(err)
    }
})

router.get('/users/me', auth,  async(req, res)=>{

    // try {
    //     const users = await User.find()
    //     res.status(200).send(users)
    // } catch (err) {
    //     res.status(500).send(err)
    // }

    res.send(req.user)
})


router.patch('/users/me', auth, async(req, res)=>{

    const updates = Object.keys(req.body)
    const allowedUpdates = ["name", "email", "password", "age"]

    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation)
    {
        return res.status(400).send("Invalid updates")
    }

    const id = req.user_id
    try {

        // const user = await User.findById(id)
        const user = req.user

        updates.forEach((update)=>{
            user[update] = req.body[update]
        })

        await user.save()
        // const user = await User.findByIdAndUpdate(id, req.body, {new:true, runValidators:true})

        if(!user)
        {
            return res.status(404).send("User not found")
        }
        res.send(user)

    } catch (error) {   
        res.status(500).send(error)
    }
})

router.delete('/users/me', auth, async(req, res)=>{

    try {
        // const user = await User.findByIdAndDelete(req.user._id)

        // if(!user)
        // {
        //     return res.status(404).send("User not found")
        // }

        await req.user.remove()
        sendDeleteAccountEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb)
    {
        // if(!file.originalname.endsWith('.pdf'))
        // {
        //     cb(new Error('Please upload the pdf'))
        // }

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
        {
            cb(new Error('Please upload the image'))
        }

        cb(undefined, true)
    }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async(req, res)=>{
    try {
        req.user.avatar = req.file.buffer
        const user = await req.user.save()
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
}, (error, req, res, next)=>{
    res.status(400).send({error : error.message})
})

router.delete('/users/me/avatar', auth, async(req, res)=>{
    try {
        req.user.avatar = undefined
        const user = await req.user.save()

        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.get('/users/:id/avatar', async (req, res)=>{
    try {
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar)
        {
            throw new Error()
        }

            res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (error) {
        res.statu(404).send()
    }
})

module.exports = router
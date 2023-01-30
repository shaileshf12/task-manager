
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please enter the name"],
        trim : true
    },
    email : {
        type : String,
        unique : true,
        required : true,
        // validate : [validator.isEmail, 'Please provide correct email']
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Email is incorrect")
            }
        },
        trim : true,
        lowercase : true
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minlength : 7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw new Error("Password not acceptable")
            }
        }
    },
    age : {
        type : Number,
        default : 0
    },
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    avatar : {
        type : Buffer
    }
}, {
    timestamps : true
})

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})


userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}


userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    user.tokens = user.tokens.concat({token})

    await user.save()

    return token
}


userSchema.statics.findCredentials = async (email, password)=>{

    const user = await User.findOne({email})
        // console.log(user)
    if(!user)
    {
        throw new Error("user not found")
    }
    const userPassword = user.password

    const isMatch = await bcrypt.compare(password, userPassword)

    console.log(isMatch)

    if(!isMatch){
        throw new Error("Incorrect password")
    }

    return user
}

userSchema.pre('save', async function(next){
    const user = this

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }

    // console.log(user)
    next()

})

userSchema.pre('remove', async function(next){
    const user = this

    await Task.deleteMany({owner:user._id})

    next()
    
})

const User = mongoose.model('User', userSchema)

module.exports = User
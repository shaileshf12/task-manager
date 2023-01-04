
const mongodb = require('mongodb')

// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const {MongoClient, ObjectID} = mongodb

const id = new ObjectID()

// console.log(id.id)

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client)=>{
    if(error)
    {
        return console.log('Unable to connect to database')
    }

    const db = client.db(database)

    // db.collection('users').findOne({
    //     name : "Jack"
    // }, (error, user)=>{
    //     console.log(user)
    // })

    // db.collection('users').findOne({
    //     _id : new ObjectID('63ad57bcf6a09dc634d8ef53')
    // }, (error, user)=>{
    //     console.log(user)
    // })

    // db.collection('users').find({
    //     name : 'Mike'
    // }).toArray((error, users)=>{
    //     console.log(users)
    // })

    db.collection('users').find({
        name : 'Mike'
    }).count((error, users)=>{
        console.log(users)
    })
    
})
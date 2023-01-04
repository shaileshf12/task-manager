


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

    // db.collection('tasks').deleteMany({
    //     description : 'Write'
    // }).then((result)=>{
    //     console.log(result)
    // }).then((err)=>{
    //     console.log(err)
    // })

    db.collection('tasks').deleteOne({
        description : 'Dance'
    }).then((result)=>{
        console.log(result)
    }).then((err)=>{
        console.log(err)
    })
    
})
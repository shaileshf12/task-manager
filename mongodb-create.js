
const mongodb = require('mongodb')

// const MongoClient = mongodb.MongoClient
// const ObjectID = mongodb.ObjectId

const {MongoClient, ObjectID} = mongodb

const id = new ObjectID()

console.log(id.id)

const connectionURL = 'mongodb://127.0.0.1:27017'
const database = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client)=>{
    if(error)
    {
        return console.log('Unable to connect to database')
    }


    const db = client.db(database)

    db.collection('users').insertOne({
        _id : id,
        name : 'Jack',
        age : 65
    }, (error, result)=>{
        if(error)
        {
            return console.log("Unable to insert data")
        }

        console.log(result.ops)
    })

    db.collection('users').insertMany([
        {
            name : 'Mack',
            age : 25
        },
        {
            name : 'John'
        }
    ], (error, result)=>{
        if(error)
        {
            return console.log("Unable to insert the data")
        }
        
        console.log(result.ops)
    })

    db.collection('tasks').insertMany([
        {
            description : "Write",
            completed : true
        },
        {
            description : "Run",
            completed : false
        },
        {
            description : 'Dance',
            completed : false
        }
    ], (error, result)=>{
        if(error)
        {
            return console.log("Unable to insert task")
        }

        console.log(result)
    })
    
})
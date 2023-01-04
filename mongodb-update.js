

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

    // db.collection('users').updateOne(
    //     {
    //         _id : new ObjectID("63ad57bcf6a09dc634d8ef53")
    //     },
    //     {
    //         $set : {
    //             name : "Andrew"
    //         }
    //     }
    // ).then((result)=>{
    //     console.log(result)
    // }).catch((err)=>{
    //     console.log(err)
    // })

    db.collection('users').updateMany(
        {
            age : 65
        },
        {
            $set : {
                name : "James"
            },
            $inc : {
                age : 100
            }
        }
    ).then((result)=>{
        console.log(result)
    }).catch((err)=>{
        console.log(err)
    })
    
})
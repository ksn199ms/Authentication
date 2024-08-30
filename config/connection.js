// const mongoose = require('mongoose')

const { parseConnectionString } = require('mongodb/lib/core')

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect('mongodb://localhost:27017/social-network-api')
//         console.log(`MongoDB Connected: ${conn.connection.host}`)
//     } catch (error) {
//         console.log('database connection failed');
//         console.log(error)
//         process.exit(1)
//     }
// }

// module.exports = connectDB


const mongoClient=require('mongodb').MongoClient
const state={db:null}

module.exports.connect=function(done){
    const url= process.env.MONGO_URL
    const dbname='authuntication'
    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done()
    })}


module.exports.get=function(){
    return state.db
}
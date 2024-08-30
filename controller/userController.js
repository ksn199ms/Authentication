var bcrypt = require('bcrypt');
var db = require('../config/connection');
var collection = require('../config/collection');

var userController = {

userSignup:(userData) => {
    return new Promise(async(resolve, reject) => {

        const email = userData.email

       //checking email is already exist or not if exist send error message else insert data using if condition


        db.get().collection('user').findOne({ email: email }).then((user) => {
            if (user) {
                resolve({ status: false , message : "Email Already Exist"})
            }else {

                bcrypt.hash((userData.password && userData.confirmPassword), 10, function(err, hash) {
                    userData.password = hash;
                    userData.confirmPassword = hash;
                    db.get().collection('user').insertOne(userData).then((data) => {

                        resolve({ status: true, message: "Signup successful", insertedId: data.insertedId })
                    })
                });

            }
        })

        
    })

},

userLogin:(userData,req,res) =>{
    return new Promise(async(resolve, reject) => {
        const email = userData.email
       let user = await db.get().collection('user').findOne({ email: email })
            if (user) {
                bcrypt.compare(userData.password, user.password).then((status) => {
                    if (status) {
                        
                        resolve({ status: true, user: user})
                    } else {
                        resolve({ status: false, message: "Invalid Password or Email"})
                    }
                })  
            } else {
                resolve({ status: false, message: "Invalid Password or Email" })
            }
    })

},


}

module.exports = userController
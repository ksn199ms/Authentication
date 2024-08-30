const { get } = require('mongoose');
var db = require('../config/connection');
var bcrypt = require('bcrypt');

const { ObjectID } = require('mongodb');

var adminController = {

    adminLogin: (adminData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection('admin').findOne({ username: adminData.username }).then((admin) => {
                if (admin) {
                    bcrypt.compare(adminData.password, admin.password).then((status) => {
                        if (status) {
                            resolve({ status: true, admin: admin })
                        } else {
                            resolve({ status: false, message: "Invalid Credentials" })
                        }
                    })
                } else {
                    resolve({ status: false, message: "Invalid Credentials" })
                }
            })
        })
    },

    getUserData: () => {
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection('user').find().toArray()
            resolve(user)
        })
    },

    deleteUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('user').deleteOne({ _id: ObjectID(userId) }).then((response) => {
                resolve(response)
            })
        })
    },

    addUser: (userData) => {
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
    
                            resolve({ status: true, message: "User added successful", insertedId: data.insertedId })
                        })
                    });
    
                }
            })
    
            
        })
    },

    getUserDataById: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection('user').findOne({ _id: ObjectID(userId) }).then((user) => {
                if(user){
                    resolve(user)
                }else{
                    resolve({status:false, message:"User not found"})  
                }
            })
        })
    },

    editUser : (userId, userData) => {
        return new Promise((resolve, reject) => {
            if (userData.password && userData.confirmPassword) {
                bcrypt.hash(userData.password, 10, (err, hash) => {
                    if (err) {
                        return reject(err); // Handle hashing error
                    }
    
                    userData.password = hash;
                    userData.confirmPassword = hash;
    
                    // Update the user data after hashing the password
                    db.get().collection('user').updateOne(
                        { _id: ObjectID(userId) },
                        { $set: userData }
                    )
                    .then((response) => {
                        if (response) {
                            resolve({ status: true });
                        } else {
                            resolve({ status: false, message: "EDIT FAILED" });
                        }
                    })
                    .catch((error) => reject(error)); // Handle update error
                });
            }
        });
    }
    
};

module.exports = adminController
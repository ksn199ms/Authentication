var bcrypt = require('bcrypt');
var db = require('../config/connection');
var collection = require('../config/collection');
const nodemailer = require('nodemailer');

const otpExpirationTime = 5 * 60 * 1000;

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


forgotPassword: (userData) => {
    return new Promise(async (resolve, reject) => {

        const email = userData.email;

        db.get().collection('user').findOne({ email: email }).then(async (user) => {
            if (user) {

                const transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "team199.in@gmail.com",
                        pass: process.env.emailAppPassword,
                    },
                });

                const otp = Math.floor(100000 + Math.random() * 900000);
                const otpExpiresAt = Date.now() + otpExpirationTime;

                try {
                    await transporter.sendMail({
                        from: '"Team199" <team199.in@gmail.com>',
                        to: email,
                        subject: "Verification Email For Resetting Password",
                        text: 'OTP: ' + otp,
                        html: "<h2>OTP: " + otp + "</h2>",
                    });

                    // Update user record with OTP and expiration time
                    await db.get().collection('user').updateOne(
                        { email: email },
                        { $set: { otp: otp} }
                    );

                    resolve({ status: true, message: "OTP sent successfully" });
                } catch (error) {
                    reject({ status: false, message: "Failed to send OTP email", error: error });
                }

            } else {
                resolve({ status: false, message: "Invalid Email" });
            }
        }).catch((err) => {
            reject({ status: false, message: "An error occurred", error: err });
        });
    });
},

verifyOTP: (userData) => {
    return new Promise(async (resolve, reject) => {
        const email = userData.email;
        const enteredOtp = parseInt(userData.otp);

        console.log('sssssssss',email, enteredOtp);

        db.get().collection('user').findOne({ email: email }).then((user) => {
            if (user) {

                const otp = user.otp;

                if (otp === enteredOtp) {
                    resolve({ status: true, message: "OTP verified successfully" });
                } else {
                    resolve({ status: false, message: "Invalid OTP" });
                }
            } else {
                resolve({ status: false, message: "Invalid Email" });
            }
        })
    });
},

resetPassword:(userData) => {

    return new Promise(async (resolve, reject) => {
        const email = userData.email;
        const password = userData.password;
        const confirmPassword = userData.confirmPassword;

        db.get().collection('user').findOne({ email: email }).then((user) => {
            if (user) {
                bcrypt.hash((password && confirmPassword), 10, function(err, hash) {
                    userData.password = hash;
                    userData.confirmPassword = hash;
                    db.get().collection('user').updateOne(
                        { email: email },
                        { $set: { password: userData.password, confirmPassword: userData.confirmPassword } },
                        { $set: { otp: null } }
                    ).then((response) => {
                        resolve({ status: true, message: "Password reset successful" });
                    }).catch((err) => {
                        reject({ status: false, message: "An error occurred", error: err });
                    });
                });
            } else {
                resolve({ status: false, message: "Invalid Email" });
            }
        }).catch((err) => {
            reject({ status: false, message: "An error occurred", error: err });
        });
    });

}


}

module.exports = userController
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

                // Updated HTML template
                const htmlTemplate = `
                    <!DOCTYPE html>
                    <html lang="en">
                      <head>
                        <meta charset="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
                        <title>OTP Verification</title>
                        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
                      </head>
                      <body
                        style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;"
                      >
                        <div
                          style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner); background-repeat: no-repeat; background-size: 800px 452px; background-position: top center; font-size: 14px; color: #434343;"
                        >
                          <header>
                            <table style="width: 100%;">
                              <tbody>
                                <tr style="height: 0;">
                                  <td>
                                    <img
                                      alt=""
                                      src="https://ksn199ms.github.io/Team199/assets/img/logo.png"
                                      height="50px"
                                      width="auto"
                                    />
                                  </td>
                                  <td style="text-align: right;">
                                    <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${new Date().toLocaleDateString()}</span>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </header>

                          <main>
                            <div
                              style="margin: 0; margin-top: 70px; padding: 92px 30px 115px; background: #ffffff; border-radius: 30px; text-align: center;"
                            >
                              <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                                <h1 style="margin: 0; font-size: 24px; font-weight: 500; color: #1f1f1f;">
                                  Your OTP
                                </h1>
                                <p style="margin: 0; margin-top: 17px; font-size: 16px; font-weight: 500;">
                                  Hello,
                                </p>
                                <p style="margin: 0; margin-top: 17px; font-weight: 500; letter-spacing: 0.56px;">
                                  Thank you for choosing Team199. Use the following OTP to complete your password reset procedure. The OTP is valid for <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>. Do not share this code with others.
                                </p>
                                <p style="margin: 0; margin-top: 60px; font-size: 40px; font-weight: 600; letter-spacing: 25px; color: #ba3d4f;">
                                  ${otp}
                                </p>
                              </div>
                            </div>

                            <p
                              style="max-width: 400px; margin: 0 auto; margin-top: 90px; text-align: center; font-weight: 500; color: #8c8c8c;"
                            >
                              Need help? Contact us at
                              <a href="mailto:team199.in@gmail.com" style="color: #499fb6; text-decoration: none;">team199.in@gmail.com</a>
                            </p>
                          </main>

                          <footer
                            style="width: 100%; max-width: 490px; margin: 20px auto 0; text-align: center; border-top: 1px solid #e6ebf1;"
                          >
                            <p style="margin: 0; margin-top: 40px; font-size: 16px; font-weight: 600; color: #434343;">
                              Team199
                            </p>
                            <p style="margin: 0; margin-top: 8px; color: #434343;">Address 540, City, State.</p>
                            <div style="margin: 0; margin-top: 16px;">
                              <a href="" target="_blank" style="display: inline-block;">
                                <img width="36px" alt="Facebook" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook" />
                              </a>
                              <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                                <img width="36px" alt="Instagram" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram" />
                              </a>
                              <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                                <img width="36px" alt="Twitter" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter" />
                              </a>
                              <a href="" target="_blank" style="display: inline-block; margin-left: 8px;">
                                <img width="36px" alt="YouTube" src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube" />
                              </a>
                            </div>
                            <p style="margin: 0; margin-top: 16px; color: #434343;">
                              Copyright © 2022 Team199. All rights reserved.
                            </p>
                          </footer>
                        </div>
                      </body>
                    </html>
                `;

                try {
                    await transporter.sendMail({
                        from: '"Team199" <team199.in@gmail.com>',
                        to: email,
                        subject: "Verification Email For Resetting Password",
                        text: `Your OTP is ${otp}.`,
                        html: htmlTemplate,
                    });

                    // Update user record with OTP and expiration time
                    await db.get().collection('user').updateOne(
                        { email: email },
                        { $set: { otp: otp, otpExpiresAt: otpExpiresAt } }
                    );

                    resolve({ status: true, message: "OTP sent successfully", otp: otp });
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
                    resolve({ status: true, message: "OTP verified successfully",email:email });
                } else {
                    resolve({ status: false, message: "Invalid OTP",verifyOTPError: true });
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
                        { $set: { password: userData.password, confirmPassword: userData.confirmPassword , otp: null} },
                        // { $set: { otp: null } }
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
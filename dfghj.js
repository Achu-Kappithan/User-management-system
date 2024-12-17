// const signup_user = async (req, res) => {
//     try {
//         const { firstname, lastname, email, password, confirm } = req.body;

//         // Check if passwords match
//         if (password !== confirm) {
//             return res.render("register", { message: "Passwords do not match!" });
//         }

//         // Encrypt password
//         const spass = await encryptpass(password);

//         // Check if user already exists
//         const userexist = await User.findOne({ email: email });
//         if (userexist) {
//             return res.render("register", { message: "USER ALREADY EXISTS" });
//         }

//         // Create new user
//         const user = new User({
//             firstname: firstname,
//             lastname: lastname,
//             email: email,
//             password: spass,
//             is_admin: 0,
//             is_verified: false
//         });
        
//         const userdata = await user.save();
//         if (userdata) {
//             // OTP generation and sending after successful registration
//             const otp = generateOtp();
            
//             // Save OTP to the database
//             const otpEntry = new Otp({ email: email, otp });
//             await otpEntry.save();
            
//             // Send OTP to the user's email
//             await sendOtpEmail(email, otp);

//             // Render OTP verification page with the email
//             return res.render('otp', { email: email });
//         } else {
//             return res.render("register", { message: "SOMETHING WENT WRONG!" });
//         }
//     } catch (err) {
//         console.log(err);
//         return res.render("register", { message: "ENTER VALID CREDENTIALS!" });
//     }
// };

// // Helper functions
// // const generateOtp = () => {
// //     return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
// // };

// // const sendOtpEmail = async (email, otp) => {
// //     let transporter = nodemailer.createTransport({
// //         service: 'gmail', // Use your email service
// //         auth: {
// //             user: 'achukappithan4236@gmail.com',
// //             pass: 'kl06g4236'
// //         }
// //     });

// //     await transporter.sendMail({
// //         from: 'achukappithan4236@gmail.com',
// //         to: email,
// //         subject: 'Your OTP Code',
// //         text: `Your OTP code is ${otp}. It will expire in 1 minute.`
// //     });
// // };





// const register_user = async (req, res) => {
//     try {
//         const { name, email, password, cpassword } = req.body;

//         console.log(Registration details:, name, email, password, cpassword);

//         if (password !== cpassword) {
//             return res.status(400).send("Passwords do not match");
//         }

//         const existing_user = await user.findOne({ email: email });
//         if (existing_user) {
//             return res.status(400).send("User already exist. Please Login");
//         }
//         const otp = otp_generator.generate(6);
        
//         console.log(this is the generated otp,otp);
        
//         const otp_data = new user_otp({

//             email:email,
//             otpCode:otp
//         })

//         await otp_data.save()

//         req.session.form_data = { name, email, password, cpassword };

//         console.log("Session Data:", req.session.form_data);

//         const transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASS,
//             },
//         });

//         const mailOptions = {
//             from: {
//                 name: 'Essence Aura',
//                 address: process.env.EMAIL_USER,
//             },
//             to: email,
//             subject: "Your OTP Code",
//             text: Hello, your OTP code is '${otp}' It will be expire in 1 minute.,
//         };

//         const sendMail = async () => {
//             try {
//                 await transporter.sendMail(mailOptions);
//                 console.log("Email has been sent!");
//             } catch (error) {
//                 console.log(error.message);
//             }

//         }

//         await sendMail();

//         return res.render("user/user_send_otp", {message: "OTP send to your Email"});   

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const user_send_otp = async (req,res) => {

//     try {
//         return res.status(200).render('user/user_send_otp');
//     } catch (error) {
//         console.log('error with otp'.error.message);
//         return res.status(400).send("error while resending the otp");
//     }
// }

// const secure_password = async(password) => {
//     try {
//         const password_hash = await bcrypt.hash(password, 10)
//         return password_hash;
//     } catch (error) {
//         console.log(error.message)
//     }
// }

// const verify_otp = async (req, res) => {
//     try {
        
//         const {otp} = req.body
//         console.log(`this is the form data`,req.session.form_data);
        
//         const {email,name,password} = req.session.form_data

//         console.log(otp)

//         const otp_data = await user_otp.findOne({otpCode:otp,email:email})

//         console.log(`this is the otp received`,otp_data);
//         if(otp_data){
            
//             const user_data = new user ({
//                 name:name,
//                 email:email,
//                 password: await secure_password(password),
//                 is_admin:false
//             })
//             await user_data.save();
//             console.log('user data saved to databse');
//             return res.redirect("/login")
//         }else{
//             return res.send("invalidotp")
//         }
//     } catch (err) {
//         console.log(`error from verify otp function `,err.message)
//     }
// }

// //user side login and registration end.

// //Home page loading
// const load_home_page = async (req, res) => {
//     try {
//         res.render('user/user_landing')
//     } catch (error) {
//         console.log('error while rendering home page.');
//     }
// }   

// const login_user = async (req,res) =>{

//     try {

//         const {email,password} = req.body

//         const user_data = await user.findOne({email:email.trim()})
        
//         const password_match = await bcrypt.compare(password.trim(),user_data.password)

//         if(password_match){

//             return res.redirect("/home")
//         }

//         return res.send("Invalid password")
//     } catch (error) {
        
//         console.log('error while login.',error.message);
//     }
// }
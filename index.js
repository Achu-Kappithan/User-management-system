const mongoose = require("mongoose");
const userRoute = require("./routes/user_route");
const express = require("express");
const session = require('express-session')
const config = require('./config/config')
const app = express();
const secretKey = config.secretKey

//for admin route
const adminRoute = require("./routes/admin_route");
// const { Cookie } = require("express-session");

app.use(session ({
    secret:secretKey,
    resave:false,
    saveUninitialized:true,
    cookie:{secure:false}
}))

mongoose.connect('mongodb://127.0.0.1:27017/user_management_system');



app.use('/admin',adminRoute);

//for user route
app.use('/',userRoute);


app.listen(8000,()=>console.log(`reserver running in :http://localhost:8000`));


const User = require('../models/user_model');
const bcrypt = require('bcrypt');


const securePassword = async(password)=>{
    try {
        const password_hash = await bcrypt.hash(password, 10)
        return password_hash;

    } catch (error) {
        console.log('error.message')
    }
}

const loadRegister = async(req,res) => {
    try {
        res.render('registration')
    } catch (error) {
        console.log(error.message)
    }
}

const insertUser = async(req,res) => {
    try {
    const sPassword = await securePassword(req.body.password);
    const user = new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,
        password:sPassword,
        is_admin:0
    });
        const userData = await user.save();
        if(userData){
            res.render('registration',{message:"User Registered Successfully!"});
        }else{
            res.render('registration',{message:"User Registration Failed!"});
        }

    } catch (error) {
        console.log(error.message);
    }
}

//Login user methods

const login_load = async(req,res) => {
    try { 
        res.render('login')
    } catch (error) {
        console.log(error.message)
    }
}
 
const verifyLogin = async(req,res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const userData = await User.findOne({email:email});
        if(userData){
            const password_match = await bcrypt.compare(password,userData.password)
            if(password_match){
                req.session.user_id = userData._id
                res.redirect('home/'+userData.id);
            }else{
                return res.render('login',{message:"Incorrect Email or Password"});
            }
        }else{
            return res.render('login',{message:"Incorrect Email or Password"});
        }
    } catch (error) {
        console.log(error.message) 
    }
}

const load_home = async(req,res) =>{
    
    try {
        const {id}=req.params
console.log(req.session.user_id );

        const user = await User.findById({ _id:id })
        res.render('home',{ user:user })
    } catch (error) {
        console.log(error.message)
    }
}

//Log out

const user_logout = async(req,res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message)
    }
}

//Edit profile edit

const edit_profile = async (req,res) => {

    try {
      
        const id = req.query.id;
        const userData = await User.findById({ _id:id });
        if(userData){

            return  res.render('edit',{ user:userData });
           
        }else{

            return res.redirect('/home');
        
        }

    } catch (error) {
        console.log(error.message);
    }

}

//update profile
const update_profile = async (req,res) => {
    try {
        const {id}=req.params
        
        if(req.file){

        const userData = await  User.findByIdAndUpdate({ _id:req.body.user_id }, {$set:{ name:req.body.name, email:req.body.email, phone:req.body.phone, image:req.file.filename } })
       
        res.redirect('home/'+req.body.user_id );
        }else{
         const userData = await  User.findByIdAndUpdate({ _id:req.body.user_id }, {$set:{ name:req.body.name, email:req.body.email, phone:req.body.phone } })
         res.redirect('home/'+req.body.user_id );
        }
    } catch (error) {
        console.log(error.message)
    }
}



module.exports = {
    loadRegister,
    insertUser,
    login_load,
    verifyLogin,
    load_home,
    user_logout,
    edit_profile,
    update_profile,
}

const User = require('../models/user_model');
const bcrypt = require('bcrypt');
const { validate } = require('express-validator');


//Admin login
const login_load = async (req,res) => {
    try {
        return res.render('login');
    } catch (error) {
        console.log(error.message)
    }
}


//Admin verifying
const verifyLogin = async(req,res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user_data = await  User.findOne({email:email});

        if(user_data){
            const password_match = await bcrypt.compare(password,user_data.password);
            if(password_match){
                if(user_data.is_admin === 0){
                   return res.render('login',{message:"Email and password is incorrect!"});
                }else{
                    req.session.user_id = user_data._id;
                    return res.redirect('/admin/home');
                }
            }else{
                return res.render('login',{message:"Email and password is incorrect!"});
            }
        }
        else{
           return res.render('login',{message:"Email and password is incorrect!"});
        }
    } catch (error) { 
        console.log(error.message);
    }
}

const dash_board = async (req,res) => {
    try {
        const user_data = await User.findById({_id:req.session.user_id});
        return res.render('home',{ admin:user_data })
    } catch (error) {
        console.log(error.message)
    }
}

const load_logout = async(req,res) => {
    try {
        req.session.destroy();
        return res.redirect('/admin');
    } catch (error) {
        console.log(error.message)
    }
}


//Adding new user 

const load_new_user = async (req,res) => {
    try {
        
        return res.render('new_user')

    } catch (error) {
        console.log(error.message)
    }
}

const securePassword = async (password) => {

    try {
        const hashPassword = await bcrypt.hash(password,10);
       
            return hashPassword;

    } catch (error) {
        console.log(error.message);
    }
}

const add_user = async (req,res) => {

    try {

        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const image = req.file.filename;
        const password = req.body.password;
       
        const sPassword = await securePassword(password);
        
        const user = new User({
            name:name,
            email:email,
            phone:phone,
            image:image,
            password:sPassword,
            is_admin:0
        });

        const users = await user.save();
   
        if(users){
            return res.redirect("/admin/dashboard")
        }else{
            res.render('new_user',{message:'Something Wrong'});
        }
        
    } catch (error) {
        console.log(error.message)
    }
}

//edit user
const load_edit_user = async (req,res) => {
    try {
        
        const id = req.query.id;
        const userData = await User.findById({ _id:id });
        if(userData){
            res.render('edit_user',{ user:userData });
        }else{
            res.redirect('/admin/dashboard')
        }
        

    } catch (error) {
        console.log(error.message)
    }
}

//Update users
const load_edit_update_users = async (req,res) => {
    try {

       await User.findByIdAndUpdate({ _id:req.body.id }, {$set:{ name:req.body.name,email:req.body.email, phone:req.body.phone} })
       res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message)
    }
}

//delete user method

const load_delete_user = async (req,res) => {
    try {
        const id = req.query.id;
        await User.deleteOne({ _id:id })
        res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message)
    }
}

//search user for admin
const admin_dashboard = async (req,res) => {
    try {
        var search = '';
        if(req.query.search){
            search = req.query.search;
        }
       const userData = await User.find({is_admin:0, name:{$regex:"^"+search+".*", $options:"i"}});
        res.render('dashboard',{users:userData});
    } catch (error) {
        console.log(error.message);
    }

}

const backTo_dash = async (req, res) => {
    redirect("/admin/dashboard")
}
module.exports = {
    login_load,
    verifyLogin,
    dash_board,
    load_logout,
    admin_dashboard,
    load_new_user,
    add_user,
    backTo_dash,
    load_edit_user,
    load_edit_update_users,
    load_delete_user
}
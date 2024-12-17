const express = require('express');
const user_route = express();
const user_controller = require('../controllers/user_controller');
const body_parser = require('body-parser');
const multer = require('multer');
const path = require('path');
const session = require('express-session');
const config = require('../config/config');
const auth = require('../middleware/auth');

user_route.use(session({secret:config.secret_key}));

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.join(__dirname, '../public/user_images'))
    },
    filename:function(req,file,cb){
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})

const upload = multer({storage:storage});

user_route.set('view engine','ejs');

user_route.set('views','./views/users');

user_route.use(express.static('public'));

user_route.get('/register',auth.isLogout,auth.clearCache,user_controller.loadRegister);

user_route.post('/register',upload.single('image'),user_controller.insertUser);

user_route.use(body_parser.json());

user_route.use(body_parser.urlencoded({extended:true}));

user_route.get('/',auth.isLogout,auth.clearCache,user_controller.login_load);

user_route.get('/login',auth.isLogout,auth.clearCache,user_controller.login_load);

user_route.post('/login',auth.isLogout,user_controller.verifyLogin);

user_route.get('/home/:id',auth.isLogin,auth.clearCache,user_controller.load_home);

user_route.get('/logout',auth.isLogin,auth.clearCache,user_controller.user_logout);

user_route.get('/edit',auth.isLogin,auth.clearCache,user_controller.edit_profile);

user_route.post('/edit',upload.single('image'),user_controller.update_profile);





module.exports = user_route;



const is_login = async (req,res,next) => {
   
    try {
        if(req.session.user_id){

        }else{
            return res.redirect('/admin')
        }
        next();
    }  catch (error) {
        console.log(error.message)
    }
}

const is_logout = async (req,res,next) => {
    try {
        if(req.session.user_id){
            res.redirect('/admin/home')
        }
        next();
    } catch (error) {
        console.log(error.message)
    }
}


const clearCache = async(req,res,next)=>{
    try {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        // res.header('Expires', '-1');
        // res.header('Pragma', 'no-cache');
        next()
        
    } catch (error) {
        console.log(error.message)
    }
}




module.exports = {
    is_logout,
    is_login,
    clearCache
}

export function isAdmin(req,res,next) {
    
    if(req.session.admin && req.session.admin.role == "admin"){
        console.log(req.session.admin.role);
        
      return  next()
    }else{
        res.json("this page is not for users")
    }

}
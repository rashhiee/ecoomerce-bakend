export function isAdmin(req,res,next) {
    
    if(req.session.role === "admin"){
        console.log(req.session.role);
        
      return  next()
    }else{
        res.json("this page is not for users")
    }

}

export function isUser(req,res,next) {
    
    if( req.session.role === "user"){
        console.log(req.session.role);
        
      return  next()
    }else{
        res.json("this page is not for admin")
    }

}
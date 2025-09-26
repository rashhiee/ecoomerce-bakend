import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name : {
        type : String , required : true 
    },
    email : {
        type : String , required : true , unique : true
    },
    password:{
        type : String , requires : true 
    },
    role : {
        type : String , enum : ["user","admin"] , default : "user"
    },
    status : {
        type : Boolean , default : true
    }
},
{ timestamps : true});

const Users = mongoose.model("Users",userSchema);
export default Users;
import { Schema,model } from "mongoose";
import bcrypt from "bcrypt";
import passportLocalMongoose from "passport-local-mongoose";

const User=new Schema({
    username:{
        type:String,
        unique:true,
        require:true,
        lowercase:true,
    },
    password:{
        type:String,
        require:true
    }
});

User.pre("save",async function(next){
    console.log(this);
    if(!this.password)
        throw new Error("Password Requried");
    this.password=await bcrypt.hash(this.password,12);
    next();
});

User.methods.isValidPassword=async function(planePassword){
    return await bcrypt.compare(planePassword,this.password);
}

User.plugin(passportLocalMongoose);


export default model("users",User);
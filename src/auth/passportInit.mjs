
import User from "../db/UserModel.mjs"
import { Strategy as  LocalStrategy } from "passport-local";
async function verify(username,password,done){
    const user=await User.findOne({username});
    if(!user){
        return done(null,false,{error:"Incorrect username"});
    }
    if(user.isValidPassword(password)){
        return done(null,user);
    }
    return done(null,false);
}

export default function(passport){
    passport.use(new LocalStrategy(verify))
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
    console.log("Passport Local Setup Done");
};
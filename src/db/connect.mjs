import mongoose from "mongoose";

export default function(){
        mongoose.connect("mongodb+srv://ravi939:Ravi123@ravi.zdukcmr.mongodb.net/alter")
                .then(()=>console.log("Connected to mongoDB"))
                .catch(()=>console.log("Error occured while connecting to mongoDB"))
}

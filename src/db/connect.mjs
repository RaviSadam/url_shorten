import mongoose from "mongoose";

export default function(){
        mongoose.connect(process.env.MONGO_URL)
                .then(()=>console.log("Connected to mongoDB"))
                .catch(()=>console.log("Error occured while connecting to mongoDB"))
}

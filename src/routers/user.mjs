import { Router } from "express";
import User from "../db/UserModel.mjs";
import passport from "passport";

const router=Router();


router.post("/register",async (req,res,next)=>{
    
    const user=new User(req.body);

    const data=await user.save();
    res.status(201).json({data:"user created"});
});

router.post("/login",passport.authenticate("local"),(req,res)=>{
    res.json({body:"Logged in successfull"});
});
router.all("/logout",(req,res)=>{
    req.logOut()
    res.json({data:"logOut success"});
});


export default router;
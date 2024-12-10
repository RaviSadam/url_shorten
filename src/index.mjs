import express from "express"
import dotenv from "dotenv"
import passport from "passport";
import session from "express-session"
import bodyParser from "body-parser";
import useragent from "express-useragent";


import passportSetUp from "./auth/passportInit.mjs";
import mongooseConnect from "./db/connect.mjs";

import analyticsRouter from "./routers/analytics.mjs"
import shortenRouter from "./routers/shorten.mjs";
import userRouter from "./routers/user.mjs"
import isAuthenticated from "./auth/isAuthenticated.mjs";

dotenv.config();

const app=express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(useragent.express());

const port=process.env.PORT||8080;

app.use("/user",userRouter)
app.use("/api/shorten",isAuthenticated,shortenRouter);
app.use("/api/analytics",isAuthenticated,analyticsRouter);

app.listen(port,()=>{
    passportSetUp(passport);
    mongooseConnect();
});
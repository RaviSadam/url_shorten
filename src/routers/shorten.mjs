import { Router } from "express";
import moment from "moment";
import Url from "../db/ShortUrlsModel.mjs";



const router=Router();


router.post("/",async (req,res,next)=>{
    const body=req.body;
    const shortUrl=new Url(body);
    console.log(req.headers)
    try{
        const data=await shortUrl.save();
        return res.status(201).json({shortUrl:data.alias,createdAt:data.createdAt});
    }
    catch(err){
        return res.status(500).json({error:err.message});
    }
});

router.get("/:alias",async (req,res,next)=>{
    const alias=req.params.alias;
    const data=await Url.findOne({alias:alias});
    if(!data.longUrl)
        return res.status(404).json({error:"No mapping found"});
    
    const username=req.user.username;
    const source=req.useragent;
    const deviceName = source.isMobile ? 'Mobile' : source.isTablet ? 'Tablet' : 'Desktop';
    const osName = source.os || "Windows";
    
    
    updateClicksByDate(data);
    updateUsersClicked(data,username);
    updateDeviceType(data,deviceName,username);
    updateOsType(data,osName,username);
    data.totalClicks++;
    
    console.log(data);
    const temp=await data.save();
    console.log(temp);
    return res.redirect(data.longUrl);
});



const updateDeviceType=function(data,deviceName,username){
    if(!data.deviceType)
        data.deviceType=[]
    let b=true;
    for(let obj of data.deviceType){
        if(obj.deviceName===deviceName){
            update(obj.users,username);
            b=false;
        }
    }
    if(b){
        const obj={
            deviceName:deviceName,
            users:new Map([[username,1]]),
        };
        data.deviceType.push(obj);
    }
}


const updateOsType=function(data,osName,username){
    if(!data.osType)
        data.osType=[]
    let b=true;
    for(let obj of data.osType){
        if(obj.osName===osName){
            update(obj.users,username)
            b=false;
        }
    }
    if(b){
        const obj={
            osName:osName,
            users:new Map([[username,1]])
        };
        data.osType.push(obj);
    }
}

const updateClicksByDate=function(data){
    const today=moment().format("yyyy-MM-dd");
    update(data.clicksByDate,today);
}
const updateUsersClicked=function(data,username){
    update(data.usersClicked,username);
}


const update=function(obj,key){
    if(!obj)
        obj=new Map();
    if(obj.has(key))
        obj.set(key,obj.get(key)+1)
    else
        obj.set(key,1);
}

export default router;

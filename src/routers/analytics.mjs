import { Router } from "express";
import Url from "../db/ShortUrlsModel.mjs";

const router=Router();

router.get("/:alias",async (req,res,next)=>{
    const alias=req.params.alias;

    const data=await Url.findOne({alias});
    if(!data)
        return res.json({});
    const uniqueClicks=data.usersClicked?.size||0;

    const os=[]
    for(let obj of data.osType){
        const temp={
            osName:obj.osName,
            uniqueUsers:obj.users.size,
            uniqueClicks:mapSum(obj.users)
        };
        os.push(temp);
    }

    const device=[]
    for(let obj of data.deviceType){
        const temp={
            deviceName:obj.deviceName,
            uniqueUsers:obj.users.size,
            uniqueClicks:mapSum(obj.users)
        };
        device.push(temp);
    }
    return res.status(200).json({totalClicks:data.totalClicks,uniqueClicks,clicksByDate:data.clicksByDate,os,device});

});

router.get("/overall",async (req,res,next)=>{
    const owner=req.user.username;
    const data=await Url({owner});
    console.log(data);
    return res.json(processOverallData(data));
});

router.get("/topic/:topic",async (req,res,next)=>{
    const topic=req.params.topic;
    const data=await Url.find({topic});
    const response=processDataForTopic(data);
    return res.json(response);
});


const processOverallData=function(data){
    if(!data)
        return {};
    let totalClicks=0,uniqueClicks=0,totalUrls=0;
    const clicksByDate=new Map();
    const osType=new Map(),deviceType=new Map();
    for(let obj of data){
        totalClicks+=obj.totalClicks;
        uniqueClicks+=obj.uniqueClicks?.size||0;
        totalUrls+=1;
        for(let [key,value] of data.clicksByDate?.entries){
            if(clicksByDate.has(key))
                clicksByDate.set(key,clicksByDate.get(key)+value);
            else
                clicksByDate.set(key,value);
        }
        for(let os of data.osType){
            if(osType.has(os.osName)){
                osType.set(osName,osType.get(osName)+os.users?.size||0);
            }
            else{
                osType.set(osName,os.users?.size||0);
            }
        }
        for(let device of data.deviceType){
            if(deviceType.has(device.deviceName)){
                deviceType.set(device.deviceName,deviceType.get(device.deviceName)+device.users?.size||0);
            }
            else{
                deviceType.set(device.deviceName,device.users?.size||0);
            }
        }
    }
    return{
        totalClicks,uniqueClicks,totalUrls,osType,deviceType
    }

}

const processDataForTopic=function(data){
    if(!data)
        return {};
    let total=0,unique=0;
    const clicksByDat=new Map();
    const urls=[]
    for(let obj of data){
        const temp={
            shortUrl:obj.alias,
            totalClicks:obj.totalClicks,
            uniqueClicks:obj.usersClicked?.size||0
        };
        total+=obj.totalClicks;
        unique+=obj.usersClicked?.size||0;
        for(const [key,value] of obj.clicksByDate.entries()){
            if(clicksByDat.has(key))
                clicksByDat.set(key,clicksByDat.get(key)+value);
            else
                clicksByDat.set(key,value);
        }
        urls.push(temp);
    }
    const clicksByDate=[]
    for(const [key,value] of clicksByDat.entries()){
        const temp={"date":key,"clicks":value}
        clicksByDate.push(temp);
    }
    
    return {
        totalClicks:total,
        uniqueClicks:unique,
        urls:urls,
        clicksByDate
    }

}

const mapSum=function(obj){
    let sum=0;
    for(let value in Object.values(obj)){
        sum+=Number(value);
    }
    return sum;
}

export default router;
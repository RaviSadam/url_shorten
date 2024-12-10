import { Router } from "express";
import moment from "moment";
import Url from "../db/ShortUrlsModel.mjs";
import ShortUrlsModel from "../db/ShortUrlsModel.mjs";


const router=Router();

router.get("/:alias",async (req,res,next)=>{
    const alias=req.params.alias;

    const data=await Url.findOne({alias});

    console.log(data);
    const uniqueClicks=data.usersClicked?.size;

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


router.get("/topic/:topic",async (req,res,next)=>{
    const topic=req.params.topic;
    const data=await Url.find({topic});
    const response=processData(data);
    return res.json(response);
});

const processData=function(data){
    let total=0,unique=0;
    const clicksByDate=new Map();
    const urls=[]
    for(let obj of data){
        const temp={
            shortUrl:obj.alias,
            totalClicks:obj.totalClicks,
            uniqueClicks:obj.uniqueClicks?.size
        };
        total+=obj.totalClicks;
        unique+=obj.uniqueClicks?.size;
        for(let [key,value] of data.clicksByDate?.entries){
            if(clicksByDate.has(key))
                clicksByDate.set(key,clicksByDate.get(key)+value);
            else
                clicksByDate.set(key,value);
        }
        urls.push(temp);
    }
    return {
        totalClicks:total,
        uniqueClicks:unique,
        urls,
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
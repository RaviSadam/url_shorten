import { Schema, model } from "mongoose";
import crypto from "crypto";
import { type } from "os";

const ShortUrl = new Schema(
  {
    longUrl: {
    	type: String,
    	require: true,
    },
	owner:{
		type:String,
		require:true
	},
    topic: {
    	type: String,
    	require: false,
    },
    alias: {
      	type: String,
      	require: true,
      	unique: true,
    },
    totalClicks: {
      type: Number,
      default: () => 0,
    },
    usersClicked: {
		type:Map,
		of:Number,
	},
	osType:[{
        osName: {
          type: String,
          require: false,
        },
		users:{
			type:Map,
			of:Number,
		}
    }],
	deviceType:[{
		deviceName:{
			type:String,
			require:false
		},
		users:{
			type:Map,
			of:Number,
		}	
	}],
    clicksByDate: {
      type: Map,
      of: Number,
    },
  },
  { timestamps: true }
);

ShortUrl.pre("save", function(next){
  const data = this.alias || crypto.randomBytes(16).toString("hex");
  this.alias = data;
  next();
});

export default model("ShortUrls", ShortUrl);
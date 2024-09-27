import mongoose from "mongoose";

const MaxLimitReachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otpRequests:{
    type:Number,
    default:0
  },
  otpRequestsTimestamp:{
    type: Date,
  },
  LinkRequests:{
    type:Number,
    default:0
  },
  LinkRequestsTimestamp:{
    type: Date,
  }
});
export const MaxLimit = mongoose.model("MaxLimit", MaxLimitReachSchema);
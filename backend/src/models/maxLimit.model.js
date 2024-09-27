import mongoose from "mongoose";

const MaxLimitReachSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  otpRequestsTimestamp: { type: [Date], default: [] },
  LinkRequestsTimestamp: { type: [Date], default: [] },
});
export const MaxLimit = mongoose.model("MaxLimit", MaxLimitReachSchema);
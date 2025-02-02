import mongoose from "mongoose";

const prevRoundSchema = mongoose.Schema(
  {
   id:{
    type:mongoose.Types.ObjectId,
    ref:"Rounds"
   }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("PrevRound", prevRoundSchema);

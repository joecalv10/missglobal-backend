import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const RoundsSchema = mongoose.Schema(
  {
    name: { ...validations(String) },
    qualifyContestants: { ...validations(Number) },
    CriteriaPerRound: { ...validations(String) },
    isFirstRound:Boolean,
    wildCards:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Actress",
    }],
    isStart:{
      type:Boolean,
      default:false
    },
    completed:{
      type:Boolean,
      default:false
    },
    scores:[
      {
      personality: Number,
      pose: Number,
      attitude: Number,
      ratedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
      },
      ratedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Actress",
      }
  }
]
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Rounds", RoundsSchema);

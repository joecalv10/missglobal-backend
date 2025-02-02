import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const actressSchema = mongoose.Schema(
  {
    name : {...validations(String)},
    country: { ...validations(String) },
    age: { ...validations(Number, { required: true }) },
    height: { ...validations(String) },
    pic: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Actress", actressSchema);

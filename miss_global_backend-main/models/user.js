import mongoose from "mongoose";

let validations = (type, extras) => {
  return {
    type,
    ...extras,
  };
};

const userSchema = mongoose.Schema(
  {
    email: { ...validations(String) },
    password: { ...validations(String) },
    country: { ...validations(String) },
    tokenVersion: { ...validations(Number, { default: 0 }) },
    role: {
      ...validations(String, {
        enum: ["ADMIN", "JUDGE"],
        default: "JUDGE",
      }),
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);

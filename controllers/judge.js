import User from "../models/user.js";
import Rounds from "../models/rounds.js";
import { hashPassword } from "../utils/auth.js";

const JudgeController = {
  createJudge: async (req, res) => {
    try {
      const { email, password } = req.body;

      if ( !email || !password)
        throw new Error("Email, name and Password is required !");

      const user = await User.findOne({ email });
      if (user) throw new Error("User already Exists !");

      const hashedPassword = await hashPassword(password);
      const newUser = await User.create({
        email:email.toLowerCase(),
        password: hashedPassword
      });

      return res.status(200).json({ message: newUser });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getAllJudges: async (_, res) => {
    try {
      const user = await User.find({ role:"JUDGE" });
      return res.status(200).json({ message: user });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateJudge: async (req, res) => {
    try {

      const { email, password } = req.body;
 
      let params = {};
      if(email) params["email"] = email.toLowerCase();
      if(password){
        const hashedPassword = await hashPassword(password);
        params["password"] = hashedPassword
      }

      const judge = await User.findByIdAndUpdate(req.params.id, params, {new:true});
      return res.status(200).json({ message:judge});
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteJudge: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Delete User Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  addScore: async (req, res) => {
    try {
      const { roundId, score } = req.body;
      if(!roundId || !score) throw new Error("roundId and score is required !")

      const round = await Rounds.findByIdAndUpdate(roundId, {
        $push:{
          scores: { $each: score }
        }
      },
      {
        new: true
      }
      )

      return res.status(200).json({message:round})
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  }
};

export default JudgeController;

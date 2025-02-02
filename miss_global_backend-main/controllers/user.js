import User from "../models/user.js";
import Rounds from "../models/rounds.js";
import PrevRound from "../models/prevRound.js";

const UserController = {
  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.authUser._id);
      const rounds = await Rounds.find({});
      let prevRoundId;

      rounds.map((round, index) => {
        if (round.isStart === true) {
          index == 0
            ? (prevRoundId = round._id)
            : (prevRoundId = rounds[index - 1]?._id);
        }
      }, []);

      const prevRound = await PrevRound.findOne();
      if (!prevRound) {
        await PrevRound.create({ id: prevRoundId });
      } else {
        prevRound.id = prevRoundId;
        await prevRound.save();
      }

      res.status(200).json({ message: user, status: true });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message, status: false });
    }
  },
};

export default UserController;

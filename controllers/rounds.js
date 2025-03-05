import Rounds from "../models/rounds.js";
import mongoose from "mongoose";
import PrevRound from "../models/prevRound.js";

const getSortedModels = (scores, contestents) => {
  let modelsScore = {};
  let models = {};

  scores.map((scr) => {
    models[scr.ratedTo._id] = scr;
    if (!modelsScore[scr.ratedTo._id]) modelsScore[scr.ratedTo._id] = 0;
    modelsScore[scr.ratedTo._id] =
      modelsScore[scr.ratedTo._id] +
      scr.personality
  });

  let data = [];
  Object.keys(models).forEach((key) => {
    data.push({
      _id: models[key].ratedTo._id,
      name: models[key].ratedTo.name,
      country: models[key].ratedTo.country,
      age: models[key].ratedTo.age,
      height: models[key].ratedTo.height,
      pic: models[key].ratedTo.pic,
      score: modelsScore[key],
    });
  });
  data.sort((a, b) => b.score - a.score);
  data = data.slice(0, contestents);

  return data;
};

const RoundsController = {
  addRound: async (req, res) => {
    try {
      const { name, qualifyContestants, CriteriaPerRound, isFirstRound } = req.body;

      if (!name || !qualifyContestants || !CriteriaPerRound)
        throw new Error("name, qualifyContestants, Criteria Per Round is required !");

      const rounds = await Rounds.create({
        name,
        qualifyContestants,
        CriteriaPerRound,
        isFirstRound,
        isStart: isFirstRound,
      });
      return res.status(200).json({ message: rounds });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getAllRound: async (_, res) => {
    try {
      const rounds = await Rounds.find({}).populate("wildCards");
      return res.status(200).json({ message: rounds });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getCurrentRound: async (_, res) => {
    try {
      const round = await Rounds.findOne({
        isStart: true,
      }).populate("wildCards");

      return res.status(200).json({ message: round });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateRound: async (req, res) => {
    try {
      const { isStart } = req.body;
      if (!isStart) throw new Error("isStart is required !");
      await Rounds.findOneAndUpdate({ isStart: true }, { isStart: false, completed:true });
      await Rounds.findByIdAndUpdate(req.params.id, {
        isStart,
      });
      return res.status(200).json({ message: "Update Round Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  endRound: async (req, res) => {
    try {
      const { isStart } = req.body;
      if (!isStart) throw new Error("isStart is required !");
      await Rounds.findOneAndUpdate({ isStart: true }, { isStart: false, completed:true });
      return res.status(200).json({ message: "Update Round Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteRound: async (req, res) => {
    try {
      await Rounds.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Delete User Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getWinners: async (req, res) => {
    try {
      const rounds = await Rounds.findById(req.params.id).populate(
        "scores.ratedTo"
      );
      const sortedModels = getSortedModels(
        rounds.scores,
        rounds.qualifyContestants
      );

      const wildcards = await Rounds.findOne({
        _id: new mongoose.Types.ObjectId(req.params.id),
      }).populate("wildCards");

      return res.status(200).json({
        message: {
          ratedTo: sortedModels,
        },
        wildcards: wildcards.wildCards,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getPrevRoundWinners: async (req, res) => {
    try {
      const prevRound = await PrevRound.findOne({});
      const rounds = await Rounds.findById(prevRound.id).populate(
        "scores.ratedTo"
      );
      const sortedModels = getSortedModels(
        rounds.scores,
        rounds.qualifyContestants
      );

      const wildcards = await Rounds.findOne({
        _id: prevRound.id,
      }).populate("wildCards");

      return res.status(200).json({
        message: {
          ratedTo: sortedModels,
        },
        wildcards: wildcards.wildCards,
      });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default RoundsController;

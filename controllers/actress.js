import Actress from "../models/actress.js";
import Rounds from "../models/rounds.js";
import fs from "fs";

const deleteImage = (url) => {
  try {
    fs.unlinkSync("uploads/actress/" + url);
  } catch (error) {
    console.log(url);
  }
};

const ActressController = {
  addActress: async (req, res) => {
    const { filename } = req.files.file[0];
    try {
      const { name, country, age, height, isWildcard } = req.body;
      if (!name || !country || !age || !height)
        throw new Error("name, country, age, and height is required !");
      if (!filename) throw new Error("Image Upload Error !");

      const actress = await Actress.create({
        name,
        country,
        age,
        height,
        pic: filename,
      });

      if (isWildcard)
        await Rounds.findByIdAndUpdate(
          isWildcard,
          {
            $push: {
              wildCards: actress._id,
            },
          },
          {
            new: true,
          }
        );

      return res.status(200).json({ message: actress });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  getActress: async (_, res) => {
    try {
      const actresses = await Actress.find({});
      return res.status(200).json({ message: actresses });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  updateActress: async (req, res) => {
    try {
      let file = null;
      if(req?.files && req?.files?.file){
        const { filename } = req?.files?.file[0];
        file = filename;
      }
      const { name, country, age, height } = req.body;

      let params = {
        ...(name ? { name } : {}),
        ...(country ? { country } : {}),
        ...(age ? { age: +age } : {}),
        ...(height ? { height } : {}),
        ...(file ? { pic: file } : {}),
      };

      if (file) {
        const actress = await Actress.findById(req.params.id);
        deleteImage(actress.pic);
      }

      const actress = await Actress.findByIdAndUpdate(req.params.id, params, {
        new: true,
      });
      return res.status(200).json({ message: actress });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
  deleteActress: async (req, res) => {
    try {
      const actress = await Actress.findById(req.params.id);
      deleteImage(actress.pic);
      await Actress.findByIdAndDelete(req.params.id);
      return res.status(200).json({ message: "Delete User Successfully !" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};

export default ActressController;

export const isAdmin = async (req, res, next) => {
  try {
    if (req.authUser.role !== "ADMIN")
      return res.status(401).json({ message: "Unauthorised", status: false });

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error", status: false });
  }
};

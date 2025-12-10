export const meController = (req, res, next) => {
  try {
    const user = req.user;
    res.status(200).json({ user });
  } catch (error) {
    console.log("Lỗi khi gọi meController", error);
    next(error);
  }
};

const mongoose = require("mongoose");

const validateObjectId = (paramName = "id") => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: `Noto'g'ri ID formati: ${id}`,
      });
    }
    next();
  };
};

module.exports = { validateObjectId };

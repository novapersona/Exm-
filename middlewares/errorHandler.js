const errorHandler = (err, req, res, next) => {
  console.error("Global Error Handler:", err);

  // Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      message: `Noto'g'ri ID: ${err.value}. Bunday formatdagi ma'lumot topilmadi`,
    });
  }

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: "Validatsiya xatosi",
      errors: messages,
    });
  }

  // MongoDB Duplicate Key Error (E11000)
  if (err.code === 11000) {
    const duplicateField = Object.keys(err.keyPattern || err.keyValue || {})[0] || "maydon";
    return res.status(409).json({
      message: `Bunday '${duplicateField}' qiymati allaqachon mavjud`,
    });
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      message: "Yaroqsiz token",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      message: "Token muddati tugagan",
    });
  }

  // Generic internal server error
  return res.status(err.status || 500).json({
    message: err.message || "Serverda ichki xatolik yuz berdi",
  });
};

module.exports = { errorHandler };

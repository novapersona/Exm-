const { verifyToken } = require("../helpers/jwtHelper");

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Avtorizatsiyadan o'tilmagan. Token topilmadi",
    });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Yaroqsiz yoki muddati o'tgan token",
      error: error.message,
    });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyAuthToken(req, res, () => {
    if (req.user && req.user.role === "admin") {
      return next();
    }
    return res.status(403).json({
      message: "Ruxsat etilmagan. Faqat Adminlar uchun",
    });
  });
};

const verifyCustomer = (req, res, next) => {
  verifyAuthToken(req, res, () => {
    if (req.user && (req.user.role === "customer" || req.user.role === "admin")) {
      return next();
    }
    return res.status(403).json({
      message: "Ruxsat etilmagan. Faqat Customerlar uchun",
    });
  });
};

const verifyCreator = (req, res, next) => {
  verifyAuthToken(req, res, () => {
    if (req.user && req.user.role === "admin" && req.user.is_creator) {
      return next();
    }
    return res.status(403).json({
      message: "Ruxsat etilmagan. Faqat Creator Adminlar uchun",
    });
  });
};

module.exports = {
  verifyAuthToken,
  verifyAdmin,
  verifyCustomer,
  verifyCreator,
};

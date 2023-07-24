const jwt = require("jsonwebtoken");
const secret = process.env.SECRET_KEY

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Ошибка проверки логина" });
    }

    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Ошибка проверки логина" });
  }
};

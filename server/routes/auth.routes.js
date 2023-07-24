const Router = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const router = new Router();
const authMiddleware = require("../middleware/auth.middleware");
const fileService = require("../services/fileService");
const File = require("../models/File");
const secret = process.env.SECRET_KEY

router.post(
  "/registration",
  [
    check("login").custom((login) => {
      if (!login.length) return Promise.reject("Введите логин");
      const query = User.findOne({ login });
      return query.exec().then((user) => {
        if (user) return Promise.reject("Пользователь уже существует");
      });
    }),
    check("password", "Пароль от 5 символов").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Проверьте вводимые данные", ...errors });
      }
      const { login, password } = req.body;

      const hashPassword = await bcrypt.hash(password, 8);
      const user = new User({ login, password: hashPassword });
      await user.save();
      await fileService.createDir(req, new File({ user: user.id, name: "" }));
      return res.json({ message: "Регистрация успешна" });
    } catch (e) {
      console.log(e);
      res.send({ message: "Ошибка сервера" });
    }
  }
);

router.post("/login", async (req, res) => {
  try {
    const { login, password } = req.body;
    const user = await User.findOne({ login });

    if (!user) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }

    const isPassValid = bcrypt.compareSync(password, user.password);

    if (!isPassValid) {
      return res.status(400).json({ message: "Неверный логин или пароль" });
    }
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "12h" });
    return res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        freeSpace: user.freeSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Ошибка сервера" });
  }
});

router.get("/auth", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id });
    const token = jwt.sign({ id: user.id }, secret, { expiresIn: "12h" });
    return res.json({
      token,
      user: {
        id: user.id,
        login: user.login,
        freeSpace: user.freeSpace,
        usedSpace: user.usedSpace,
        avatar: user.avatar,
      },
    });
  } catch (e) {
    console.log(e);
    res.send({ message: "Ошибка сервера" });
  }
});
module.exports = router;

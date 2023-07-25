const fileService = require("../services/fileService");
const User = require("../models/User");
const File = require("../models/File");
const fs = require("fs");
const path = require("path");
const uuid = require("uuid");

class FileController {
  async createDir(req, res) {
    try {
      const { name, type, parent } = req.body;
      const file = new File({ name, type, parent, user: req.user.id });
      const parentFile = await File.findOne({ _id: parent });
      if (!parentFile) {
        file.path = name;
        await fileService.createDir(req, file);
      } else {
        file.path = path.join(`${parentFile.path}`, `${file.name}`);
        await fileService.createDir(req, file);
        parentFile.child.push(file._id);
        await parentFile.save();
      }
      file.type = "dir";
      await file.save();
      return res.json(file);
    } catch (err) {
      return res.status(400).json(err);
    }
  }

  async fetchFiles(req, res) {
    try {
      const { sort, dir } = req.query;
      const sortDirection = dir === "asc" ? 1 : -1;

      let files;
      switch (sort) {
        case "name":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ name: sortDirection });
          break;
        case "size":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ size: sortDirection });
          break;
        case "type":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ type: sortDirection, extension: sortDirection });
          break;
        case "date":
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          }).sort({ date: sortDirection });
          break;
        default:
          files = await File.find({
            user: req.user.id,
            parent: req.query.parent,
          });
          break;
      }
      return res.json(files);
    } catch (err) {
      return res.status(500).json({ message: "Невозможно получить файлы", err });
    }
  }

  async getDirBreadCrumbs(req, res) {
    try {
      const dirId = req.query.id;
      if (!dirId) return res.json([]);
      let directory = await File.find({
        _id: dirId,
        user: req.user.id,
        type: "dir",
      });
      // console.log(directory)
      return res.json(directory);
    } catch (err) {
      return res
        .status(400)
        .json({ message: "Ошибка получения хлебных крошек", err });
    }
  }

  async searchFile(req, res) {
    try {
      const searchName = req.query.search;
      let files = await File.find({ user: req.user.id });
      files = files.filter((file) => file.name.includes(searchName));
      return res.json(files);
    } catch (err) {
      return res.status(400).json({ message: "Ошибка поиска", err });
    }
  }

  async uploadFile(req, res) {
    try {
      const file = req.files.file;
      const parentFile = await File.findOne({
        user: req.user.id,
        _id: req.body.parent,
      });
      const user = await User.findOne({ _id: req.user.id });

      if (user.usedSpace + file.size > user.freeSpace)
        return res.status(400).json({ message: "Свободное место закончилось" });

      user.usedSpace = user.usedSpace + file.size;

      let fPath;
      if (parentFile) {
        fPath = path.join(
          `${req.filePath}`,
          `${user._id}`,
          `${parentFile.path}`,
          `${file.name}`
        );
      } else {
        fPath = path.join(`${req.filePath}`, `${user._id}`, `${file.name}`);
      }
      if (fs.existsSync(fPath)) {
        return res.status(400).json({
          message:
            file.type === "dir"
              ? `Папка ${file.name} уже есть на сервере`
              : `Файл ${file.name} еще есть на сервере`,
        });
      }
      file.mv(fPath);
      const extension = file.name.split(".").pop().replace(".", "");
      let filePath = file.name;
      if (parentFile) {
        filePath = path.join(`${parentFile.path}`, `${file.name}`);
      }
      const dbFile = new File({
        name: file.name,
        type: "file",
        extension,
        size: file.size,
        path: filePath,
        parent: parentFile ? parentFile._id : null,
        user: user._id,
      });

      await dbFile.save();
      await user.save();

      return res.json(dbFile);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Невозможно загрузить файл", err });
    }
  }

  async downloadFile(req, res) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        user: req.user.id,
      });
      const fPath = fileService.getPath(req, file);
      if (fs.existsSync(fPath)) {
        return res.download(fPath, file.name);
      }
      return res.status(400).json({ message: "Ошибка загрузки файла" });
    } catch (err) {
      return res.status(500).json({ message: "Ошибка загрузки файла", err });
    }
  }
  async deleteFile(req, res) {
    try {
      const file = await File.findOne({
        _id: req.query.id,
        user: req.user.id,
      });
      if (!file) return res.status(400).json({ message: "Файл не найден" });
      await fileService.deleteFile(req, file);
      await file.deleteOne();
      return res.json({
        message:
          file.type === "dir"
            ? `Папка ${file.name} удалена`
            : `Файл ${file.name} удален`,
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  }

  async shareFile(req, res) {
    try {
      const dbFile = await File.findOne({
        _id: req.body.id,
        user: req.user.id,
      });
      // Если файла нет на сервере
      if (!dbFile) return res.status(400).json({ message: "Файл не найден" });
      // Если шарится папка
      if (dbFile.type === "dir")
        return res.status(400).json({ message: "Папку раздать невозможно" });
      // Если файл уже расшарен
      if (dbFile.access_link) return res.json({ link: dbFile.access_link });
      const fileExt = path.extname(dbFile.name);
      const sharedFileName = (await uuid.v4()) + fileExt;
      const sharedFilePath =
        // path.resolve("..", fileService.getPath(req, dbFile)) + "\\static\\" + sharedFileName;
        path.join(__dirname, "..", "static", sharedFileName);
      fs.copyFileSync(fileService.getPath(req, dbFile), sharedFilePath);
      dbFile.access_link = sharedFileName;
      await dbFile.save();
      return res.json({
        message: `Ссылка на файл ${dbFile.name} создана`,
        link: dbFile.access_link,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Ошибка создания ссылки для файла", err });
    }
  }
}

module.exports = new FileController();

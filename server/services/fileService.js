const fs = require("fs");
const File = require("../models/File");

class FileService {
  createDir(req, file) {
    // const filePath = `${filePathConfig}\\${file.user}\\${file.path}`;
    const filePath = this.getPath(req, file);
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath);
          return resolve({ message: `Папка ${file.name} создана` });
        } else {
          return reject({ message: `Папка ${file.name} уже есть на сервере` });
        }
      } catch (e) {
        console.log(e);
        return reject({ message: "Ошибка создания папки" });
      }
    });
  }
  deleteFile(req, file) {
    const path = this.getPath(req, file);
    return new Promise((resolve, reject) => {
      try {
        if (file.type === "dir") {
          fs.rmdirSync(path);
        } else {
          fs.unlinkSync(path);
        }
        return resolve();
      } catch (e) {
        console.log(e);
        return reject({ message: `Папка ${file.name} не пуста` });
      }
    });
  }
  getPath(req, file) {
    return `${req.filePath}\\${file.user}\\${file.path}`;
  }
  getStaticPath(req) {
    return `${req.filePath}\\static`;
  }
}

module.exports = new FileService();

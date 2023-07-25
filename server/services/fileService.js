const fs = require("fs");
const File = require("../models/File");
const path = require("path");

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
        return reject({ message: "Ошибка создания папки", err: e });
      }
    });
  }
  deleteFile(req, file) {
    const filePath = this.getPath(req, file);
    console.log(file);
    return new Promise((resolve, reject) => {
      try {
        if (file.type === "dir") {
          fs.rmdirSync(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
        return resolve();
      } catch (e) {
        return reject({
          message:
            file.type === "dir"
              ? `Папка ${file.name} не пуста`
              : `Ошибка удаления файла ${file.name}`,
          err: e,
        });
      }
    });
  }
  getPath(req, file) {
    return path.join(`${req.filePath}`, `${file.user}`, `${file.path}`);
  }
  getStaticPath(req) {
    return path.join(`${req.filePath}`, `static`);
  }
}

module.exports = new FileService();

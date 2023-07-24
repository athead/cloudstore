require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const dbUrl = process.env.DATABASE_URL;
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 5000;

const authRouter = require("./routes/auth.routes");
const fileRouter = require("./routes/file.routes");

const corsMiddleware = require("./middleware/cors.middleware");
const filePathMiddleware = require("./middleware/filepath.middleware");

app.use(corsMiddleware);
app.use(filePathMiddleware(path.resolve(__dirname, "files")));
app.use(express.json());
app.use(express.static("static"));
app.use(
  fileUpload({
    defCharset: "utf8",
    defParamCharset: "utf8",
  })
);
app.use("/api/auth", authRouter);
app.use("/api/files", fileRouter);

app.listen(PORT, () => {
  try {
    mongoose.connect(dbUrl);
    console.log("Server started on port", PORT);
  } catch (e) {
    console.log(e);
  }
});

// module.exports = app;

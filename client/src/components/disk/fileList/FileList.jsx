import React from "react";
import "./fileList.css";
import { useSelector } from "react-redux";
import File from "./file/File";

const FileList = ({ isButtonsVisible }) => {
  const loader = useSelector((state) => state.app.loader);

  const files = useSelector((state) => state.files.files).map((file) => (
    <File key={file._id} file={file} />
  ));

  if (loader) {
    return (
      <div className="center__screen__wrapper">
        <div className="center__screen lds-dual-ring"></div>
      </div>
    );
  }

  if (files.length > 0)
    return (
      <div
        className={
          "filelist " + (isButtonsVisible ? "" : "margin_on_fixed_buttons")
        }
      >
        {files}
      </div>
    );
  else
    return (
      <div className="center__screen__wrapper">
        <p className="center__screen files__notfound">
          Файлов не найдено <br />
          😥
        </p>
      </div>
    );
};

export default FileList;

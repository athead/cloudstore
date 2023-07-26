import React, { useEffect, useRef } from "react";
import "./disk.css";
import { useDispatch, useSelector } from "react-redux";
import {
  uploadFile,
  downloadFile,
  deleteFile,
  shareFile,
} from "../../actions/file";
import createFolder from "../../assets/img/icons8-folder.svg";
import deleteFiles from "../../assets/img/icons8-trash-can.svg";
import uploadLogo from "../../assets/img/icons8-upload-to-the-cloud.svg";
import shareLogo from "../../assets/img/icons8-share.svg";
// import cancelLogo from "../../assets/img/icons8-cancel.svg";
import downloadLogo from "../../assets/img/icons8-download.png";

import {
  clearSelected,
  setPopupDisplay,
  setPopupShareDisplay,
} from "../../store/reducers/fileReducer";
import Filter from "./Filter";

const DiskButtons = ({
  filter,
  isVisible,
  currentDir,
  onFilter,
  onVisible,
}) => {
  const dispatch = useDispatch();
  const selectedFiles = useSelector((state) => state.files.selectedFiles);
  const inputRef = useRef(null);

  const showPopupHandler = () => {
    dispatch(setPopupDisplay("flex"));
  };

  useEffect(() => {
    onVisible(isVisible);
  });
  const fileUploadHandler = (event) => {
    const files = [...event.target.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    dispatch(clearSelected());
  };

  const deleteFilesHandler = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      dispatch(deleteFile(file));
    });
    dispatch(clearSelected());
  };

  const shareFilesHandler = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      shareFile(file);
    });
    dispatch(setPopupShareDisplay("flex"));
  };

  const downloadFiles = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      downloadFile(file);
    });
    dispatch(clearSelected());
  };

  return (
    <div className={"disk__btns " + (isVisible ? "" : "fixed")}>
      <button className="btn icon" onClick={() => showPopupHandler()}>
        <img src={createFolder} alt="Создать папку" className="btn__icon" />
      </button>
      <button className="btn icon">
        <img
          src={uploadLogo}
          onClick={() => inputRef.current.click()}
          alt="Загрузить"
          className="btn__icon"
        />
      </button>
      <button
        className={
          "btn icon " + (selectedFiles?.length > 0 ? "" : "scaled_down")
        }
        onClick={() => deleteFilesHandler(selectedFiles)}
      >
        <img src={deleteFiles} alt="Удалить выбранные" className="btn__icon" />
      </button>
      <button
        className={
          "btn icon " +
          (selectedFiles?.filter((e) => e.type !== "dir").length > 0
            ? ""
            : "scaled_down")
        }
        onClick={() => shareFilesHandler(selectedFiles)}
      >
        <img src={shareLogo} alt="Шерить файлы" className="btn__icon" />
      </button>
      <button
        className={
          "btn icon " + (selectedFiles?.length > 0 ? "" : "scaled_down")
        }
        onClick={() => downloadFiles(selectedFiles)}
      >
        <img src={downloadLogo} alt="Загрузить" className="btn__icon" />
      </button>
      {/* <div style={{ marginLeft: "auto" }}>
        <span
          className={
            "inline-text " + (selectedFiles?.length > 1 ? "" : "scaled_down")
          }
          style={{ marginLeft: "auto" }}
        >
          {selectedFiles?.length} эл.
        </span>
        <button
          className={
            "btn icon " + (selectedFiles?.length > 1 ? "" : "scaled_down")
          }
          onClick={() => dispatch(clearSelected())}
        >
          <img src={cancelLogo} alt="Очистить выбор" className="btn__icon" />
        </button> 
      </div>*/}
      <Filter filter={filter} onFilter={(e) => onFilter(e)} />
      <input
        multiple={true}
        type="file"
        ref={inputRef}
        onChange={(event) => fileUploadHandler(event)}
        style={{ display: "none" }}
      ></input>
    </div>
  );
};

export default DiskButtons;

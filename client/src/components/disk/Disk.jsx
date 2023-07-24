import React, { useEffect, useRef, useState } from "react";
import "./disk.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getFiles,
  uploadFile,
  downloadFile,
  deleteFile,
  shareFile,
} from "../../actions/file";
import FileList from "./fileList/FileList";
// import backLogo from "../../assets/img/left-arrow-back.svg";
import createFolder from "../../assets/img/icons8-folder.svg";
import deleteFiles from "../../assets/img/icons8-trash-can.svg";
import uploadLogo from "../../assets/img/icons8-upload-to-the-cloud.svg";
import shareLogo from "../../assets/img/icons8-share.svg";
import cancelLogo from "../../assets/img/icons8-cancel.svg";
import downloadLogo from "../../assets/img/icons8-download.png";
import PopupCreateFolder from "./PopupCreateFolder";
import PopupShare from "./PopupShare";

import {
  clearSelected,
  setCurrentDir,
  setPopupDisplay,
  setPopupShareDisplay,
} from "../../store/reducers/fileReducer";
import BreadCrumbs from "./BreadCrumbs";
import Uploader from "./uploader/Uploader";
import Filter from "./Filter";

const Disk = () => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  // const dirStack = useSelector((state) => state.files.dirStack);
  const selectedFiles = useSelector((state) => state.files.selectedFiles);
  const breadCrumbs = useSelector((state) => state.files.breadCrumbs);

  const inputRef = useRef(null);

  const [filter, setFilter] = useState({
    value: "type",
    // prevValue: "type",
    direction: "asc",
  });
  const [dragEnter, setDragEnter] = useState(false);

  // handle drag events
  function dragEnterHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(true);
  }

  function dragLeaveHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    setDragEnter(false);
  }

  function dropHandler(event) {
    event.preventDefault();
    event.stopPropagation();
    let files = [...event.dataTransfer.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    setDragEnter(false);
  }

  useEffect(() => {
    dispatch(getFiles(currentDir, filter.value, filter.direction));
    dispatch(clearSelected());
  }, [dispatch, currentDir, filter]);

  const showPopupHandler = () => {
    dispatch(setPopupDisplay("flex"));
  };

  // function backDirHandler() {
  //   const backDirId = dirStack.pop();
  //   dispatch(setCurrentDir(backDirId));
  //   dispatch(clearSelected());
  // }

  function handleDirChange(e, dirId) {
    const event = e || window.event;
    event.preventDefault();
    dispatch(setCurrentDir(dirId));
    dispatch(clearSelected());
  }

  const fileUploadHandler = (event) => {
    const files = [...event.target.files];
    files.forEach((file) => dispatch(uploadFile(file, currentDir)));
    dispatch(clearSelected());
  };

  const deleteFilesHandler = (selectedFiles) => {
    selectedFiles.forEach((file) => {
      console.log(file);
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

  return !dragEnter ? (
    <div
      className="disk"
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <BreadCrumbs crumbs={breadCrumbs} onChangeDirCallback={handleDirChange} />
      <div className="disk__btns">
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
          <img
            src={deleteFiles}
            alt="Удалить выбранные"
            className="btn__icon"
          />
        </button>
        <button
          className={
            "btn icon " + (selectedFiles?.length > 0 ? "" : "scaled_down")
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
        <span
          className={
            "inline-text " + (selectedFiles?.length > 1 ? "" : "scaled_down")
          }
          style={{ marginLeft: "auto" }}
        >
          Выбрано: {selectedFiles?.length}
        </span>
        <button
          className={
            "btn icon " + (selectedFiles?.length > 1 ? "" : "scaled_down")
          }
          onClick={() => dispatch(clearSelected())}
        >
          <img src={cancelLogo} alt="Очистить выбор" className="btn__icon" />
        </button>
        <input
          multiple={true}
          type="file"
          ref={inputRef}
          onChange={(event) => fileUploadHandler(event)}
          style={{ display: "none" }}
        ></input>

        <Filter filter={filter} onFilter={(e) => setFilter(e)} />
      </div>
      <FileList />
      <Uploader />
      <PopupCreateFolder />
      <PopupShare />
    </div>
  ) : (
    <div
      className="disk dragndrop"
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <div className="dragndrop__input">
        <svg
          viewBox="0 0 24 24"
          className="dragndrop__icon"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12.5535 2.49392C12.4114 2.33852 12.2106 2.25 12 2.25C11.7894 2.25 11.5886 2.33852 11.4465 2.49392L7.44648 6.86892C7.16698 7.17462 7.18822 7.64902 7.49392 7.92852C7.79963 8.20802 8.27402 8.18678 8.55352 7.88108L11.25 4.9318V16C11.25 16.4142 11.5858 16.75 12 16.75C12.4142 16.75 12.75 16.4142 12.75 16V4.9318L15.4465 7.88108C15.726 8.18678 16.2004 8.20802 16.5061 7.92852C16.8118 7.64902 16.833 7.17462 16.5535 6.86892L12.5535 2.49392Z" />
          <path d="M3.75 15C3.75 14.5858 3.41422 14.25 3 14.25C2.58579 14.25 2.25 14.5858 2.25 15V15.0549C2.24998 16.4225 2.24996 17.5248 2.36652 18.3918C2.48754 19.2919 2.74643 20.0497 3.34835 20.6516C3.95027 21.2536 4.70814 21.5125 5.60825 21.6335C6.47522 21.75 7.57754 21.75 8.94513 21.75H15.0549C16.4225 21.75 17.5248 21.75 18.3918 21.6335C19.2919 21.5125 20.0497 21.2536 20.6517 20.6516C21.2536 20.0497 21.5125 19.2919 21.6335 18.3918C21.75 17.5248 21.75 16.4225 21.75 15.0549V15C21.75 14.5858 21.4142 14.25 21 14.25C20.5858 14.25 20.25 14.5858 20.25 15C20.25 16.4354 20.2484 17.4365 20.1469 18.1919C20.0482 18.9257 19.8678 19.3142 19.591 19.591C19.3142 19.8678 18.9257 20.0482 18.1919 20.1469C17.4365 20.2484 16.4354 20.25 15 20.25H9C7.56459 20.25 6.56347 20.2484 5.80812 20.1469C5.07435 20.0482 4.68577 19.8678 4.40901 19.591C4.13225 19.3142 3.9518 18.9257 3.85315 18.1919C3.75159 17.4365 3.75 16.4354 3.75 15Z" />
        </svg>
        <span className="dragndrop__text">Перетащите для загрузки</span>
      </div>
    </div>
  );
};

export default Disk;

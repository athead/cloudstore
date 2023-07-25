import React from "react";
import "./file.css";
import dirLogo from "../../../../assets/img/icons8-opened-folder.svg";
import fileLogo from "../../../../assets/img/icons8-file.svg";
// import fileDocument from "../../../../assets/img/icons8-document.svg";
import fileImage from "../../../../assets/img/icons8-image-file.svg";
import checkLogo from "../../../../assets/img/icons8-check.svg";
import pdfLogo from "../../../../assets/img/icons8-pdf.png";
import videoLogo from "../../../../assets/img/icons8-video.png";
import excelLogo from "../../../../assets/img/icons8-excel.png";
import wordLogo from "../../../../assets/img/icons8-word.png";
import txtLogo from "../../../../assets/img/icons8-txt.png";
import csvLogo from "../../../../assets/img/icons8-csv.png";
import shareLogo from "../../../../assets/img/icons8-share_link.svg";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelected,
  pushToSelected,
  pushToStack,
  removeFromSelected,
  setCurrentDir,
} from "../../../../store/reducers/fileReducer";
import { toast } from "react-toastify";

const File = ({ file }) => {
  const dispatch = useDispatch();
  const currentDir = useSelector((state) => state.files.currentDir);
  const selectedFiles = useSelector((state) => state.files.selectedFiles);

  const [searchParams, setSearchParams] = useSearchParams();

  function openDirHandler(file) {
    if (file.type === "dir") {
      // dispatch(breadCrumbsPush(file));
      dispatch(pushToStack(currentDir));
      dispatch(setCurrentDir(file._id));
      dispatch(clearSelected());

      setSearchParams({
        dir: file._id,
        ...(searchParams.get("value")
          ? { value: searchParams.get("value") }
          : {}),
        ...(searchParams.get("direction")
          ? { direction: searchParams.get("direction") }
          : {}),
      });
    }
  }

  const checkSelected = (file) => {
    return selectedFiles.includes(file);
  };
  const selectFileHandler = (file) => {
    if (checkSelected(file)) {
      dispatch(removeFromSelected(file));
    } else {
      dispatch(pushToSelected(file));
    }
  };

  function humanFileSize(bytes, si = false, dp = 1) {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(bytes) < thresh) {
      return bytes + " B";
    }

    const units = si
      ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
      : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    let u = -1;
    const r = 10 ** dp;

    do {
      bytes /= thresh;
      ++u;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= thresh &&
      u < units.length - 1
    );

    return bytes.toFixed(dp) + " " + units[u];
  }

  const getFileImage = (ext) => {
    switch (ext) {
      case "txt":
        return txtLogo;
      case "csv":
        return csvLogo;
      case "pdf":
        return pdfLogo;
      case "xls":
        return excelLogo;
      case "xlsx":
        return excelLogo;
      case "doc":
        return wordLogo;
      case "docx":
        return wordLogo;
      case "mp4":
        return videoLogo;
      case "avi":
        return videoLogo;
      case "jpg":
        return fileImage;
      case "png":
        return fileImage;
      default:
        return fileLogo;
    }
  };

  function copyToBuffer(file) {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_SERVER_URL}/${file.access_link}`
    );
    toast(`Ссылка на файл ${file.name} скопирована в буффер обмена`, {
      type: "success",
    });
  }

  const timeFormatOptions = { day: "2-digit", month: "short", year: "numeric" };

  return (
    <div
      className={
        "prevent-select file " +
        (file.type === "dir" ? "folder " : "") +
        (checkSelected(file) === true ? "bordered" : "")
      }
      onDoubleClick={() => openDirHandler(file)}
    >
      <div
        className={
          "file__border__selected " + (checkSelected(file) ? "active" : "")
        }
        onClick={() => selectFileHandler(file)}
      >
        <img
          src={checkLogo}
          alt="check"
          className={
            "file__border__selected__icon " +
            (checkSelected(file) ? "active" : "")
          }
        />
      </div>
      {file?.extension?.length > 0 && (
        <div className="file__border__extension">{file.extension}</div>
      )}
      {file?.access_link?.length > 0 && (
        <button
          className="btn icon simple file__shared_icon"
          onClick={() => copyToBuffer(file)}
        >
          <LazyLoadImage
            src={shareLogo}
            alt="Copy link"
            className="btn__icon sm"
          />
        </button>
      )}
      {/* <div className="file__border">
        <div className="file__border__name">{file.name}</div>slice(0, 10)
      </div> */}
      <LazyLoadImage
        src={file.type === "dir" ? dirLogo : getFileImage(file.extension)}
        alt={file.name}
        className="file__img"
      />
      <div className="file__border__name">{file.name}</div>
      <div className="file__date">
        {new Date(file.date).toLocaleString("ru-RU", timeFormatOptions)}
      </div>
      {file.size > 0 && (
        <div className="file__size">{humanFileSize(file.size)}</div>
      )}
    </div>
  );
};

export default File;

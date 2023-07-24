import React from "react";
import cancelLogo from "../../../assets/img/icons8-cancel.svg";
import "./uploader.css";
import {
  hideUploader,
  removeUploadFile,
} from "../../../store/reducers/uploadReducer";
import { useDispatch, useSelector } from "react-redux";

const Uploader = () => {
  const files = useSelector((state) => state.upload.files);
  const isVisible = useSelector((state) => state.upload.isVisible);
  const dispatch = useDispatch();

  const countInProgress = () => {
    return files.filter((el) => el.progress === 100).length;
  };

  const countTotal = () => {
    return files.length;
  };
  return (
    isVisible && (
      <div className="uploader">
        <div className="uploader__header">
          <div className="uploader__title">
            {countInProgress() === countTotal() ? "Загружается" : "Загружено"}{" "}
            {countInProgress()} из {countTotal()}
          </div>
          <div
            className="uploader__hide"
            onClick={() => dispatch(hideUploader())}
          >
            -
          </div>
        </div>
        <div className="uploader__body">
          {files.map((file, idx) => (
            <div key={idx} className="uploader__body__file">
              <div className="uploader__body__file__name">{file.name}</div>
              <p className="uploader__body__file__progress__counter">
                {file.progress}%
              </p>
              <img
                src={cancelLogo}
                onClick={() => dispatch(removeUploadFile(file.id))}
                alt="X"
                className="uploader__body__file__cancel-img"
              />
              <div className="uploader__body__file__progress_overlay"></div>
              <div className="uploader__body__file__progress">
                <div className="bar" style={{ width: file.progress + "%" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default Uploader;

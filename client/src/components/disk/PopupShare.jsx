import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelected,
  setPopupShareDisplay,
} from "../../store/reducers/fileReducer";
import { shareFile } from "../../actions/file";
import copyLogo from "../../assets/img/icons8-copylink.png";
import closeLogo from "../../assets/img/icons8-close.svg";
import createLinkLogo from "../../assets/img/icons8-create-link.png";

import { toast } from "react-toastify";

const Popup = () => {
  // const sharedFiles = useSelector((state) => state.files.sharedFiles);
  const [isLoading, setIsLoading] = useState(false);
  const selectedFiles = useSelector((state) => state.files.selectedFiles);
  const popupShareDisplay = useSelector(
    (state) => state.files.popupShareDisplay
  );
  const dispatch = useDispatch();

  function copyToBuffer(file) {
    navigator.clipboard.writeText(
      `${process.env.REACT_APP_SERVER_URL}/${file.access_link}`
    );
    toast(`Ссылка на файл ${file.name} скопирована в буффер обмена`, {
      type: "success",
    });
  }

  const getSelectedFiles = () => {
    return selectedFiles.filter((file) => file.type !== "dir");
  };

  function createLink(file) {
    setIsLoading(true);
    dispatch(shareFile(file))
      .then(({access_link}) => {
        setIsLoading(false);
        selectedFiles.find((f) => f._id === file._id).access_link = access_link;
      })
      .catch(() => {
        setIsLoading(false);
      });
  }

  const closePopup = () => {
    dispatch(setPopupShareDisplay("none"));
    // dispatch(getFiles());
    dispatch(clearSelected());
  };

  return (
    <div
      className="popup"
      onClick={() => closePopup()}
      style={{ display: popupShareDisplay }}
    >
      <div
        className="popup__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="popup__header">
          <div className="popup__title">Создание ссылок на файлы</div>
          <button className="btn clear" onClick={() => closePopup()}>
            <img src={closeLogo} alt="Назад" className="btn__icon sm" />
          </button>
        </div>
        {getSelectedFiles().map((file) => (
          <div className="sharedfile__row" key={file._id}>
            <p className="sharedfile__row_name">{file.name}</p>
            {isLoading ? (
              <div className="lds-dual-ring sm"></div>
            ) : file?.access_link ? (
              <button className="btn icon" onClick={() => copyToBuffer(file)}>
                <img src={copyLogo} alt="Copy" className="btn__icon" />
              </button>
            ) : (
              <button className="btn icon" onClick={() => createLink(file)}>
                <img src={createLinkLogo} alt="Copy" className="btn__icon" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Popup;

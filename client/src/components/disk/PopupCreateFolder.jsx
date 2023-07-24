import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearSelected, setPopupDisplay } from "../../store/reducers/fileReducer";
import { createDir } from "../../actions/file";
import closeLogo from "../../assets/img/icons8-close.svg";

const Popup = () => {
  const [dirName, setDirName] = useState("");
  const popupDisplay = useSelector((state) => state.files.popupDisplay);
  const currentDir = useSelector((state) => state.files.currentDir);
  const dispatch = useDispatch();

  function createHandler() {
    dispatch(createDir(currentDir, dirName));
    dispatch(clearSelected());
    dispatch(setPopupDisplay("none"));
  }

  return (
    <div
      className="popup"
      onClick={() => dispatch(setPopupDisplay("none"))}
      style={{ display: popupDisplay }}
    >
      <div
        className="popup__content"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="popup__header">
          <div className="popup__title">Создать новую папку</div>
          <button
            className="btn clear"
            onClick={() => dispatch(setPopupDisplay("none"))}
          >
            <img src={closeLogo} alt="Назад" className="btn__icon sm" />
          </button>
        </div>
        <input
          type="text"
          placeholder="Введите название папки..."
          value={dirName}
          onChange={(e) => setDirName(e.target.value)}
        />
        <button className="btn" onClick={() => createHandler()}>
          <span>Создать</span>
        </button>
      </div>
    </div>
  );
};

export default Popup;

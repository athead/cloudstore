import React, { useEffect, useState } from "react";
import "./disk.css";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getFiles, uploadFile, getBreadcrumbsToDir } from "../../actions/file";
import FileList from "./fileList/FileList";
import PopupCreateFolder from "./PopupCreateFolder";
import PopupShare from "./PopupShare";
import TrackVisibility from "react-on-screen";

import { clearSelected, setCurrentDir } from "../../store/reducers/fileReducer";
import BreadCrumbs from "./BreadCrumbs";
import Uploader from "./uploader/Uploader";
import DiskButtons from "./DiskButtons";

const Disk = () => {
  const dispatch = useDispatch();

  const currentDir = useSelector((state) => state.files.currentDir);
  const breadCrumbs = useSelector((state) => state.files.breadCrumbs);

  const [searchParams, setSearchParams] = useSearchParams();
  const [isButtonsVisible, setIsButtonsVisible] = useState(false);
  // handle filter Events
  const onFilter = (e) => {
    setFilter(e);
    setSearchParams({
      ...(searchParams.get("dir") ? { dir: searchParams.get("dir") } : {}),
      value: e.value,
      direction: e.direction,
    });
  };

  const [filter, setFilter] = useState({
    value: searchParams.get("value") || "type",
    direction: searchParams.get("direction") || "asc",
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
    const dir = searchParams.get("dir") || undefined;
    setFilter({
      value: searchParams.get("value") || "type",
      direction: searchParams.get("direction") || "asc",
    });
    dispatch(getBreadcrumbsToDir(dir));
    dispatch(getFiles(dir, filter.value, filter.direction));
    dispatch(clearSelected());
    // dispatch(setCurrentDir(dir ? dir : currentDir));
  }, [dispatch, currentDir, filter.value, filter.direction, searchParams]);

  function handleDirChange(dirId = undefined) {
    dispatch(setCurrentDir(dirId));
    setSearchParams({
      ...(dirId ? { dir: dirId } : {}),
      ...(searchParams.get("value")
        ? { value: searchParams.get("value") }
        : {}),
      ...(searchParams.get("direction")
        ? { direction: searchParams.get("direction") }
        : {}),
    });
  }

  return !dragEnter ? (
    <div
      className="disk"
      onDrop={dropHandler}
      onDragEnter={dragEnterHandler}
      onDragLeave={dragLeaveHandler}
      onDragOver={dragEnterHandler}
    >
      <BreadCrumbs crumbs={breadCrumbs} onChangeDirCallback={handleDirChange} />
      <TrackVisibility partialVisibility>
        <DiskButtons
          filter={filter}
          currentDir={currentDir}
          onFilter={onFilter}
          onVisible={(e) => setIsButtonsVisible(e)}
        />
      </TrackVisibility>
      <FileList isButtonsVisible={isButtonsVisible} />
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

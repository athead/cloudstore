import React, { useRef, useState } from "react";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../store/reducers/appReducer";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuState } from "../../actions/app";

const Search = ({ opened, onChange, onClose }) => {
  const dispatch = useDispatch();
  const inputReference = useRef(null);

  const currentDir = useSelector((state) => state.files.currentDir);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);

  const handleClick = () => dispatch(changeMenuState(false));
  //   const [searchOpened, setSearchOpened] = useState(false);

  function searchChangeHandler(e) {
    setSearchText(e.target.value);
    if (searchTimeout !== false) {
      clearTimeout(searchTimeout);
    }
    dispatch(showLoader());
    if (e.target.value !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(searchFiles(value));
            onChange(value);
          },
          500,
          e.target.value
        )
      );
    } else {
      dispatch(getFiles(currentDir));
    }
  }
  return (
    <div className="search-box">
      <input
        type="text"
        ref={inputReference}
        onBlur={() => onClose(false)}
        onClick={() => handleClick()}
        value={searchText}
        onChange={(e) => searchChangeHandler(e)}
        placeholder="Введите для поиска..."
        required
      />
      {/* setSearchOpened(false) 
      onFocus={() => opened(true)}
      <button type="submit" className="go-icon">
            <img src={searchLogo} alt="Search" className="nav-logo-img" />
          </button> */}
    </div>
  );
};

export default Search;

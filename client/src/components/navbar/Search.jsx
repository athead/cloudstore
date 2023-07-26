import React, { useRef, useState } from "react";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../store/reducers/appReducer";
import { useDispatch, useSelector } from "react-redux";
import { changeMenuState } from "../../actions/app";
import cancelLogo from "../../assets/img/icons8-cancel.svg";
import useOnClickOutside from "../../hooks/onClickOutside";

const Search = ({ opened, onChange, onClose }) => {
  const dispatch = useDispatch();
  const inputReference = useRef();

  const currentDir = useSelector((state) => state.files.currentDir);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);

  const handleClick = () => dispatch(changeMenuState(false));

  useOnClickOutside(inputReference, () => {
    // Only if filter is open
    if (opened) onClose();
  });
  const handleClearSearch = () => {
    setSearchText("");
    dispatch(showLoader());
    onChange("");
    dispatch(searchFiles(""))
  }

  const handleSearch = (text) => {
    setSearchText(text);
    if (searchTimeout !== false) {
      clearTimeout(searchTimeout);
    }
    dispatch(showLoader());
    if (text !== "") {
      setSearchTimeout(
        setTimeout(
          (value) => {
            dispatch(searchFiles(value));
            onChange(value);
          },
          500,
          text
        )
      );
    } else {
      dispatch(getFiles(currentDir));
    }
  };
  const searchSubmit = (event) => {
    event.preventDefault();
    handleSearch(searchText);
  };

  function searchChangeHandler(e) {
    handleSearch(e.target.value);
  }
  return (
    <form
      ref={inputReference}
      className="search-box"
      onSubmit={(e) => searchSubmit(e)}
    >
      <input
        type="text"
        onBlur={() => onClose(false)}
        onClick={() => handleClick()}
        value={searchText}
        onChange={(e) => searchChangeHandler(e)}
        placeholder="Введите для поиска..."
        required
      />
      {searchText && (
        <img
          src={cancelLogo}
          onClick={() => handleClearSearch()}
          alt="X"
          className="search__clear_icon"
        />
      )}
    </form>
  );
};

export default Search;

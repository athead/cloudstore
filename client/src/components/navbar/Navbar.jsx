import React, { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";
// import Logo from "../../assets/img/icons8-cloud.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../actions/user";
import searchLogo from "../../assets/img/icons8-search.svg";
import { getFiles, searchFiles } from "../../actions/file";
import { showLoader } from "../../store/reducers/appReducer";
import { changeMenuState } from "../../actions/app";

const Navbar = () => {
  const dispatch = useDispatch();
  const inputReference = useRef(null);

  const isAuth = useSelector((state) => state.user.isAuth);
  const menu = useSelector((state) => state.app.menu);
  const currentDir = useSelector((state) => state.files.currentDir);

  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(false);
  const [searchOpened, setSearchOpened] = useState(false);

  const handleClick = () => dispatch(changeMenuState(false));

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
          },
          500,
          e.target.value
        )
      );
    } else {
      dispatch(getFiles(currentDir));
    }
  }

  const handleSearchOpen = (state) => {
    setSearchOpened(state);
    if (state) inputReference.current.focus();
  };

  return (
    <div className="wrapper">
      <div
        className="nav-overlay"
        style={{ display: menu ? "block" : "none" }}
        onClick={() => dispatch(changeMenuState(false))}
      ></div>
      <nav>
        <input
          type="checkbox"
          id="show-search"
          checked={searchOpened}
          onChange={(e) => handleSearchOpen(e.target.checked)}
        />
        <input
          type="checkbox"
          id="show-menu"
          checked={menu}
          onChange={(e) => dispatch(changeMenuState(e.target.checked))}
        />
        <label htmlFor="show-menu" className="menu-icon">
          <div className={"hamberger-container " + (menu ? "change" : "")}>
            <div className="bar1"></div>
            <div className="bar2"></div>
            <div className="bar3"></div>
          </div>
        </label>
        <div className="content">
          <div className="logo">
            <NavLink exact="true" to="/" onClick={() => handleClick()}>
              CloudStore
            </NavLink>
          </div>
          {isAuth && (
            <label
              htmlFor="show-search"
              className="search-icon"
              onClick={() => handleClick()}
            >
              <img src={searchLogo} alt="Search" className="nav-logo-img" />
            </label>
          )}
          {!searchOpened && searchText.length > 0 && (
            <label htmlFor="show-search" className="search-icon hide-md">
              Поиск: {searchText}...
            </label>
          )}
          <ul className="links">
            {isAuth && (
              <li>
                <NavLink exact="true" to="/" onClick={() => handleClick()}>
                  Диск
                </NavLink>
              </li>
            )}
            {isAuth && (
              <li>
                <NavLink exact="true" to="/about" onClick={() => handleClick()}>
                  Профиль
                </NavLink>
              </li>
            )}
            {!isAuth && (
              <li>
                <NavLink exact="true" to="/login" onClick={() => handleClick()}>
                  Вход
                </NavLink>
              </li>
            )}
            {isAuth && (
              <li>
                <a
                  href="#logout"
                  onClick={() => {
                    handleClick();
                    dispatch(logoutAction());
                  }}
                >
                  Выйти
                </a>
              </li>
            )}
          </ul>
        </div>
        <form action="#" className="search-box">
          <input
            type="text"
            ref={inputReference}
            onBlur={() => setSearchOpened(false)}
            onFocus={() => setSearchOpened(true)}
            onClick={() => handleClick()}
            value={searchText}
            onChange={(e) => searchChangeHandler(e)}
            placeholder="Введите для поиска..."
            required
          />
          {/* <button type="submit" className="go-icon">
            <img src={searchLogo} alt="Search" className="nav-logo-img" />
          </button> */}
        </form>
      </nav>
    </div>
  );
};

export default Navbar;

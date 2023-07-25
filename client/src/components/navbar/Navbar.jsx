import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./navbar.scss";
// import Logo from "../../assets/img/icons8-cloud.png";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../actions/user";
import searchLogo from "../../assets/img/icons8-search.svg";

import { changeMenuState } from "../../actions/app";
import Search from "./Search";
import { clearSelected, setCurrentDir } from "../../store/reducers/fileReducer";

const Navbar = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.user.isAuth);
  const menu = useSelector((state) => state.app.menu);

  const [searchOpened, setSearchOpened] = useState(false);
  const [searchText, setSearchText] = useState("");

  const handleClick = () => {
    dispatch(changeMenuState(false));
    dispatch(setCurrentDir(null));
    dispatch(clearSelected());
  }

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
          onChange={(e) => setSearchOpened(e.target.checked)}
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
                <NavLink exact="true" to="/account" onClick={() => handleClick()}>
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
        <Search
          opened={searchOpened}
          onChange={(e) => setSearchText(e)}
          onClose={(e) => setSearchOpened(false)}
        />
      </nav>
    </div>
  );
};

export default Navbar;

import React, { useEffect, useState } from "react";
import "./profile.css";
import { useDispatch, useSelector } from "react-redux";
import { authAction, changePasswordAction } from "../../actions/user";
// import downloadLogo from "../../assets/img/icons8-download.png";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { clearSelected } from "../../store/reducers/fileReducer";
import { humanFileSize } from "../../_helpers/humanView";

const Profile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currentUser);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword1, setNewPassword1] = useState("");
  const [newPassword2, setNewPassword2] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  useEffect(() => {
    dispatch(authAction());
    dispatch(clearSelected());
  }, [dispatch]);

  const changePassword = (event = null) => {
    setIsLoading(true);
    event?.preventDefault();
    // if (newPassword1 !== newPassword2) alert("Пароли не совпадают");
    dispatch(
      changePasswordAction(
        currentUser.login,
        oldPassword,
        newPassword1,
        newPassword2
      )
    )
      .then((res) => {
        setErrors([]);
        setIsLoading(false);
      })
      .catch((err) => {
        setErrors(err?.errors);
        setIsLoading(false);
      });
  };

  const getFieldErrorMessage = (fieldName) => {
    return errors?.find((el) => el.path === fieldName)?.msg;
  };

  const getStorePercentage = () => {
    function roundToTwo(num) {
      return +(Math.round(num + "e+2") + "e-2");
    }

    return roundToTwo(currentUser?.usedSpace / currentUser?.freeSpace);
    // return (
    //   Math.round((currentUser?.usedSpace / currentUser?.freeSpace) * 10000) /
    //   10000
    // ).toFixed(2);
  };

  return (
    <div className="profile__container">
      <div className="card">
        <h2>Размер хранилища</h2>
        <div className="freespace__progressbar">
          <CircularProgressbar
            value={getStorePercentage()}
            text={`${Math.round(getStorePercentage() * 100)}%`}
          />
          <span>
            <p className="freespace__progressbar_text">
              Занято: {humanFileSize(currentUser?.usedSpace, true)}
            </p>
            <p className="freespace__progressbar_text">
              Свободно: {humanFileSize(currentUser?.freeSpace, true)}
            </p>
          </span>
        </div>
      </div>
      <div className="card">
        <h2>Изменение пароля</h2>
        <form className="login-form" onSubmit={(e) => changePassword(e)}>
          <div className="input__group">
            <label className="loginform__label" forhtml="password">
              Текущий пароль
            </label>
            <input
              type="password"
              id="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Введите текущий пароль"
            />
            {getFieldErrorMessage("password") && (
              <label className="loginform__error_label">
                {getFieldErrorMessage("password")}
              </label>
            )}
          </div>
          <div className="input__group">
            <label className="loginform__label" forhtml="new_pass1">
              Новый пароль
            </label>
            <input
              type="password"
              id="new_pass1"
              value={newPassword1}
              onChange={(e) => setNewPassword1(e.target.value)}
              placeholder="Введите новый пароль"
            />
            {getFieldErrorMessage("new_pass1") && (
              <label className="loginform__error_label">
                {getFieldErrorMessage("new_pass1")}
              </label>
            )}
          </div>
          <div className="input__group">
            <label className="loginform__label" forhtml="new_pass2">
              Повторите новый
            </label>
            <input
              type="password"
              id="new_pass2"
              value={newPassword2}
              onChange={(e) => setNewPassword2(e.target.value)}
              placeholder="Введите новый пароль"
            />
            {getFieldErrorMessage("new_pass2") && (
              <label className="loginform__error_label">
                {getFieldErrorMessage("new_pass2")}
              </label>
            )}
          </div>
          <button
            style={{ justifyContent: "center", marginTop: "10px" }}
            className="btn"
            type="submit"
          >
            {isLoading ? (
              <div className="lds-dual-ring xsm"></div>
            ) : (
              <span style={{ lineHeight: "25px" }}>Сменить пароль</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

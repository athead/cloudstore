import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./signform.scss";
import { useDispatch } from "react-redux";
import { loginAction, registrationAction } from "../../actions/user";

const SignForm = ({ isLogin }) => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const clearErrors = () => {
    setErrors([]);
    //   setSuccess(null);
  };

  const getFieldErrorMessage = (fieldName) => {
    return errors?.find((el) => el.path === fieldName)?.msg;
  };

  const signUpIn = (event = null, name, password) => {
    setIsLoading(true);
    event?.preventDefault();
    if (isLogin)
      dispatch(loginAction(name, password))
        .then((res) => {
          setErrors([]);
          setIsLoading(false);
        })
        .catch((err) => {
          setErrors(err?.errors);
          setIsLoading(false);
        });
    else {
      registrationAction(name, password)
        .then((res) => {
          setErrors([]);
          setIsLoading(false);
        })
        .catch((err) => {
          setErrors(err?.errors);
          setIsLoading(false);
        });
    }
  };

  const getTitle = () => {
    if (isLogin) return "Вход";
    else return "Регистрация";
  };
  return (
    <div className="container">
      <div className="card">
        <h2>{getTitle()}</h2>
        <form
          className="login-form"
          onSubmit={(e) => signUpIn(e, login, password)}
        >
          <div className="input__group">
            <label className="loginform__label" forhtml="username">
              Логин
            </label>
            <input
              type="text"
              id="username"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              placeholder="Введите логин"
            />
            {getFieldErrorMessage("login") && (
              <label className="loginform__error_label">
                {getFieldErrorMessage("login")}
              </label>
            )}
          </div>
          <div className="input__group">
            <label className="loginform__label" forhtml="password">
              Пароль
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
            />
            {getFieldErrorMessage("password") && (
              <label className="loginform__error_label">
                {getFieldErrorMessage("password")}
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
              <span style={{ lineHeight: "25px" }}>{getTitle()}</span>
            )}
          </button>
        </form>
        {isLogin ? (
          <div className="switch">
            Нет аккаунта?
            <Link
              exact="true"
              to="/registration"
              className="link"
              onClick={() => clearErrors()}
            >
              <span className="link-item">Регистрация</span>
            </Link>
          </div>
        ) : (
          <div className="switch">
            Есть аккаунт?
            <Link
              exact="true"
              to="/login"
              className="link"
              onClick={() => clearErrors()}
            >
              <span className="link-item">Войти</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignForm;

import axios from "axios";
import { setUser, logoutUser } from "../store/reducers/userReducer";
import { toast } from "react-toastify";
export const registrationAction = async (login, password) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_SERVER_URL}/api/auth/registration`,
      {
        login,
        password,
      }
    );
    toast("Регистрация успешна", { type: "success" });
    return { message: "Регистрация успешна", data: response };
  } catch (e) {
    toast(e?.response?.data?.message || "Ошибка регистрации", {
      type: "error",
    });
    throw e?.response?.data || "Ошибка сервера";
  }
};

export const loginAction = (login, password) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/auth/login`,
        {
          login,
          password,
        }
      );
      dispatch(setUser(response.data?.user));
      localStorage.setItem("token", response.data?.token);
      toast("Авторизация успешна", { type: "success" });
      return { message: "Авторизация успешна", data: response };
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
      throw e?.response?.data || "Ошибка сервера";
    }
  };
};

export const authAction = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api/auth/auth`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setUser(response.data.user));
      localStorage.setItem("token", response.data.token);
    } catch (e) {
      localStorage.removeItem("token");
    }
  };
};

export const logoutAction = () => {
  return async (dispatch) => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    toast("Вы вышли из системы", { type: "success" });
  };
};

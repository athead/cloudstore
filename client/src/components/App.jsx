import { useDispatch, useSelector } from "react-redux";
import "./app.scss";
import NavBar from "./navbar/Navbar";
import SignForm from "./signForm/SignForm";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { authAction } from "../actions/user";
import Disk from "./disk/Disk";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./profile/Profile";

function App() {
  const isAuth = useSelector((state) => state.user.isAuth);
  const isAppLoading = useSelector((state) => state.app.isAppLoading);
  const isPopped = useSelector(
    (state) =>
      state.files.popupDisplay !== "none" ||
      state.files.popupShareDisplay !== "none"
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(authAction());
  });

  if (isAppLoading) {
    return (
      <div className="center__screen__wrapper">
        <div className="center__screen lds-dual-ring"></div>
      </div>
    );
  }

  return (
    <div className={"App"}>
      <BrowserRouter>
        <NavBar />
        <div
          className={"main_container " + (isPopped ? "hidden_overflow" : "")}
        >
          {!isAuth ? (
            <Routes>
              <Route
                path="/login"
                exact
                element={<SignForm isLogin={true} />}
              />
              <Route
                path="registration"
                exact
                element={<SignForm isLogin={false} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          ) : (
            <Routes>
              <Route exact path="/" element={<Disk />} />
              <Route exact path="/account" element={<Profile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
      </BrowserRouter>
    </div>
  );
}

export default App;

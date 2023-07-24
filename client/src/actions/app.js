import { setMenu } from "../store/reducers/appReducer";
export function changeMenuState(state) {
  return async (dispatch) => {
    if (state) {
      document.body.classList.add("body-menu-opened");
    } else {
      document.body.classList.remove("body-menu-opened");
    }
    dispatch(setMenu(state));
  };
}

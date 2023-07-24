const SHOW_LOADER = "SHOW_LOADER";
const HIDE_LOADER = "HIDE_LOADER";

const OPEN_MENU = "OPEN_MENU";
const CLOSE_MENU = "CLOSE_MENU";
const TOGGLE_MENU = "TOGGLE_MENU";
const SET_MENU = "SET_MENU";

const defaultState = {
  loader: false,
  menu: false,
};

export default function userReducer(state = defaultState, action) {
  switch (action.type) {
    case SHOW_LOADER:
      return { ...state, loader: true };
    case HIDE_LOADER:
      return { ...state, loader: false };
    case OPEN_MENU:
      return { ...state, menu: true };
    case CLOSE_MENU:
      return { ...state, menu: false };
    case TOGGLE_MENU:
      return { ...state, menu: !state.menu };
    case SET_MENU:
      return { ...state, menu: action.payload };
    default:
      return state;
  }
}

export const showLoader = () => ({ type: SHOW_LOADER });
export const hideLoader = () => ({ type: HIDE_LOADER });

export const openMenu = () => ({ type: OPEN_MENU });
export const closeMenu = () => ({ type: CLOSE_MENU });
export const setMenu = (state) => ({ type: SET_MENU, payload: state });
export const toggleMenu = () => ({ type: TOGGLE_MENU });

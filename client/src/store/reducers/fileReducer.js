const SET_FILES = "SET_FILES";
const SET_CURRENT_DIR = "SET_CURRENT_DIR";
const ADD_FILE = "ADD_FILE";
const DELETE_FILE = "DELETE_FILE";
const SET_POPUP_DISPLAY = "SET_POPUP_DISPLAY";
const SET_POPUP_SHARE_DISPLAY = "SET_POPUP_SHARE_DISPLAY";
const PUSH_TO_STACK = "PUSH_TO_STACK";
const PUSH_TO_SELECTED = "PUSH_TO_SELECTED";
const POP_FROM_SELECTED = "POP_FROM_SELECTED";
const CLEAR_SELECTED = "CLEAR_SELECTED";
const SHARE_FILE = "SHARE_FILE";

const BREADCRUMBS_ADD = "BREADCRUMBS_ADD";
// const POP_FROM_STACK = "POP_FROM_STACK";

const defaultState = {
  files: [],
  currendDir: null,
  popupDisplay: "none",
  popupShareDisplay: "none",
  dirStack: [],
  selectedFiles: [],
  // sharedFiles: [],
  breadCrumbs: [],
};

export default function fileReducer(state = defaultState, action) {
  switch (action.type) {
    case SET_FILES:
      return { ...state, files: action.payload };
    case SET_CURRENT_DIR:
      return {
        ...state,
        currentDir: action.payload,
        breadCrumbs: [
          ...state.breadCrumbs.slice(
            0,
            state.breadCrumbs.findIndex((el) => el._id === action.payload) + 1
          ),
        ],
      };
    case ADD_FILE:
      return { ...state, files: [...state.files, action.payload] };
    case DELETE_FILE:
      return {
        ...state,
        files: [...state.files.filter((file) => file._id !== action.payload)],
      };
    case SET_POPUP_DISPLAY:
      return { ...state, popupDisplay: action.payload };
    case SET_POPUP_SHARE_DISPLAY:
      return { ...state, popupShareDisplay: action.payload };

    case PUSH_TO_STACK:
      return { ...state, dirStack: [...state.dirStack, action.payload] };
    case PUSH_TO_SELECTED:
      return {
        ...state,
        selectedFiles: [...state.selectedFiles, action.payload],
      };
    case POP_FROM_SELECTED:
      return {
        ...state,
        selectedFiles: [
          ...state.selectedFiles.filter((el) => el._id !== action.payload),
        ],
      };
    case CLEAR_SELECTED:
      return {
        ...state,
        selectedFiles: [],
      };

    case SHARE_FILE:
      return {
        ...state,
        files: [
          ...state.files.filter((el) => el._id !== action.payload._id),
          action.payload,
        ],
        // files: (state.files.find(
        //   (file) => file._id === action.payload._id
        // ).access_link = action.payload.access_link),
        // selectedFiles: (state.selectedFiles.find(
        //   (file) => file._id === action.payload._id
        // ).access_link = action.payload.access_link),
      };
    // return {
    //   ...state,
    //   files: [
    //     action.payload,
    //     ...state.filesfilter((file) => file._id === action.payload._id),
    //   ],
    // };

    case BREADCRUMBS_ADD:
      return {
        ...state,
        breadCrumbs: [...state.breadCrumbs, action.payload],
      };
    default:
      return state;
  }
}

export const setFiles = (files) => ({ type: SET_FILES, payload: files });
export const setCurrentDir = (dir) => ({
  type: SET_CURRENT_DIR,
  payload: dir,
});
export const addFile = (file) => ({ type: ADD_FILE, payload: file });
export const deleteFileAction = (fileId) => ({
  type: DELETE_FILE,
  payload: fileId,
});
export const setPopupDisplay = (display) => ({
  type: SET_POPUP_DISPLAY,
  payload: display,
});
export const setPopupShareDisplay = (display) => ({
  type: SET_POPUP_SHARE_DISPLAY,
  payload: display,
});
export const pushToStack = (dir) => ({ type: PUSH_TO_STACK, payload: dir });
export const pushToSelected = (file) => ({
  type: PUSH_TO_SELECTED,
  payload: file,
});
export const removeFromSelected = (file) => ({
  type: POP_FROM_SELECTED,
  payload: file._id,
});

export const clearSelected = () => ({
  type: CLEAR_SELECTED,
  payload: [],
});

export const breadCrumbsPush = (file) => ({
  type: BREADCRUMBS_ADD,
  payload: file,
});

export const shareFileAction = (file) => ({ type: SHARE_FILE, payload: file });

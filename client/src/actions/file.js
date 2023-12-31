import axios from "axios";
import {
  addFile,
  setFiles,
  deleteFileAction,
  shareFileAction,
  setBreadcrumbs,
} from "../store/reducers/fileReducer";
import {
  addUploadFile,
  changeUploadFile,
  showUploader,
} from "../store/reducers/uploadReducer";
import { hideLoader, showLoader } from "../store/reducers/appReducer";
import { toast } from "react-toastify";

export function getFiles(dirId, sort, dir = 1) {
  return async (dispatch) => {
    try {
      dispatch(showLoader());
      let url = `${process.env.REACT_APP_SERVER_URL}/api/files`;
      if (dirId) {
        url = `${process.env.REACT_APP_SERVER_URL}/api/files?parent=${dirId}`;
      }
      if (sort) {
        url = `${process.env.REACT_APP_SERVER_URL}/api/files?sort=${sort}&dir=${dir}`;
      }
      if (dirId && sort) {
        url = `${process.env.REACT_APP_SERVER_URL}/api/files?parent=${dirId}&sort=${sort}&dir=${dir}`;
      }
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      dispatch(setFiles(response.data));
      // getBreadcrumbsToDir()
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    } finally {
      dispatch(hideLoader());
    }
  };
}

export function searchFiles(search) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_SERVER_URL}/api/files/search?search=${search}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(setFiles(response.data));
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    } finally {
      dispatch(hideLoader());
    }
  };
}

export function createDir(dirId, name) {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/files`,
        { name, parent: dirId, type: "dir" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(addFile(response.data));
      // toast(response?.data?.message, { type: "success" });
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    }
  };
}

export function uploadFile(file, dirId) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (dirId) {
        formData.append("parent", dirId);
      }
      const uploadFile = { name: file.name, progress: 0, id: Date.now() };
      dispatch(showUploader());
      dispatch(addUploadFile(uploadFile));
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/files/upload`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          onUploadProgress: (progressEvent) => {
            uploadFile.progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            dispatch(changeUploadFile(uploadFile));
            // }
          },
        }
      );
      dispatch(addFile(response.data));
      toast(`Файл ${response.data?.name} загружен`, { type: "success" });
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    }
  };
}
export async function downloadFile(file) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/api/files/download?id=${file._id}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    if (response.status === 200) {
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  } catch (e) {
    toast(e?.response?.data?.message, { type: "error" });
  }
}

export function deleteFile(file) {
  return async (dispatch) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_SERVER_URL}/api/files?id=${file._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(deleteFileAction(file._id));
      toast(response?.data?.message, { type: "success" });
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    }
  };
}

export function shareFile(file) {
  return async (dispatch) => {
    try {
      const formData = new FormData();
      formData.append("id", file._id);
      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL}/api/files/share`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      dispatch(shareFileAction(file));
      toast(response?.data?.message, { type: "success" });
      return { access_link: response?.data?.link };
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
      // return "Ошибка создания ссылки на файл";
    }
  };
}

export function getBreadcrumbsToDir(dir) {
  return async (dispatch) => {
    try {
      if (dir) {
        const response = await axios.get(
          `${process.env.REACT_APP_SERVER_URL}/api/files/breadcrumbs?id=${dir}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        dispatch(setBreadcrumbs(response.data[0]));
      } else {
        dispatch(setBreadcrumbs([]));
      }
    } catch (e) {
      toast(e?.response?.data?.message, { type: "error" });
    }
  };
}

import React from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { clearSelected } from "../../store/reducers/fileReducer";
import homeLogo from "../../assets/img/icons8-home.svg";
const BreadCrumbs = ({ crumbs, onChangeDirCallback }) => {
  //   const breadCrumbs = useSelector((state) => state.files.breadCrumbs);

  //   function setCurrentDir(dirId) {
  //     console.log(dirId);
  //     dispatch(setCurrentDir(dirId));
  //     dispatch(clearSelected());
  //   }

  if (crumbs.length > 0)
    return (
      <div className="breadcrumbs">
        <span
          className="btn icon breadcrumb"
          onClick={(e) => onChangeDirCallback(e, null)}
        >
          <img src={homeLogo} className="breadcrumb__icon" alt="Home" />
        </span>
        {crumbs.map(function (el, i) {
          if (i >= crumbs.length - 1) {
            return (
              <span className="btn disabled breadcrumb active" key={i}>
                {el.name}
              </span>
            );
          } else {
            return (
              <span
                className="btn breadcrumb"
                key={i}
                onClick={(e) => onChangeDirCallback(e, el._id)}
              >
                {el.name}
              </span>
            );
          }
        })}
      </div>
    );
};

export default BreadCrumbs;

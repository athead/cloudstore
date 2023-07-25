import React from "react";
// import { useSelector } from "react-redux";
// import { clearSelected } from "../../store/reducers/fileReducer";
import homeLogo from "../../assets/img/icons8-home.svg";
const BreadCrumbs = ({ crumbs, onChangeDirCallback }) => {
  const flatten = (obj, roots = [], sep = ".") =>
    Object
      // find props of given object
      .keys(obj)
      // return an object by iterating props
      .reduce(
        (memo, prop) =>
          Object.assign(
            // create a new object
            {},
            // include previously returned object
            memo,
            Object.prototype.toString.call(obj[prop]) === "[object Object]"
              ? // keep working if value is an object
                flatten(obj[prop], roots.concat([prop]), sep)
              : // include current prop and value and prefix prop with the roots
                { [roots.concat([prop]).join(sep)]: obj[prop] }
          ),
        {}
      );

  const getCrumbsArray = () => {
    // Получаем все значения, в которых есть id или name в оневложенном объекте
    const filteredFlatten = Object.fromEntries(
      Object.entries(flatten(crumbs)).filter(
        ([key]) => key.includes("_id") || key.includes("name")
      )
    );
    // Формируем необходимый массив
    let arrayOfFiles = [];
    let _id = "";
    let name = "";
    for (const [key, value] of Object.entries(filteredFlatten)) {
      if (key.includes("_id")) _id = value;
      if (key.includes("name")) name = value;
      if (_id && name) {
        arrayOfFiles.push({ _id, name });
        _id = "";
        name = "";
      }
    }
    return arrayOfFiles.reverse();
  };

  if (getCrumbsArray().length > 0)
    return (
      <div className="breadcrumbs">
        <span
          className="btn icon breadcrumb"
          onClick={(e) => onChangeDirCallback(undefined)}
        >
          <img src={homeLogo} className="breadcrumb__icon" alt="Home" />
        </span>
        {getCrumbsArray().map((el, i) => {
          if (i === getCrumbsArray().length - 1) {
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
                onClick={(e) => onChangeDirCallback(el._id)}
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

import React, { useRef, useState } from "react";
import sortArrow from "../../assets/img/icons8-sort.png";
import useOnClickOutside from "../../hooks/onClickOutside";

const filterTypes = [
  {
    value: "type",
    title: "Тип",
  },
  {
    value: "name",
    title: "Имя",
  },
  {
    value: "date",
    title: "Дата",
  },
  {
    value: "size",
    title: "Размер",
  },
];

const Filter = ({ filter, onFilter }) => {
  const filterNode = useRef();
  const defaultFilterValue = filterTypes.find(
    (e) => e.value === filter.value
  ).value;

  const defaultFilterDirection = filter.direction === "asc" ? true : false;

  const [sort, setSort] = useState(defaultFilterValue);

  const [sortDirection, setSortDirection] = useState(defaultFilterDirection);
  const [filterOpened, setFilterOpened] = useState(false);

  const getCurrentFilterTitle = () => {
    return filterTypes.find((el) => el.value === sort).title;
  };

  useOnClickOutside(filterNode, () => {
    // Only if filter is open
    if (filterOpened) setFilterOpened(false);
  });

  // const changeDirection = () => {
  //   setSortDirection(!sortDirection);
  //   // Emit event of filter
  //   onFilter({
  //     value: sort,
  //     prevValue: sort,
  //     direction: sortDirection ? "asc" : "desc",
  //   });
  // };
  const changeFilter = (curSortValue) => {
    let direction =
      curSortValue === defaultFilterValue ? !defaultFilterDirection : true;

    setSortDirection(direction);
    setSort(curSortValue);
    setFilterOpened(false);

    // Emit event of filter
    onFilter({
      value: curSortValue,
      prevValue: sort,
      direction: direction ? "asc" : "desc",
    });
  };

  return (
    <section
      ref={filterNode}
      className={"filter " + (filterOpened ? "filter__opened" : "")}
    >
      <div
        className="filter__current__status"
        onClick={() => setFilterOpened(!filterOpened)}
      >
        <img
          src={sortArrow}
          className={"filter__direction_icon " + (sortDirection ? "" : "r180")}
          alt="."
          // onClick={() => changeDirection()}
        />
        <p className="filter__message">{getCurrentFilterTitle()}</p>
      </div>
      <ul className="filter__other">
        {filterTypes.map((filter, id) => (
          <li
            key={id}
            className="filter__other__card"
            onClick={() => changeFilter(filter.value)}
          >
            <p className="filter__message">{filter.title}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Filter;

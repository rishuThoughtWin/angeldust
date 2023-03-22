import React from "react";
import Select from "react-select";

export const Dropdown = (props) => {
  return (
    <Select
      value={props.selected}
      onChange={props.onChange}
      options={props.options}
      getOptionLabel={(e) => (
        <>
          {e?.icon && <img src={e.icon} alt="icon" />}
          <span>{e.label}</span>
        </>
      )}
    />
  );
};

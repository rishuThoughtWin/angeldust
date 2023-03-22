import { useEffect, useState } from "react";
import "./Button.css";

export const Button = (props) => {
  const { children, onClick, res, type, maxWidth } = props;
  const [btnClass, setBtnClass] = useState("");

  useEffect(() => {
    switch (type) {
      case "primary":
        setBtnClass("primary_button button btn_primary_text");
        break;
      case "secondary":
        setBtnClass("secondary_button button btn_secondary_text");
        break;
      default:
        setBtnClass(" button btn_text");
    }
  }, [type]);

  return (
    <button
      onClick={onClick}
      {...res}
      className={`${btnClass}`}
      style={{ maxWidth: `${maxWidth}` }}
    >
      {children}
    </button>
  );
};

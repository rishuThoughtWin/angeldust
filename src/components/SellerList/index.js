import React from "react";
import "./style.css";

function SellerList(props) {
  const rank = props.index;
  const { avatar, nickName, sum, account } = props.data;
  return (
    <li>
      <span className="sellers-list__number">{rank + 1}</span>
      <div
        className={`sellers-list__author ${"sellers-list__author--verified"}`}
      >
        <img src={avatar || "/assets/img/avatars/avatar.jpg"} alt="" />
        <a href={`/creator/${account}`}>{nickName || "user"}</a>
        <span>{sum.toFixed(3)} BNB</span>
      </div>
    </li>
  );
}

export default SellerList;

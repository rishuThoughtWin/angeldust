import React from "react";
import "./style.css";

export default function AudioImage(props) {
  return (
    <div className="card__cover audio">
      <img
        alt=""
        src="assets/icon/audio.png"
        className="w-full h-80 relative"
      />
      <div className="absolute bottom-8 w-full d-flex justify-center">
        <audio controls className="">
          <source src={props.src} />
        </audio>
      </div>
    </div>
  );
}

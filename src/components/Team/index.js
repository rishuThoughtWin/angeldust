import React from "react";
import "./style.css";

function Team(props) {
  const { image, comment1, comment2 } = props;
  return (
    <div className="team">
        <img src={image} alt="" className="team_image" />
        <h3 className="team_comment">
          <a href="/" className="comment1">{comment1}</a>
          <a href="/" className="comment2">{comment2}</a>
        </h3>
    </div>
  );
}
export default Team;

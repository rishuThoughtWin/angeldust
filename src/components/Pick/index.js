import React from "react";
import "./style.css";

function Post(props) {
  const { image, comment, onDragStart } = props;
  return (
    <div className={onDragStart ? "pickSlide" : "pick"}>
        <img src={image} alt="" className="pick_image" onDragStart={onDragStart} />
        <h3 className="pick_comment">
          <a href="/" className="pick_link">{comment}</a>
        </h3>
    </div>
  );
}
export default Post;

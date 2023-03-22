import React from "react";
import "./style.css";

function Post(props) {
  const { image, comment } = props;
  return (
    <div className="pickCollection">
        <h3 className="pickC_comment">
          <a href="/" className="pick_link">{comment}</a>
        </h3>
    </div>
  );
}
export default Post;

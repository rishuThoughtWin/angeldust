import React, {useEffect, useState} from "react";
import AudioImage from "../Card/AudioImage";
import VideoImage from "../Card/VideoImage";
import ReactTooltip from "react-tooltip";
import "./style.css";
import {toast} from "react-toastify";
import {useWeb3React} from "@web3-react/core";

function AssetItem(props) {
  const isCss = props.isCss;
  const {
    type,
    image,
    audio,

  } = props.data;

  return (
    <div className="asset__item video_height_content">
      {type == 'image' ? (
        <a className="asset__img assets-mobile" href={image} target="_blank" rel="noreferrer">
          <img src={image} alt="" className="imgAsset" />
        </a>
      ) : type === "audio" ? (
        <div className="relative">
          <AudioImage
            src={image}
            audioPath={audio}
            isCss={isCss}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </div>
      ) : (
        <div className="relative item-video video_height">
          <VideoImage src={image} className="videoAsset" />
        </div>
      )}

      
    </div>
  );
}
export default AssetItem;

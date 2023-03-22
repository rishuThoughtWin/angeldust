import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Get_Profile_By_AccountId} from "apis";
import "./style.css";

function Item(props) {
  const [creatorData, setCreatorData] = useState({
    avatar: "assets/img/avatars/avatar.jpg",
    name: "",
  });
  const [ownerData, setOwnerData] = useState({
    avatar: "assets/img/avatars/avatar.jpg",
    name: "",
  });
  const { creator, owner_of, auctionCreator, time } = props.data;
  const getAvatars = async () => {
    try {
      if (owner_of) {
        const owner_data = await Get_Profile_By_AccountId(owner_of,'');

        if (owner_data) setOwnerData(owner_data?.data);
        else {
        }
      }
      if (creator) {
        const creator_data = await Get_Profile_By_AccountId(creator,'');
        if (creator_data) setCreatorData(creator_data?.data);
        else {
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getAvatars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner_of, creator]);
  return (
    <ul className="asset__authors">
      <li>
        <span>Creator</span>
        <div className="asset__author asset__author--verified">
          <img
            src={
              creatorData.avatar
                ? creatorData.avatar
                : "assets/img/avatars/avatar.jpg"
            }
            alt=""
          />
          <Link to={`/creator/${creator}`}>
            {creatorData.firstName} {creatorData.lastName}
          </Link>
        </div>
      </li>
      <li>
        <span>Collector</span>
        <div className="asset__author ">
          <img
            src={
              ownerData.avatar
                ? ownerData.avatar
                : "assets/img/avatars/avatar.jpg"
            }
            alt=""
          />
          <Link
            to={`/creator/${
              time > 0 && auctionCreator ? auctionCreator : owner_of
            }`}
          >
            {ownerData.firstName ? ownerData.firstName : owner_of} {ownerData.lastName}
          </Link>
        </div>
      </li>
    </ul>
  );
}

export default Item;

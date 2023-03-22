import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "./style.css";
import { toast } from "react-toastify";
import { addFollowApi, unFollowApi } from "apis";
import { useSelector } from "react-redux";
import { RPC_URLS } from "../../pages/Header/connectors";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDisconnect } from "hooks/useDisconnect";
import { followAPI } from "apis";
import { Get_Profile_By_AccountId } from "apis";
import { HeartIcon } from "@heroicons/react/outline";
import Countdown from "components/Countdown/Countdown";

function LaunchpadCard(props) {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const tokenId = useSelector((state) => state?.tokenData?.token);
  const isAdmin = localStorage.getItem("owner");
  const isUser = localStorage.getItem("isActive");
  const { account } = useWeb3React();
  const [isFollowing, setIsFollowing] = useState(false);
  const [accounts, setAccount] = useState(account);
  const [provider, setProvider] = useState(null);

  const { disconnectWalletConnect } = useDisconnect();

  const {
    id,
    imageCover,
    currency,
    firstName,
    lastName,
    nickName,
    follower_count,
    mintCost,
    followers,
    endDate,
    collectionName,
    collectionAddress,
    is_followed,
  } = props.data;
  
  const [likes, setLikes] = useState(follower_count ? follower_count : 0);
  const [isFollowed, setIsFollowed] = useState(null);
  let time = new Date()
  time.setHours(time.getHours() + 5);
  time.setMinutes(time.getMinutes() + 30);

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }

    const followData = followers
      ? followers.filter((x) => x?.toLowerCase() === accounts?.toLowerCase())
      : [];
    setIsFollowed(is_followed);
    setLikes(follower_count);
  }, [follower_count, account]);

  const pageredirection = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="authorAngeldust explore-page creator_page_div launchpad_collection_div1">
      {(isUser == "true" || isAdmin == "true" || mobileAccount == "true") &&
      accounts ? (
        <Link
          to={`/collection/${id}/${collectionAddress}/${props.type}`}
          className="author__cover author__cover--bg authorImageWrapper"
          data-bg={imageCover}
        >
          <img
            src={imageCover ? imageCover : "/assets/img/bg/bg.png"}
            className="imageBanner"
            alt=""
            onClick={pageredirection}
          />
        </Link>
      ) : (
        <Link
          to={`/collection/${id}/${collectionAddress}/${props.type}`}
          className="author__cover author__cover--bg authorImageWrapper"
          data-bg={imageCover}
        >
          <img
            src={imageCover ? imageCover : "/assets/img/bg/bg.png"}
            className="imageBanner"
            alt=""
            onClick={pageredirection}
          />
        </Link>
      )}

      <div className="author__meta AngeldustFrosted">
        <div className="row mt-1">
          <div className="col-md-12 col-12 padding_right_product">
            <div class="collectionName"> {collectionName} </div>
          </div>

          {/* <div className="col-md-8 col-8 pl-0 text-right">
            <div className="product_comment5">
              {" "}
              <span className="d-md-inline-block d-none"> price </span>{" "}
              <span> 0 </span> <span> BNB </span>
            </div>
          </div> */}
        </div>
        <div className="row">
          <div className="col-md-12 col-12 d-flex align-items-center">
            <span className="priceLabel">Price:</span>
            <div className="card_price">
              {mintCost} {currency}
            </div>
          </div>

          <div className="col-md-12 col-12 pl-0">
            {(new Date(props?.endDate) > new Date() ) && (
              <Countdown startDate={props?.startDate} endDate={props?.endDate} />
            )}
          </div>
          {/* <div className="col-md-7 col-6 pl-0">
            {(new Date(props.startDate) > new Date(time)) && (
              <Countdown startDate={props.startDate} endDate={props.endDate} />
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
}
export default LaunchpadCard;

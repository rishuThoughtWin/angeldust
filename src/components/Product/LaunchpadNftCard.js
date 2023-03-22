import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { useWeb3React } from "@web3-react/core";
// import { HeartIcon } from "@heroicons/react/outline";
import { HeartIcon } from "@heroicons/react/solid";
import "./style.css";
import AudioImage from "../Card/AudioImage";
import VideoImage from "../Card/VideoImage";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { Get_Profile_By_AccountId, likeDislikeApi } from "apis";
import { RPC_URLS } from "../../pages/Header/connectors";
import Loader from "components/Loader";
import { useDisconnect } from "hooks/useDisconnect";
import { LOADER_IMAGE } from "../../constants";
// import loader_image from "../../assets/img/placeholder.gif"
function LaunchpadNftCard(props) {
  const [accounts, setAccount] = useState(props.account);
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const loginUserId = useSelector((state) =>
    state?.tokenData?.user ? state?.tokenData.user._id : null
  );
  const { disconnectWalletConnect } = useDisconnect();
  const mobileAccount = localStorage.getItem("mobileAccount");
  const loginActive = useSelector((state) => state?.loginNetwork?.isActive);

  // const time = 0;
  const web3 = new Web3(Web3.givenProvider || window.etherum);

  const {
    id,
    collectionAddress,
    collectionId,
    name,
    isSale,
    created_at,
    image,
    nftDescription,
    mintCost,
    royalties,
    status
  } = props.data;



  const { account } = useWeb3React();

  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      if(loginActive=='true'){
        const web3 = new Web3(Web3.givenProvider || window.etherum);
        const getAccount = await web3.eth.requestAccounts()
        setAccount(getAccount[0]);
      }
    }
  }, [account]);



  return (
    <div className="product explore-page" >
      <div className="custom-control custom-checkbox">

        {/* setDeleteNFTList([
              { tokenId: tokenId, collectionAddress: collectionAddress },
            ]) */}
        <label className="custom-control-label m-0" for="customCheck1"></label>
      </div>

        <Link
          to={`/launchpadItem/${collectionAddress}/${id}`}
        >
            <img style={{
              width: "100%",
              height: "100%",
              // background: `url("${source}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              objectFit: "cover",
            }} src={image} />


        </Link>

      <h3 className="product_comment">
        {/* <a href="/" className="product_comment2">{comment1}</a> */}

        <div className="row mt-1">
          <div className="col-md-12 col-12 padding_right_product">
            <div className="productCategory">{name}</div>
          </div>

        </div>
        <div className="row mt-1">

          <div className="col-md-12 col-12 padding_right_product">
            <div className="product_comment5">
              {" "}
              <div className="productCategory d-flex">
                <span className="priceLabel">Price:</span>
                <p className="card_price">
                {mintCost} {props.currency}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="row mt-1">

          <div className="col-md-12 col-12 padding_right_product">
            <div className="product_comment5">
              {" "}
              <span className="d-md-inline-block d-none"> price </span>{" "}
              <span> {mintCost} </span> <span> BNB </span>
            </div>
          </div>
        </div> */}

      </h3>
    </div>
  );
}
export default LaunchpadNftCard;

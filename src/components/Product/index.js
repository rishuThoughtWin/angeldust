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
function Product(props) {
  const [accounts, setAccount] = useState(props.account);
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const loginUserId = useSelector((state) =>
    state?.tokenData?.user ? state?.tokenData.user._id : null
  );
  const { disconnectWalletConnect } = useDisconnect();
  const mobileAccount = localStorage.getItem("mobileAccount");
  const {
    _id,
    //collectionAddress,
    awsImage,
    awsImagesUpdated,
    tokenId,
    type,
    image,
    category,
    isSale,
    imageAttach,
    time,
    name,
    owner,
    creator,
    price,
    saleType,
    likes,
    auctionCreator,
    setSelectedProducts,
    selectedProducts,
    collectionAddress,
    onDeleteNFTHandler,
  } = props.data;
  const nftId = props.data._id;
  // const time = 0;
  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const hasDecimal = (num) => {
    return !!(num % 1);
  };


  const convertExponentialToDecimal = (exponentialNumber) => {
    // sanity check - is it exponential number
    const str = exponentialNumber.toString();
    if (str.indexOf("e") !== -1) {
      const exponent = parseInt(str.split("-")[1], 10);

      const result = exponentialNumber.toFixed(exponent);
      return result;
    } else {
      return exponentialNumber;
    }
  };

  let ethprice = null;
  if (hasDecimal(price)) {
    ethprice = convertExponentialToDecimal(price);
  } else {
    if (price >= 1 && price < 100000) {
      ethprice = price
    }
    else {
      ethprice = web3.utils.fromWei(price.toString(), "ether");
    }
  }

  const nftPrice = ethprice;
  const dispatch = useDispatch();
  const { account } = useWeb3React();
  const dispatchNftItem = async (payload) => {
    await dispatch({ type: "SET_SELECTED", payload });
  };

  const [nickName, setNickName] = useState("@unkown");
  const [follow, setFollow] = useState(likes);
  const [isLiked, setIsLiked] = useState(
    likes?.includes(loginUserId) ? true : false
  );
  const [checkBox, setCheckBox] = useState(false);
  const [source, setSource] = useState("");

  const isActive = localStorage.getItem("isActive");
  const getAvatar = async () => {

    const url = await Get_Profile_By_AccountId(owner, '');
    if (url?.success) {
      setNickName(url?.data?.nickName);
    }
  };

  const increaseLikes = async () => {
    if (loginUserId && (isActive == 'true' || mobileAccount == 'true')) {
      const user_index = follow?.indexOf(loginUserId);
      if (creator === loginUserId) {
        toast.error("You are a creator");
        return;
      }
      const userInfo = await Get_Profile_By_AccountId(accounts, tokenIdBearer);
      const userExist = userInfo ? userInfo?.data : {};
      if (!userExist?.nickName) {
        return toast.error(`Please update your profile first.`);
      }
      if (!tokenIdBearer) {
        return await disconnectWalletConnect();
      }
      const res = await likeDislikeApi(tokenIdBearer, _id);
      const data = res?.data;
      if (data?.success) {
        if (isLiked) {
          setIsLiked(false);
          const removeFollow = likes.filter((x) => x !== loginUserId);
          setFollow(removeFollow);
        } else {
          setIsLiked(true);
          const newLike = [...likes];
          if (likes.filter((x) => x === loginUserId).length === 0)
            newLike.push(loginUserId);
          setFollow(newLike);
        }
        props.handleChangeFollow()
        toast.success(`You ${!isLiked ? "" : "un"}like the NFT`);
      }
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  useEffect(async () => {
    // if(props.accounts){
    //   setAccount(props.accounts)
    // }
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      setAccount(account);
    }
    getAvatar();
  }, [account]);

  useEffect(() => {
    setFollow(props.data.likes);
    // if (!props.data.isFirstSale) {
    setCheckBox(true);
    // }
  }, [props.data, props.deleteEnable]);

  const changed = (event) => {
    props.onDeleteNFTHandler(tokenId, collectionAddress, nftId, saleType);
  };

  useEffect(() => {
    if (image) {
      const img = new Image()
      img.src = image
      img.onload = () => setSource(image)

    }
  }, [image])

  const handleCheckbox = (nftId) => { };
  return (
    <div className="product explore-page " key={_id}>
      <div className="custom-control custom-checkbox">
        {props.deleteEnable && checkBox ? (
          <input
            type="checkbox"
            className="custom-control-input mr-2"
            id="customCheck1"
            // onChange={setSelectedProducts([...selectedProducts, id])}
            onChange={changed}
          />
        ) : null}
        {/* setDeleteNFTList([
              { tokenId: tokenId, collectionAddress: collectionAddress },
            ]) */}
        <label className="custom-control-label m-0" for="customCheck1"></label>
      </div>
      {type === "image" && (
        <Link
          to={`/item/${collectionAddress}/${nftId}`}
          onClick={() => dispatchNftItem(props.data)}
        >

          {
            !source &&
            <div
            className="productImgMobile"
            style={{
              width: "100%",
              height: "210px",
              background: `url("${LOADER_IMAGE}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              objectFit: "cover",
            }}
          />
          }
          {source && <div
            className="productImgMobile zoom_hover"
            style={{
              width: "100%",
              height: "180px",
              // background: `url("${source}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <img style={{
              width: "100%",
              height: "180px",
              // background: `url("${source}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }} src={source} />
            </div>
          }

        </Link>
      )}

      {type === "audio" && (
        <Link to={`/item/${collectionAddress}/${nftId}`}>
          {/* <img src="assets/icon/audio.png"></img> */}
          <AudioImage
            src={image}
            onClick={(e) => {
              e.preventDefault();
            }}
          />
        </Link>
      )}
      {type === "video" && (
        <Link
          to={`/item/${collectionAddress}/${nftId}`}
          onClick={() => dispatchNftItem(props.data)}
        >
          <VideoImage src={image} />
        </Link>
      )}
      <h3 className="product_comment">
        {/* <a href="/" className="product_comment2">{comment1}</a> */}

        <div className="row mt-1">
          <div className="col-md-4 col-4 padding_right_product">
            <div className="productCategory">{category}</div>
          </div>

          <div className="col-md-8 col-8 pl-0 text-right">
            <div className="product_comment5">
              {" "}
              <span className="d-md-inline-block d-none"> price </span>{" "}
              <span> {nftPrice} </span> <span> BNB </span>
            </div>
          </div>
        </div>

        <div className="row mt-1">
          <div className="col-md-6 col-6 pr-lg-0 padding_right_product">
            <div className="productTitle">{name}</div>
          </div>

          <div className="col-md-6 col-6 text-right">
            <div className="productCreator">{nickName?.length > 7 ? nickName?.slice(0, 7 - 1) + "…" : nickName}</div>
          </div>
        </div>
        <div className="row mt-1 market_nft_div">
          <div className="col-md-12 col-12 padding_right_product">
            <div className="mt-0">
              {(isActive == "true" || mobileAccount == "true") &&
                !(accounts?.toLowerCase() == owner?.toLowerCase()) ? (
                <div className="nft_category1">
                  {props.data?.saleType == "Fixed" ? (
                    <Link
                      to={`/item/${collectionAddress}/${nftId}`}
                      className="product_comment1 buy_button"
                    >
                      {(time === 0 &&
                        props.data?.owner?.toLowerCase() ===
                        accounts?.toLowerCase()) ||
                        (time > parseInt(new Date().getTime()) &&
                          props.data?.auctionCreator?.toLowerCase() ===
                          accounts?.toLowerCase())
                        ? props.data?.isSale
                          ? "Delist"
                          : "List for sale"
                        : props.data?.isSale ? "Buy" : ""}
                    </Link>
                  ) : time < parseInt(new Date().getTime()) ? (
                    <Link
                      to={`/item/${collectionAddress}/${nftId}`}
                      className="product_comment1 buy_button"
                    >
                      {props.data?.owner?.toLowerCase() ===
                        accounts?.toLowerCase()
                        ? time < parseInt(new Date().getTime())
                          ? "Delist"
                          : "List for sale"
                        : // : 'Auction ended'
                        props.data?.auctionInfo?.toLowerCase() ==
                          accounts?.toLowerCase()
                          ? "Claim your NFT"
                          : time == 0
                            ? "Place a Bid"
                            : "Auction ended"}
                    </Link>
                  ) : (
                    <Link
                      to={`/item/${collectionAddress}/${nftId}`}
                      className="product_comment1 buy_button"
                    >
                      {(time === 0 &&
                        props.data?.owner?.toLowerCase() ===
                        accounts?.toLowerCase()) ||
                        (time > parseInt(new Date().getTime()) &&
                          props.data?.auctionCreator?.toLowerCase() ===
                          accounts?.toLowerCase())
                        ? props.data?.isSale
                          ? "Delist"
                          : "List for sale"
                        : "Place a Bid"}
                    </Link>
                  )}
                </div>
              ) : (
                <div className="nft_category1">
                  <Link
                    to={`/item/${collectionAddress}/${nftId}`}
                    className="product_comment1 buy_button"
                  >
                    {(time === 0 &&
                      props.data?.owner?.toLowerCase() ===
                      accounts?.toLowerCase()) ||
                      (time < parseInt(new Date().getTime()) &&
                        props.data?.auctionCreator?.toLowerCase() ===
                        accounts?.toLowerCase()) && isActive == 'true'
                      ? props.data?.saleType == "Fixed" ||
                        props.data?.owner?.toLowerCase() ==
                        accounts?.toLowerCase()
                        ? ""
                        : // <div className="card__clock"><Countdown date={time} renderer={renderer} /></div>
                        time < parseInt(new Date().getTime())
                          ? "Place a Bid"
                          : "Auction ended"
                      : ""}
                  </Link>
                </div>
              )}
              <div
                className="product_comment6 hearLike text-right"
                onClick={increaseLikes}
              >
                {follow?.length}{" "}
                {isLiked ? (
                  <HeartIcon className="heartIcon" style={{ color: "red" }} />
                ) : (
                  <HeartIcon className="heartIcon" />
                )}
              </div>
            </div>
          </div>
        </div>
      </h3>
    </div>
  );
}
export default Product;

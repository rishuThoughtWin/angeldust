import React, { useEffect, useState } from 'react'
import AudioImage from './AudioImage'
import VideoImage from './VideoImage'
import { useDispatch } from 'react-redux'
import './style.css'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Get_Profile_By_AccountId } from "apis";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { RPC_URLS } from 'pages/Header/connectors'
import { LOADER_IMAGE } from '../../constants'
import BNB from "../../assets/img/icons/bnb.png";

function Card(props) {
  const isCss = props.isCss;
  const {
    id,
    collectionAddress,
    type,
    image,
    audio,
    currency,
    mintCost,
    time,
    name,
    owner,
    creator,
    price,
    saleType,
    likes,
    paymentType,
    auctionCreator,
  } = props.data
  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const history = useHistory()
  const [ownerAvatar, setOwnerAvatar] = useState(
    'assets/img/avatars/avatar.jpg',
  )
  const mobileAccount = localStorage.getItem("mobileAccount");
  const [accounts, setAccount] = useState(account);
  const [source, setSource] = useState("");

  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const hasDecimal = (num) => {
    return !!(num % 1);
  }
  let ethprice = null
  if (hasDecimal(mintCost)) {
    ethprice = mintCost
  }
  else {
    if (mintCost >= 1 && mintCost < 100000) {
      ethprice = mintCost
    }
    else {
      ethprice = web3.utils.fromWei(mintCost.toString(), "ether");
    }
  }
  const [nickName, setNickName] = useState('@unkown')
  const [follow, setFollow] = useState(likes)
  const [contentType, setContentType] = useState("");

  const getAvatar = async () => {
    const url = await Get_Profile_By_AccountId(owner,'')
    if (url) {
      setOwnerAvatar(url?.data?.avatar)
      setNickName(url?.data?.nickName)
    }
  }
  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      setAccount(account)
    }
    if (owner) {
      getAvatar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner])

  useEffect(() => {
    setFollow(props.data.likes)
  }, [props.data])

  const dispatchNftItem = async (payload) => {
    await dispatch({ type: 'SET_SELECTED', payload })
  }


  useEffect(() => {
    if (image) {
      const img = new Image()
      img.src = image
      img.onload = () => setSource(image)
    }
  }, [image])

  return (
    <div
      className="nftCard bleuFrosted"
      onClick={() => history.push(`/launchpadItem/${collectionAddress}/${id}`)}
    >
      <div className="nftCardImageWrapper nftCardContentnew">
   
        {true || contentType === "image" ? (
          <>
            {
              !source &&
              <img src={LOADER_IMAGE} alt="" className="nftCardImage"/>
            }
            {source && <img src={image} alt="" className="nftCardImage" />}

          </>
        ) : type === "audio" || contentType === "audio" ? (
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
          <div className="relative item-video">
            <VideoImage src={image} className="videoAsset" />
          </div>
        )}
      </div>
      <div className="nftCardContent nft_item_detail">
        <div className="nftCardTitle mb-1">{name ? name : "unknown"}</div>
        <div className=" mb-2 nickname">{nickName ? nickName : "unknown"}</div>
        <div className="nftCardPillPriceWrapper ">
          <div className="text-right text_margin_left">
            <img
              src={BNB}
              className="nftCardPillCurrencyImage mr-md-2 mr-0"
            />
            <span className="price_item_nft"> {ethprice} </span> {currency}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Card

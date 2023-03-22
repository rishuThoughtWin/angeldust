import React, { useEffect, useState } from 'react'
import AudioImage from './AudioImage'
import VideoImage from './VideoImage'
import { useDispatch } from 'react-redux'
import './style.css'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Get_Profile_By_AccountId } from "apis";
import Web3 from "web3";
import { LOADER_IMAGE } from '../../constants'
import BNB from "../../assets/img/icons/bnb.png";

function CardMoralis(props) {
  const isCss = props.isCss;
  const {
    _id: id,
    collectionAddress,
    type,
    image,
    audio,
    isSale,
    imageAttach,
    time,
    name,
    owner,
    creator,
    price,
    saleType,
    likes,
    paymentType,
    auctionCreator,
    token_address,
    token_id
  } = props.data

  const dispatch = useDispatch()
  const { account } = useWeb3React()
  const history = useHistory()
  const [source, setSource] = useState("");
  const [contentType, setContentType] = useState("");
  const [ownerAvatar, setOwnerAvatar] = useState(
    'assets/img/avatars/avatar.jpg',
  )

  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const hasDecimal = (num) => {
    return !!(num % 1);
  }
  let ethprice = null
  if (hasDecimal(price)) {
    ethprice = price
  }
  else {
    if (price >= 1 && price < 100000) {
      ethprice = price
    }
    else {
      if (price) {
        ethprice = web3.utils.fromWei(price.toString(), "ether");

      }
    }
  }
  const [nickName, setNickName] = useState('@unkown')
  const [follow, setFollow] = useState(likes)


  const getAvatar = async () => {
    const url = await Get_Profile_By_AccountId(owner,'')
    if (url) {
      setOwnerAvatar(url?.data?.avatar)
      setNickName(url?.data?.nickName)
    }
  }
  useEffect(() => {
    if (owner) {
      getAvatar()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner])
  useEffect(() => {
    setFollow(props.data.likes)
  }, [props.data])

  useEffect(() => {
    if (String(image)) {

      getImgContentTyp(image).then(type => {
        if (type?.split('/')[0]) {
          const content = type?.split('/')[0]
          setContentType(content);
        }
      })

    }
  }, [image])
  const getImgContentTyp = (img) => {
    return fetch(img, { method: 'HEAD' })
      .then(response => response.headers.get('Content-type'))
      .catch(err => console.error(err.message))
  }

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
      onClick={() => history?.push({ pathname: `/externalitem/${token_address}/${token_id}`, state: props?.data })}
    >
      <div className="nftCardImageWrapper nftCardContentnew">
        {/* {type === 'image' ? (
          <img src={image} className="nftCardImage" />
        ) : type === 'audio' ? (
          <img src="/assets/img/posts/1.jpg" className="nftCardImage" />
        ) : null} */}

        {type == 'image' || contentType === "image" ? (
          <>
          {
            !source &&
            <img src={LOADER_IMAGE} alt="" className="nftCardImage" />
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
        <div className="nftCardTitle mb-1">{name}</div>
        <div className=" mb-2 nickname">{nickName}</div>
        <div className="nftCardPillPriceWrapper ">
          <div className="text-right text_margin_left">
            <img
              src={BNB}
              className="nftCardPillCurrencyImage mr-md-2 mr-0"
            />
            <span className="price_item_nft"> {ethprice} </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardMoralis

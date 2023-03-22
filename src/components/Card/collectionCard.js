import React, { useEffect, useState } from 'react'
import AudioImage from './AudioImage'
import VideoImage from './VideoImage'
import { useDispatch } from 'react-redux'
import './style.css'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { Get_Profile_By_AccountId } from "apis";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { RPC_URLS } from 'pages/Header/connectors'
import { LOADER_IMAGE } from '.../../constants'

function CollectionCard(props) {
  const { type } = useParams();
  const mobileAccount = localStorage.getItem('mobileAccount')
  const isActive = localStorage.getItem('isActive')
  const isCss = props.isCss
  const {
    id,
    image,
    audio,
    isSale,
    imageCover,
    collectionName,
    name,
    owner,
    creator,
    price,
    saleType,
    likes,
    maxSupply,
    mintCost,
    collectionAddress,
    currency,
    isMoralisesCollection,
    approve,
    approved,
  } = props.data
  
  const { account } = useWeb3React()
  const history = useHistory()
  const [ownerAvatar, setOwnerAvatar] = useState(
    'assets/img/avatars/avatar.jpg',
  )
  const [nickName, setNickName] = useState('@unkown')
  const [follow, setFollow] = useState(likes)
  const [accounts, setAccount] = useState(account);
  const [source, setSource] = useState("");


  const getAvatar = async () => {
    const url = await Get_Profile_By_AccountId(owner,'');
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

  const putOnSaleHnadler = () => {
    props.showUpdates(id, isSale, saleType, collectionAddress)
  }

  useEffect(() => {
    if (imageCover) {
      const img = new Image()
      img.src = imageCover
      img.onload = () => setSource(imageCover)
    }
  }, [imageCover])

  return (
    <div className="nftCard1 bleuFrosted1 product product_space_myitem">
      <div className="nftCardImageWrapper ">
        {true && (
          <Link to={`/collection/${id}/${collectionAddress}/test`}>
            {
              !source &&
              <img src={LOADER_IMAGE} alt="" className="nftCardImage" />
            }
            { source &&
              <img src={imageCover} alt="" className="nftCardImage" />
            }
          </Link>
        ) }
      </div>
      <div className="nftCardContent product_comment product_space_card">
        <div className="nftCardTitle mb-0">{name}</div>
        <div className="row">
          <div
            className="col-12 nftCardPillPriceWrapper"
          >
            {collectionName ? collectionName : creator}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-sm-6 col-12">
            <p className='nft_totals'>Total NFTs: {maxSupply}</p>
          </div>

          <div className="col-md-6 col-sm-6 col-12">
            <div className="nftCardPillPriceWrapper">
              <div className="text-card-right mb-md-0 mb-2 pl-md-0 pl-1">
                {/* <img
              src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
              className="nftCardPillCurrencyImage mr-2"
            /> */}
                <p>{mintCost} {currency}</p>
              </div>
            </div>
          </div>
        </div>
         
        {!approved &&  
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12">
            <p className='nft_totals'>Not Approved</p>
          </div>
        </div>
        }

      {approved &&  
        <div className="row">
          <div className="col-md-6 col-sm-6 col-12">
            <p className='nft_totals'>Approved</p>
          </div>
        </div>
        }

        {window.location?.pathname === '/collections' ? null : (
          <div className="row">
            <div className="col-md-12 pb-0">
              {approve && isSale ? null : approve == false &&
                isSale == false ? (
                <div className="col-12 text-right pending_custombtn pr-0 pl-0 mb-0">
                  <button className="pendingbtnnew">Pending</button>
                </div>
              ) : !isMoralisesCollection && null}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CollectionCard

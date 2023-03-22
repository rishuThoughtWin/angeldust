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

function PutOffSale(props) {
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
        auctionCreator
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
    if (hasDecimal(price)) {
        ethprice = price
    }
    else {
        if (price >= 1 && price < 100000) {
            ethprice = price
        }
        else {
            ethprice = web3.utils.fromWei(price.toString(), "ether");
        }
    }
    const [nickName, setNickName] = useState('@unkown')
    const [follow, setFollow] = useState(likes)


    const getAvatar = async () => {
        const url = await Get_Profile_By_AccountId(owner, '')
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
    }, [image]);

    const redirectToDetail = (e) => {
        history.push(`/item/${collectionAddress}/${id}`);
    }

    return (
        <div
            className="nftCard bleuFrosted"
            onClick={redirectToDetail}
        >
            <div className="nftCardImageWrapper nftCardContentnew">

                {type === "image" ? (
                    <>
                        {
                            !source &&
                            <img src={LOADER_IMAGE} alt="" className="nftCardImage" />
                        }
                        {source && <img src={image} alt="" className="nftCardImage" />}

                    </>
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
                    <div className="relative item-video">
                        {
                            !source ?
                            <img src={LOADER_IMAGE} alt="" className="nftCardImage" />
                            :
                            <VideoImage src={image} className="videoAsset" />
                        }
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
                        <span className="price_item_nft"> {ethprice} </span> BNB
                    </div>
                </div>
            </div>
            <div>
                <button onClick={(e)=>props.handlePutOffSale(e,props.data)} className='pendingbtnnew'>Put Off Sale</button>
            </div>
        </div>
    )
}

export default PutOffSale;

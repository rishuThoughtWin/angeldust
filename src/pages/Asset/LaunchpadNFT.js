import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetItem from "components/AssetItem";
import { Link, useHistory, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import reserveAuctionAbi from "../../services/smart-contract/reserveAuction.json";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AWS_IMAGE_PATH, NFT_MARKET_ADDRESS } from "../../constants";
import Axios from "axios";
import "styles/activity.css";
import Web3 from "web3";
import LoaderNew from "components/Loader-New";
import { getCollectionByIdApi } from "apis";
import { RPC_URLS } from "../Header/connectors";
import { getNftDetail } from "apis";
import { getNFTAttributes } from "apis";
import { getCollectionMetaData } from "apis";

function LaunchpadNFT() {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const reserveContractInstance = new web3.eth.Contract(
    reserveAuctionAbi.abi,
    reserveAuction
  );
  const history = useHistory()
  const { library, active, account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const { id, collectionAddress } = useParams();
  const [user, setUser] = useState({
    account: accounts,
    avatar: "assets/img/avatars/avatar.jpg",
    ownerAvatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "User",
    lastName: "",
    nickName: "user",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    time: 0,
    isSale: false,
    owner: null,
    saleType: null,
    likes: [],
    price: 0,
    paymentType: "BNB",
  });
  const [collectionName, setCollectionName] = useState(null);
  const [collectionID, setCollectionID] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionOnSale, setCollectionOnSale] = useState()
  const [attributes, setAttributes] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const dispatch = useDispatch();
  const dispatchNftItem = async (payload) => {
    try {
      const res = await dispatch({ type: "SET_SELECTED", payload });
      setItem(payload);
    }
    catch (err) {
      console.log(err)
    }
  };

  const getItem = async (item_id) => {
    const res = await getNftDetail(id);
    let nft_item = res?.data?.success?.data;
    const collectionRes = await getCollectionMetaData(nft_item?.collectionId, null);
    const collectionInfo = collectionRes?.data?.success?.data;
    if (collectionInfo) {
      setCollectionOnSale(nft_item?.collectionOnSale)
      setCollectionID(collectionInfo?._id);
      setCollectionName(collectionInfo?.collectionName);
      setIsLoading(false);
    }
    setIsLoading(false);
    let nftInfo = { data: {} };
    try {
      if (nft_item?.awsImage) {
        const awsImage = nft_item?.awsImage?.webp['400X400']
        nftInfo = `${AWS_IMAGE_PATH}${awsImage}`
        const image = { image: nftInfo }
        dispatchNftItem({ id, ...user, ...nft_item, ...image });
      }
      else if (nft_item?.nftImage) {
        dispatchNftItem({ id, ...user, ...nft_item })
      }
      else {
        nftInfo = await Axios.get(nft_item.tokenURI)
        let imgurl = null
        if (!nftInfo?.data?.image?.includes("bleufi.mypinata.cloud")) {
          if (nftInfo?.data?.image?.includes("ipfs://")) {
            imgurl = nftInfo?.data?.image?.replace("ipfs://", 'https://bleufi.mypinata.cloud/ipfs/')
          } else {
            imgurl = nftInfo?.data?.image
          }
        } else {
          imgurl = nftInfo.data.image
        }
        dispatchNftItem({ id, ...user, ...nft_item, image: imgurl });
      }
      if(nft_item) getAttributes(nft_item?.collectionId, nft_item?.id)
    } catch (err) {
      console.log(err);
    }

    let auction_info;
    try {
      auction_info = await reserveContractInstance.methods
        .auctions(nft_item.collectionAddress, parseInt(nft_item.tokenId))
        .call();
    } catch (err) {
      console.log(err);
    }
  };

  const getAttributes = async(collectionId, nftId)=>{
    const req = {
      collectionId : collectionId,
      nftId: nftId
  }
    const res = await getNFTAttributes(req)
    if(res) setAttributes(res?.data?.success?.data)
  }

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  useEffect(() => {
    getItem(id);
  }, [active, id]);



  return isLoading ? (
    <LoaderNew />
  ) : (
    <>
      {
        isProcessing && <LoaderNew />
      }

      <main className="main contentCol">
        <div className="hero_common creator_hero_main mt-3">
          <div className="hero_border pb-5">
            <div className="container">


              <div className="row detail_nft_card">
                {/* <!-- content --> */}
                <div className="col-12 col-md-5 cardAssetPreview">
                  <AssetItem data={item} />
                </div>
                
                {/* <!-- end content --> */}

                {/* <!-- sidebar --> */}
                <div className="col-12 col-md-7 bleuFrosted cardAssetDetails">
                  <div className="asset__info">
                    <div className="asset__wrap">

                      <div className="main__title main__title--page mt-0">
                        <div className="row">
                        <h1 className="col-lg-6 col-md-6 col-6 ml-0 collect_detail_username">{item.name}</h1>

                        </div>

                        <Link
                          className={`${collectionName ? "asset__author--verified" : ""
                            }`}
                          to={`/collection/${collectionID}/${collectionAddress}/test`}
                        >
                          {collectionName}
                        </Link>
                        {accounts && item?.creator?.toLocaleLowerCase()==accounts?.toLocaleLowerCase() ?
                          <p className="create_title" onClick={()=>history.push(`/creator/${item?.creator}?tab=profile`)}>
                          Created by <span> {item?.creator} </span>
                          </p>
                          :
                          <p className="create_title" onClick={()=>history.push(`/creator-public/${item?.creator}`)}>
                          Created by <span> {item?.creator} </span>
                          </p>
                        }
                      </div>
                      <div className="asset__desc mt-4 asset_height_detail">
                        <span className="cardAssetDetailsLabel">Description</span>
                        <p>{item.description}</p>
                      </div>

                    </div>
                    {attributes ?
                      <div className="border_card card_accordion_box">
                        <div className="accordion" id="accordionExample">
                          <div className="card">
                            <div className="card-header d-block w-100 text-left" id="headingOne">
                              <h2>
                                <button className="btn text-left collapsed d-block w-100" type="button" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                  Attributes ({attributes?.length})
                                </button>
                              </h2>
                            </div>

                            <div id="collapseOne" className="collapse show w-100" aria-labelledby="headingOne" data-parent="#accordionExample">
                              <div className="card-body">
                                <div className="attributeDiv">
                                  {attributes && attributes.map((data, index) => {
                                    return (
                                      <div className="attributeInnerDiv">
                                        <span className="attributeinnerLabel d-block" style={{ textTransform: 'capitalize', textAlign: 'center' }}>{data?.trait_type}</span>
                                        <span className="attributeinnerDivSpan d-block" style={{ textTransform: 'capitalize' }}>{data?.value}</span>
                                        <p className="attribute_para">{data?.percentage?.toFixed()} % have this trait</p>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                      : null}
                  </div>
                </div>
                {/* <!-- end sidebar --> */}
              </div>
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default LaunchpadNFT;



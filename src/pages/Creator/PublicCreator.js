import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useWeb3React } from "@web3-react/core";
import { Link, useLocation, useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

import AuthorMeta from "components/AuthorMeta";
import Card from "components/Card";
import Filter from "components/Filter";
import { toast } from "react-toastify";
import { AUCTION, ChainID, DefaultAvatar, DefaultCoverImage, DefaultNetwork, DefaultNickName, FIXED, IN_VALID_ADDRESS, } from "../../constants";
import CollectionCard from "components/Card/collectionCard";

import putOnSaleAbi from "../../services/smart-contract/ERC721";
import { parseUnits } from "@ethersproject/units";
import Twitter from "../../assets/img/social-icon/twitter.png";
import Instagram from "../../assets/img/social-icon/instagram.png";
import Telegram from "../../assets/img/social-icon/telegram.png";
import reserveAuctionAbi from "../../services/smart-contract/reserveAuction";
import buyCollectionNFTabi from "../../services/smart-contract/ERC721";
import collectionAbi from "../../services/smart-contract/CollectionFactory";
import FixedSaleMarketPlaceAbi from "../../services/smart-contract/FixedSaleMarketPlace";
import { RPC_URLS } from "../Header/connectors";
import CardMoralis from "components/Card/CardMoralis";
import LoaderNew from "components/Loader-New";
import { useDisconnect } from "hooks/useDisconnect";
import PutOffSale from "components/Card/PutOffSale";
import {
  Get_Profile_By_AccountId,
  Get_Profile_By_NickName,
  getAllCollectionsApi,
  getAllNFTSApi,
  update_Profile,
  uploadFileToPinata,
  getAllExternalNFTSApi,
  PutOffSale_Api,
  getBlackListedNFTSApi
} from "apis";

let setTimeData = null;

const PublicCreator = () => {
  const { id } = useParams();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const mobileAccount = localStorage.getItem("mobileAccount");
  const { account } = useWeb3React();
  const web3 = new Web3(Web3.givenProvider || window.etherum);

  const [accounts, setAccount] = useState(account);
  const isAdmin = localStorage.getItem("owner");

  const [buffer, setBuffer] = useState(null);
  const [bufferBanner, setBufferBanner] = useState(null);
  const [attachBuffer, setAttachBuffer] = useState(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState(DefaultAvatar);
  const [imageCover, setImageCover] = useState(DefaultCoverImage);
  const [file, setFile] = useState(null);
  const [nickName, setNickName] = useState("");
  const [bio, setBio] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [instagram, setInstagram] = useState("");
  const [subscribe, setSubscribe] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [followers, setFollowers] = useState(0);
  const [cards, setCards] = useState([]);
  const [blackListedNFTs, setBlackListedNFTs] = useState([]);
  const [moralisList, setMoralisList] = useState([]);
  const [nftCollection, setNFTCollection] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [pageMy, setPageMy] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);
  const [saleType, setSaleType] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState(null);

  const limitPerPage = 12;
  const externalItemPerPage = 12;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalMoralisNFTs, setTotalMoralisNFTs] = useState(0);

  const [cursor, setCursor] = useState("");
  const [externalCurrentPage, setExternalCurrentPage] = useState(0);
  const [externalTotalPages, setExternalTotalPages] = useState(0);
  const [creatorlength, setCreatorlength] = useState();

  const [localTab, setLocalTab] = useState(tab);
  const adminUser = localStorage.getItem("owner");
  const [play, setPlay] = useState(true);
  const [user, setUser] = useState({});

  const tokenId = useSelector(state => state?.tokenData?.token);
  const newContract = process.env.REACT_APP_COLLECTION_FACTORY;
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const abiFile = collectionAbi.abi;

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);





  const getProfile = async (userAccount = id) => {
    const result = await Get_Profile_By_AccountId(userAccount, tokenId);
    if (result?.success) {
      const userData = result?.data;
      setUser(userData);
      resetProfile(userData);
    } else {
      let userProfile = {
        avatar: DefaultAvatar,
        imageCover: DefaultCoverImage,
        firstName: "",
        lastName: "",
        nickName: DefaultNickName,
        account: accounts || "",
        bio: "",
        twitter: "",
        telegram: "",
        instagram: "",
        subscribe: "",
        followers: [],
      };
      setUser(userProfile);
      resetProfile(userProfile);
    }
  };

  useEffect(() => {
    // getMyAll(true, searchText);
    // getExternalNFTs();

  }, []);

  // useEffect(() => {
  //   if (pageNo > 1 && accounts)
  //     getMyAll(false, searchText)
  // }, [pageNo, account])


  const getMyAll = async (isNew = false, value) => {
    let lists = [];
    try {
      setPlay(true);
      // let sortBy = "-createdAt";
      const req = {
        page: pageNo,
        limit: limitPerPage,
        search: value,
        owner: id,
        // sort: sortBy,
      }

      const res = await getAllNFTSApi(req);

      const data = res?.data;
      const resList = res?.data?.data;

      if (resList?.length) {
        resList.forEach(async (doc) => {
          const result = await getTokenInfo(doc.tokenURI);
          let nft_data = null;
          if (result) {
            nft_data = { id: doc.objectID, ...doc, ...result }
          } else {
            nft_data = { id: doc.objectID, ...doc }
          }
          lists = [...lists, nft_data];
          if (isNew) {
            setCards([...lists]);
          } else {
            setCards([...cards, ...lists]);
          }
        });
      }
      setPlay(false);
      setTotalPages(data.totalPages);
      setCurrentPage(Number(data.currentPage))
    } catch (res) {
      setPlay(false);
    }

  };

  const getBlackListedNFTs = async (isNew = false, value) => {
    let lists = [];
    try {
      setPlay(true);
      const req = {
        search: value,
        owner: id
      }

      const res = await getBlackListedNFTSApi(req, tokenId);

      const resList = res?.data?.data;

      if (resList?.length) {
        resList.forEach(async (doc) => {
          const result = await getTokenInfo(doc.tokenURI);
          let nft_data = null;
          if (result) {
            nft_data = { id: doc.objectID, ...doc, ...result }
          } else {
            nft_data = { id: doc.objectID, ...doc }
          }
          lists = [...lists, nft_data];
          if (isNew) {
            setBlackListedNFTs([...lists]);
          } else {
            setBlackListedNFTs([...blackListedNFTs, ...lists]);
          }

        });
      }
      setPlay(false);
    } catch (res) {
      setPlay(false);
    }

  };

  const getExternalNFTs = async () => {
    let moralisListItems = [];
    let request = null
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      request = {
        "cursor": cursor,
        "chain": ChainID[DefaultNetwork],
        "account": id?.toLowerCase(),
        "limit": externalItemPerPage,
      }
    } else {
      request = {
        "cursor": cursor,
        "chain": ChainID[DefaultNetwork],
        "account": id?.toLowerCase(),
        "limit": externalItemPerPage,
      }
    }
    const resMoralis = await getAllExternalNFTSApi(request);
    const resData = resMoralis?.data?.data;
    const data = resData?.result;
    setTotalMoralisNFTs(resData?.total);
    if (resData?.total) {
      const apiTotalNFTs = Number(resData?.total);
      const totalPage = apiTotalNFTs < externalItemPerPage ? 0 : (apiTotalNFTs % externalItemPerPage === 0 ? (apiTotalNFTs / externalItemPerPage) : (apiTotalNFTs / externalItemPerPage) + 1);

      setExternalTotalPages(totalPage)
    }
    else {
      setExternalTotalPages(0)
    }
    if (resData?.cursor) {
      setCursor(resData?.cursor)
    }
    else {
      setCursor("");
    }
    if (resData?.page) {
      setExternalCurrentPage(resData?.page + 1)
    }

    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        let doc = data[i];
        const nftInfo = await getTokenInfo(doc.token_uri);
        let nft_data = null;
        if (nftInfo) {
          nft_data = { id: doc.token_id, ...doc, ...nftInfo }
        } else {
          nft_data = { id: doc.token_id, ...doc }
        }
        moralisListItems = [...moralisListItems, nft_data];
      }
      if (!cursor) {
        setMoralisList([...moralisListItems]);
      } else {
        setMoralisList([...moralisList, ...moralisListItems])
      }

    }
    else {
      //setMoralisList([])
    }
  }

  const getMyAllCollection = async (isNew = false, value, address) => {

    if (address) {
      const creator = address
      const approve = ''
      const res = await getAllCollectionsApi(pageNo, limitPerPage, value, creator, approve);
      const data = res?.data?.data;
      const lists = [];

      if (data) {
        data.forEach(async (doc) => {
          const nftInfo = doc
          const nft_data =
            nftInfo
              ? { id: doc.id, ...user, ...doc, ...nftInfo }
              : { id: doc.id, ...user, ...doc };
          lists.push(nft_data);
        });
      }
      setTotalPages(res?.data?.totalPages);
      setCurrentPage(Number(res?.data?.currentPage));
      setTimeout(() => {
        setNFTCollection(isNew ? lists : [...lists]);
      }, 1000);

      setCreatorlength(lists.length);
      setPageMy(isNew ? 1 : pageMy + 1);
    }
  };

  const getTokenInfo = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  useEffect(() => {
    getProfile(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0]);
      getMyAllCollection(true, searchText, provider.accounts[0]);
    } else {
      setAccount(account);
      getMyAllCollection(true, searchText, account);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, account]);



  const handleSearch = (e) => {
    clearTimeout(setTimeData)
    setSearchText(e.target.value);
    setTimeData = setTimeout(() => {
      setPageNo(1)
      if (!localTab || localTab === "items") {
        getMyAll(true, e.target.value)
      }
      else if (localTab === "collection") {
        getMyAllCollection(true, e.target.value, accounts)
      }
    }, 2000);
  };
  const submitSearch = (e) => {
    e.preventDefault();

  }

  const resetProfile = (user_info) => {
    if (!user_info) user_info = user;
    setFirstName(user_info?.firstName);
    setLastName(user_info?.lastName);
    setAvatar(user_info?.avatar);
    setImageCover(user_info?.imageCover);
    setNickName(user_info?.nickName);
    setBio(user_info?.bio);
    setTwitter(user_info?.twitter);
    setTelegram(user_info?.telegram);
    setInstagram(user_info?.instagram);
    setSubscribe(user?.subscribe);
    setFollowers(user?.followers);
  };

  const showUpdates = (id, isSale, type, address) => {
    setCollectionId(id);
    setSaleType(type);
    setCollectionAddress(address);
    if (isSale && !showUpdate) updateSale(true);
    setShowUpdate(!showUpdate);
  };

  const updateSale = async (lock = false) => {
    setIsProcessing(true);
    try {
      const userExist = await Get_Profile_By_AccountId(accounts, '')
      if (!userExist?.data?.nickName) {
        toast.error("Please update your profile first.");
        setIsProcessing(false);
        return;
      }

      if (newPrice <= 0) {
        toast.error("Price should not be zero.");
        setIsProcessing(false);
        return;
      }

      const web3 = new Web3(Web3.givenProvider || window.etherum);
      const address = collectionAddress;
      const abiFile = putOnSaleAbi.abi;
      let res;
      if (mobileAccount == "true") {
        const provider = new WalletConnectProvider({
          rpc: RPC_URLS,
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const contractInstance = new web3.eth.Contract(abiFile, address);
        res = await contractInstance.methods
          .setOnSale(true, parseUnits(newPrice.toString()))
          .send({ from: accounts });
      } else {
        const contractInstance = new web3.eth.Contract(abiFile, address);
        res = await contractInstance.methods
          .setOnSale(true, parseUnits(newPrice.toString()))
          .send({ from: accounts });
      }

      if (res) {
        setTimeout(async () => {
          await getMyAllCollection(true, searchText, accounts);
          toast.success("Listed on marketplace successfully");
        }, 2000)

        setShowUpdate(false);
        setIsProcessing(false);
      }
    } catch (err) {
      setShowUpdate(false);
      console.log(err);
      toast.error("Fail to update");
      setIsProcessing(false);
    }
  };


  const handleShowMoreItemImages = () => {
    setPageNo(pageNo + 1);
  };

  const isShowLoadMore = () => {
    if (cursor && moralisList && moralisList.length > 0 && externalTotalPages > externalCurrentPage && totalMoralisNFTs > moralisList?.length) {
      return <button className="main__load"
        type="button"
        onClick={getExternalNFTs}
        variant="contained">Load more</button>
    }
    if (cards && cards.length > 0 && cards < 40 && totalPages > currentPage) {
      return <button className="main__load"
        type="button"
        onClick={handleShowMoreItemImages}
        variant="contained">Load more</button>
    }
  }


  return (
    <>
      {
        isProcessing && <LoaderNew />
      }
      <main className="main contentCol">
        <div className="hero_common creator_hero_main profile_new">
          <div className="hero_border pb-5 pt-5">
            <div className="container">
              <div className="border_card">
                <div
                  className="main__author authorImageWrapper"
                  data-bg="/assets/img/bg/bg.png"
                >
                  <img src={user?.imageCover || "/assets/img/bg/bg.png"} width="100%" height="100%" alt="" />
                </div>
              </div>
              <div className="row row--grid">
                <div className="col-xl-12 col-md-12 col-12">
                  <div className="author author--page bleuFrostedSharp">
                    <AuthorMeta data={user} getData={getProfile} />
                  </div>
                </div>

                <div className="col-xl-12 col-md-12 col-12">
                  <div className="profile bleuFrosted inner-adminprofile pl-0">
                    {/* tabs nav */}
                    <ul
                      className="nav nav-tabs profile__tabs"
                      id="profile__tabs"
                      role="tablist"
                    >
                      {accounts !== id && (
                        <li className="nav-item">
                          <a
                            className={`nav-link ${tab == "items" || accounts !== id ? "active" : ""
                              }`}
                            data-toggle="tab"
                            href="#tab-collection"
                            role="tab"
                            aria-controls="tab-collection"
                            aria-selected={accounts != id}
                            onClick={() => setLocalTab("items")}
                          >
                            Items
                          </a>
                        </li>
                      )}
                    </ul>
                    {/* end tabs nav */}
                  </div>

                  {/* { tab !== "blacklisted" &&
                    <div className="col-12 mt-3 creator-searchbar pl-md-0">
                      <div className="search-outline-author d-flex mr-auto justify-content-start align-items-center">
                        <form onSubmit={submitSearch}>
                          <input
                            type="text"
                            placeholder="Search... "
                            className="search-input p-3 searchInputAuthor"
                            value={searchText}
                            onChange={(e) => handleSearch(e)}
                          />
                          <button className="email-btn">
                            <BsSearch onClick={() => getMyAll(true, searchText)} />
                          </button>
                        </form>
                      </div>
                    </div>
                  } */}
                  {/* content tabs */}
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${tab == "items" || accounts != id ? "show active" : ""
                        }`}
                      id="tab-collection"
                      role="tabpanel"
                    >
                      <div className="row row--grid mt-20">
                        {moralisList && moralisList.map((card, index) => (
                          <div
                            className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                            key={`card-collection-${index}`}
                          >
                            <CardMoralis key={card?._id} data={card} id={card.id} />
                          </div>
                        ))}

                        {cards && cards.map((card, index) => (
                          <div
                            className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                            key={`card-collection-${index}`}
                          >
                            <Card key={card?._id} data={card} id={card.id} />
                          </div>
                        ))}
                      </div>
                      <div className="row row--grid">

                        <div className="col-12">
                          {isShowLoadMore()}

                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end content tabs */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {showUpdate && (
          <div className="mfp-wrap">
            <div className="mfp-container">
              <div className="mfp-backdrop" onClick={showUpdates}></div>
              <div className="zoom-anim-dialog mfp-preloader modal modal--form">
                <button className="modal__close" onClick={showUpdates}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                  </svg>
                </button>
                <h4 className="sign__title">List For Sale</h4>
                <div className="sign__group sign__group--row">
                  <label className="sign__label" htmlFor="saleType">
                    Sale Type:
                  </label>
                  <input
                    className="sign__input height-sm"
                    value="Fixed"
                    name="Fixed"
                    disabled
                  />

                  <label className="sign__label" htmlFor="updatePrice">
                    {saleType === "Fixed" ? "Update" : "First"} Price:
                  </label>
                  <input
                    id="updatePrice"
                    type="number"
                    name="updatePrice"
                    className="sign__input height-sm"
                    value={newPrice}
                    onChange={(e) => {
                      setNewPrice(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="sale_btn"
                  onClick={() => {
                    updateSale(false);
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Waiting..." : "List for sale"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};
export default PublicCreator;

import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { useWeb3React } from "@web3-react/core";
import { Link, useLocation, useParams } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { BrowserView, MobileView } from "react-device-detect";
import AuthorMeta from "components/AuthorMeta";
import Card from "components/Card";
import Filter from "components/Filter";
import { toast } from "react-toastify";
import axios from "axios";
import {
  AUCTION,
  AWS_IMAGE_PATH,
  ChainID,
  DefaultAvatar,
  DefaultCoverImage,
  DefaultNetwork,
  DefaultNickName,
  DEFAULT_TOKEN_URI,
  FIXED,
  IN_VALID_ADDRESS,
} from "../../constants";
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
  getBlackListedNFTSApi,
} from "apis";
import { getLaunchpadNft } from "apis";
import { getMyLaunchPadCollection } from "apis";
import { getMyNftList } from "apis";
import Loader from "components/Loader";

let setTimeData = null;

const AuthorPage = () => {
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
  const [coverFile, setCoverFile] = useState(null);
  const [file, setFile] = useState(null);
  const [nickName, setNickName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [twitter, setTwitter] = useState("");
  const [telegram, setTelegram] = useState("");
  const [instagram, setInstagram] = useState("");
  const [subscribe, setSubscribe] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [followers, setFollowers] = useState(0);
  const [cards, setCards] = useState([]);
  const [mobileCards, setMobileCards] = useState();
  const [blackListedNFTs, setBlackListedNFTs] = useState([]);
  const [moralisList, setMoralisList] = useState([]);
  const [saleCards, setSaleCards] = useState([]);
  const [createdCards, setCreatedCards] = useState([]);
  const [likesCards, setLikesCards] = useState([]);
  const [nftCollection, setNFTCollection] = useState([]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [newPrice, setNewPrice] = useState(0);
  const [showUpdate, setShowUpdate] = useState(false);
  const [saleType, setSaleType] = useState(null);
  const [collectionAddress, setCollectionAddress] = useState(null);
  const limitPerPage = 12;
  const externalItemPerPage = 12;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [collectionPageNo, setCollectionPageNo] = useState(1);
  const [totalCollectionPages, setTotalCollectionPages] = useState(0);
  const [currentCollectionPage, setCurrentCollectionPage] = useState(0);
  const [totalMoralisNFTs, setTotalMoralisNFTs] = useState(0);

  const [cursor, setCursor] = useState("");
  const [externalCurrentPage, setExternalCurrentPage] = useState(0);
  const [externalTotalPages, setExternalTotalPages] = useState(0);

  const [localTab, setLocalTab] = useState(tab);
  const adminUser = localStorage.getItem("owner");
  const [play, setPlay] = useState(true);
  const [user, setUser] = useState({});
  const dispatch = useDispatch();
  const { disconnectWalletConnect } = useDisconnect();
  const tokenId = useSelector((state) => state?.tokenData?.token);
  const newContract = process.env.REACT_APP_COLLECTION_FACTORY;
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const abiFile = collectionAbi.abi;
  const abiFileCollections = buyCollectionNFTabi.abi;
  const contractInstance = new web3.eth.Contract(abiFile, newContract);
  const reserveContractInstance = new web3.eth.Contract(
    reserveAuctionAbi.abi,
    reserveAuction
  );
  const FixedSaleMarketPlace = process.env.REACT_APP_FIXED_MARKETPLACE;

  const fixedPriceContractInstance = new web3.eth.Contract(
    FixedSaleMarketPlaceAbi.abi,
    FixedSaleMarketPlace
  );
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [blackListedNFTs]);

  const dispatchProfile = (payload) => {
    dispatch({ type: "SET_PROFILE", payload });
  };

  const openAvtarHandle = () => {
    document.getElementById("imgAvtar").click();
  };
  const updateAvatar = (e) => {
    const target = e.target;
    const files = target.files;
    const file = files[0];
    if (!file?.type?.startsWith("image/")) {
      return toast.error("Please select valid image.");
    }
    setFile(file);
    getFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const openFileHandler = () => {
    document.getElementById("imgCover").click();
  };
  const updateCover = (e) => {
    const target = e.target;
    const files = target.files;
    const file = files[0];
    if (!file?.type?.startsWith("image/")) {
      return toast.error("Please select valid image.");
    }
    setCoverFile(file);
    getBannerFile(file);
    setImageCover(URL.createObjectURL(file));
  };

  const getFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      if (!isAttach) {
        setBuffer(binaryStr);
      } else setAttachBuffer(binaryStr);
    };

    reader.readAsArrayBuffer(file);
  };

  const getBannerFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
      const binaryStr = reader.result;
      if (!isAttach) {
        setBufferBanner(binaryStr);
      } else setAttachBuffer(binaryStr);
    };

    reader.readAsArrayBuffer(file);
  };

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
        email: "",
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
    setLocalTab(tab);
    getMyAllCollection("");
  }, [tab]);

  useEffect(() => {
    getMyAll(true, searchText);
    // getExternalNFTs();
    getBlackListedNFTs(true, searchText);
  }, []);

  useEffect(() => {
    if (pageNo > 1 && accounts) getMyAll(false, searchText);
  }, [pageNo, account]);

  useEffect(() => {
    if (collectionPageNo > 1 && accounts) getMyAllCollection("");
  }, [collectionPageNo, account]);

  const getMyAll = async (isNew = false, value) => {
    setCards([])
    try {
      setPlay(true);
      const req = {
        page: pageNo,
        limit: limitPerPage,
        searchText: value,
        owner: id,
        networkId: localStorage.getItem("networkId"),
        networkName: localStorage.getItem("networkName"),
        sortBy: {"name":"created_at", "order":-1},
      };

      // const res = await getLaunchpadNft(req);
      const res = await getMyNftList(req, tokenIdBearer);
      const data = res?.data?.success?.data?.results;
      const resList = res?.data?.success?.data?.results;
      let lists1 = [];
      let lists2 = [];
      if (resList?.length) {
        resList?.map(async (doc) => {
          let nft_data1 = null;
          let nft_data2 = null;
          const result = await axios.get(doc.tokenURI);
          if (result?.data) {
            if (doc?.awsImage) {
              const awsImageBrowser = doc?.awsImage?.webp['400X400']
              const awsImageMobile = doc?.awsImage?.webp['200X200']
              const nftInfo1 = `${AWS_IMAGE_PATH}${awsImageBrowser}`
              const nftInfo2 = `${AWS_IMAGE_PATH}${awsImageMobile}`
              delete doc['image']
              nft_data1 = { id: doc.id, image: nftInfo1, ...doc }
              nft_data2 = { id: doc.id, image: nftInfo2, ...doc }
            }
           
            else if (!result?.data?.image) {
              delete doc['image']
              nft_data1 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc }
              nft_data2 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc }
            }
            else {
              let imgurl = null
              if (!result?.data?.image?.includes("bleufi.mypinata.cloud")) {
                if (result?.data?.image?.includes("ipfs://")) {
                  imgurl = result?.data?.image?.replace("ipfs://", 'https://bleufi.mypinata.cloud/ipfs/')
                } else {
                  imgurl = result?.data?.image
                }
              } else {
                imgurl = result.data.image
              }
              delete doc['image']
              nft_data1 = { id: doc.id, image: imgurl, ...doc }
              nft_data2 = { id: doc.id, image: imgurl, ...doc }
            }
          }

          else {
            nft_data1 = { id: doc.id, ...doc }
            nft_data2 = { id: doc.id, ...doc }
          }
          lists1 = [...lists1, nft_data1];
          lists2 = [...lists2, nft_data2];
          setCards([...lists1]);
          setMobileCards([...lists2]);
        });
      }
      setPlay(false);
      setTotalPages(res?.data?.success?.data.totalPages);
      setCurrentPage(Number(res?.data?.success?.data.page));
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
        owner: id,
      };
      const res = await getBlackListedNFTSApi(req, tokenId);
      const resList = res?.data?.data;
      if (resList?.length) {
        resList.forEach(async (doc) => {
          let nft_data = null;

          const result = await getTokenInfo(doc.tokenURI);
          if (result) {
            if (doc.awsImagesUpdated?.awsImage) {
              const awsImage = doc.awsImage.webp["400X400"];
              const nftInfo = `${AWS_IMAGE_PATH}${awsImage}`;
              delete doc["image"];
              nft_data = { id: doc.objectID, image: nftInfo, ...doc };
            } else {
              nft_data = { id: doc.objectID, ...doc, ...result };
            }
          } else {
            nft_data = { id: doc.objectID, ...doc };
          }

          lists = [...lists, nft_data];
          if (isNew) {
            setBlackListedNFTs([...lists]);
          } else {
            setBlackListedNFTs([...blackListedNFTs, ...lists]);
          }
        });
      } else {
        setBlackListedNFTs([]);
      }
      setPlay(false);
    } catch (res) {
      setPlay(false);
    }
  };

  const getExternalNFTs = async () => {
    let moralisListItems = [];
    let request = null;
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await provider.enable();
      request = {
        cursor: cursor,
        chain: ChainID[DefaultNetwork],
        account: id?.toLowerCase(),
        limit: externalItemPerPage,
      };
    } else {
      request = {
        cursor: cursor,
        chain: ChainID[DefaultNetwork],
        account: id?.toLowerCase(),
        limit: externalItemPerPage,
      };
    }
    const resMoralis = await getAllExternalNFTSApi(request);
    const resData = resMoralis?.data?.data;
    const data = resData?.result;
    setTotalMoralisNFTs(resData?.total);
    if (resData?.total) {
      const apiTotalNFTs = Number(resData?.total);
      const totalPage =
        apiTotalNFTs < externalItemPerPage
          ? 0
          : apiTotalNFTs % externalItemPerPage === 0
          ? apiTotalNFTs / externalItemPerPage
          : apiTotalNFTs / externalItemPerPage + 1;
      setExternalTotalPages(totalPage);
    } else {
      setExternalTotalPages(0);
    }
    if (resData?.cursor) {
      setCursor(resData?.cursor);
    } else {
      setCursor("");
    }
    if (resData?.page) {
      setExternalCurrentPage(resData?.page + 1);
    }
    if (data?.length) {
      for (let i = 0; i < data.length; i++) {
        let doc = data[i];
        const nftInfo = await getTokenInfo(doc.token_uri);
        let nft_data = null;
        if (nftInfo) {
          nft_data = { id: doc.token_id, ...doc, ...nftInfo };
        } else {
          nft_data = { id: doc.token_id, ...doc };
        }
        moralisListItems = [...moralisListItems, nft_data];
      }
      if (!cursor) {
        setMoralisList([...moralisListItems]);
      } else {
        setMoralisList([...moralisList, ...moralisListItems]);
      }
    }
  };

  const getMyAllCollection = async (value) => {
    const req = {
      page: collectionPageNo,
      limit: limitPerPage,
      // status: "completed",
      sortBy: {"name":"created_at", "order":-1},
      networkId: localStorage.getItem("networkId"),
      networkName: localStorage.getItem("networkName"),
      searchText: value
    };
    const res = await getMyLaunchPadCollection(req, tokenId);
    const data = res?.data?.success?.data?.results;
    const lists = [];

    if (data) {
      data.forEach(async (doc) => {
        const nftInfo = doc;
        const nft_data = nftInfo
          ? { id: doc.id, ...user, ...doc, ...nftInfo }
          : { id: doc.id, ...user, ...doc };
        lists.push(nft_data);
      });
    }
    setNFTCollection([...lists]);
    setTotalCollectionPages(res?.data?.success?.data?.totalPages);
    setCurrentCollectionPage(Number(res?.data?.success?.data?.page));
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
    // eslint-disable-next-line
  }, [id]);

  // eslint-disable-next-line
  useEffect(async () => {
    if (mobileAccount === "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      if (account) setAccount(account);
      if (tab) {
        let ac = await web3.eth.requestAccounts();
        setAccount(ac[0]);
      }
    }
    // eslint-disable-next-line
  }, [id, account]);

  const emailRegExp =
    /^(([^<>()[\]\\.,;:\s@“]+(\.[^<>()[\]\\.,;:\s@“]+)*)|(“.+“))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const saveProfile = async () => {
    // if (!file && !avatar) {
    //   return toast.error("Profile image is required");
    // } else if (!file && !imageCover) {
    //   return toast.error("Banner image is required");
    // }
    if (!firstName) {
      return toast.error("First Name is required");
    } else if (!lastName) {
      return toast.error("Last Name is required");
    } else if (!nickName) {
      toast.error('NickName is required');
      return;
    } 
    // else if (!bio) {
    //   return toast.error("Bio is required");
    // } else if (!email) {
    //   return toast.error("email is required");
    // }

    // if (!email?.match(emailRegExp)) {
    //   return toast.error("email is invalid");
    // }

    try {
      if (!tokenId) {
        return await disconnectWalletConnect();
      }
      setIsProcessing(true);

      if (nickName) {
        const existNickName = await Get_Profile_By_NickName(nickName);

        const apiName = existNickName?.data[0];
        if (
          apiName &&
          apiName?.account?.toLowerCase() !== accounts?.toLowerCase() &&
          apiName.nickName === nickName
        ) {
          toast.error(
            "Your nickName is already used. Please choose another one."
          );
          setIsProcessing(false);
          return;
        }
      }
      let profileImage = null;
      if (file) {
        const data = new FormData();
        data.append("file", file);
        const responsePinata = await uploadFileToPinata(data);
        profileImage = responsePinata?.data?.data.url;
      }
      let bannerImages = null;
      if (coverFile) {
        const data = new FormData();
        data.append("file", coverFile);
        const responsePinata = await uploadFileToPinata(data);
        bannerImages = responsePinata?.data?.data.url;
      }
      const author = {
        avatar: file ? profileImage : user?.avatar,
        imageCover: coverFile ? bannerImages : user?.imageCover,
        firstName,
        lastName,
        nickName,
        bio,
        email,
        twitter: twitter || "",
        telegram: telegram || "",
        instagram: instagram || "",
        subscribe: subscribe || "",
        followers: user?.followers || [],
      };

      let signature;
      if (mobileAccount === "true") {
        const provider = new WalletConnectProvider({
          rpc: RPC_URLS,
        });

        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const profileRes = await Get_Profile_By_AccountId(accounts, "");
        const _id = profileRes?.data?._id;
        signature = await web3.eth.personal.sign(
          JSON.stringify(author),
          provider.accounts[0]
        );
        const updateReq = {
          data: author,
          sign: signature,
        };
        if (profileRes && _id && signature) {
          // update the profile
          const updatedData = await update_Profile(tokenId, updateReq, _id);
          if (updatedData?.success) {
            toast.success("Profile Updated");
            dispatchProfile(author);
            setIsProcessing(false);
            setUser(author);
            resetProfile(author);
            getProfile(accounts);
            window.scrollTo(0, 0);
          } else {
            toast.error("profile update fail");
            setIsProcessing(false);
          }
        } else {
          toast.error("something went wrong.");
          setIsProcessing(false);
        }
      } else {
        let currentAccount = await web3.eth.requestAccounts();
        currentAccount = currentAccount[0];
        signature = await web3.eth.personal.sign(
          JSON.stringify(author),
          currentAccount
        );
        const updateReq = {
          data: author,
          sign: signature,
        };
        const profileRes = await Get_Profile_By_AccountId(currentAccount, "");
        const _id = profileRes?.data?._id;

        if (profileRes && _id && signature) {
          // update the profile
          const updatedData = await update_Profile(tokenId, updateReq, _id);
          if (updatedData?.success) {
            toast.success("Profile Updated");
            dispatchProfile(author);
            setIsProcessing(false);
            setUser(author);
            resetProfile(author);
            getProfile(accounts);
          } else {
            toast.error("profile update fail");
            setIsProcessing(false);
          }
        } else {
          toast.error("something went wrong.");
          setIsProcessing(false);
        }
      }
    } catch (err) {
      toast.error("profile update fail");
      setIsProcessing(false);
    }
  };

  const handleSearch = (e) => {
    clearTimeout(setTimeData);
    setSearchText(e.target.value);
    setTimeData = setTimeout(() => {
      setPageNo(1);
      if (!localTab || localTab === "items") {
        getMyAll(true, e.target.value);
      } else if (localTab === "collection") {
        getMyAllCollection(e.target.value);
      }
    }, 2000);
  };
  const submitSearch = (e) => {
    e.preventDefault();
  };

  const resetProfile = (user_info) => {
    console.log(
      "🚀 ~ file: index.js ~ line 645 ~ resetProfile ~ user_info",
      user_info
    );
    if (!user_info) user_info = user;
    setFirstName(user_info?.firstName);
    setLastName(user_info?.lastName);
    setAvatar(user_info?.avatar);
    setImageCover(user_info?.imageCover);
    setNickName(user_info?.nickName);
    setBio(user_info?.bio);
    setEmail(user_info?.email);
    setTwitter(user_info?.twitter);
    setTelegram(user_info?.telegram);
    setInstagram(user_info?.instagram);
    setSubscribe(user?.subscribe);
    setFollowers(user?.followers);
  };

  const showUpdates = (id, isSale, type, address) => {
    setNewPrice(0);
    setSaleType(type);
    setCollectionAddress(address);
    if (isSale && !showUpdate) updateSale(true);
    setShowUpdate(!showUpdate);
  };

  const updateSale = async (lock = false) => {
    setIsProcessing(true);
    try {
      const userExist = await Get_Profile_By_AccountId(accounts, "");
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
      if (mobileAccount === "true") {
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
          await getMyAllCollection();
          toast.success("Listed on marketplace successfully");
        }, 5000);

        setShowUpdate(false);
        setIsProcessing(false);
      }
    } catch (err) {
      setShowUpdate(false);
      console.log(err);
      toast.error("Failed to Listed on Marketplace");
      setIsProcessing(false);
    }
  };

  const handleShowMoreImages = () => {
    setPageNo(pageNo + 1);
  };
  const handleShowMoreCollection = () => {
    setCollectionPageNo(collectionPageNo + 1);
  };
  const handleShowMoreItemImages = () => {
    setPageNo(pageNo + 1);
  };

  const isShowLoadMore = () => {
    if (
      cursor &&
      moralisList &&
      moralisList.length > 0 &&
      externalTotalPages > externalCurrentPage &&
      totalMoralisNFTs > moralisList?.length
    ) {
      return (
        <button
          className="main__load"
          type="button"
          onClick={getExternalNFTs}
          variant="contained"
        >
          Load more
        </button>
      );
    }
    if (cards && cards.length > 0 && totalPages > currentPage) {
      return (
        <button
          className="main__load"
          type="button"
          onClick={handleShowMoreItemImages}
          variant="contained"
        >
          Load more
        </button>
      );
    }
  };

  const isAuthToken = async () => {
    if (!tokenId) {
      return await disconnectWalletConnect();
    }
  };

  const actionPutOffSale = async (item) => {
    const account = await web3.eth.getAccounts();
    const NFTtokenId = item.tokenId;
    const collectionAddress = item.collectionAddress;

    if (isAdmin === "true") {
      if (mobileAccount === "true") {
        const provider = new WalletConnectProvider({
          rpc: RPC_URLS,
        });
        //  Enable session (triggers QR Code modal)
        await provider.enable();
        const web3 = new Web3(provider);
        const reserveContractInstance = new web3.eth.Contract(
          reserveAuctionAbi.abi,
          reserveAuction
        );
        if (item.saleType === FIXED) {
          await fixedPriceContractInstance.methods
            .putOffSale(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        } else if (item.saleType === AUCTION && !item?.auctionInfo) {
          await reserveContractInstance.methods
            .cancelAuction(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        } else if (item.saleType === AUCTION && item?.auctionInfo) {
          await reserveContractInstance.methods
            .endAuction(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        }
      } else {
        if (item.saleType === FIXED) {
          await fixedPriceContractInstance.methods
            .putOffSale(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        } else if (item.saleType === AUCTION && !item?.auctionInfo) {
          await reserveContractInstance.methods
            .cancelAuction(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        } else if (item.saleType === AUCTION && item?.auctionInfo) {
          if (Date.now() > item.auctionStartTime) {
            toast.error("NFT on auction.");
            return;
          }
          await reserveContractInstance.methods
            .endAuction(collectionAddress, NFTtokenId)
            .send({ from: account[0] });
        }
      }
    }
  };

  const putOffSale = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    setIsProcessing(true);
    const NFTtokenId = item.tokenId;

    isAuthToken();

    try {
      let salesOwnerRes = null;
      let auctionOwnerOf = null;

      if (item.saleType === FIXED) {
        salesOwnerRes = await fixedPriceContractInstance.methods
          .sales(item.collectionAddress, NFTtokenId)
          .call();
      } else if (item.saleType === AUCTION) {
        auctionOwnerOf = await reserveContractInstance.methods
          .auctions(item.collectionAddress, NFTtokenId)
          .call();
      }

      if (
        item.saleType === "Fixed" &&
        salesOwnerRes?.owner === IN_VALID_ADDRESS
      ) {
        const resPutOffSale = await PutOffSale_Api(tokenId, item._id);

        if (resPutOffSale?.success) {
          toast.success("NFT put off sale Success.");
          getBlackListedNFTs(true, "");
          setIsProcessing(false);
        } else {
          toast.error(resPutOffSale?.message);
          setIsProcessing(false);
        }
        return;
      } else if (
        item.saleType === "Auction" &&
        auctionOwnerOf?.owner === IN_VALID_ADDRESS
      ) {
        const resPutOffSale = await PutOffSale_Api(tokenId, item._id);

        if (resPutOffSale?.success) {
          toast.success("NFT put off sale Success.");
          getBlackListedNFTs(true, "");
          setIsProcessing(false);
        } else {
          toast.error(resPutOffSale?.message);
          setIsProcessing(false);
        }
        return;
      } else {
        actionPutOffSale(item);
        const resPutOffSale = await PutOffSale_Api(tokenId, item._id);

        if (resPutOffSale?.success) {
          toast.success("NFT put off sale Success.");
          getBlackListedNFTs(true, "");
          setIsProcessing(false);
        } else {
          toast.error(resPutOffSale?.message);
          setIsProcessing(false);
        }
      }
    } catch (err) {
      console.log(err);
      setIsProcessing(false);
    }
  };

  return (
    <>
      {isProcessing && <LoaderNew />}
      <main className="main contentCol">
        <div className="hero_common creator_hero_main profile_new">
          <div className="hero_border pb-5">
            <div className="container">
              <div className="border_card">
                <div
                  className="main__author authorImageWrapper"
                  data-bg="/assets/img/bg/bg.png"
                >
                  <img
                    src={user?.imageCover || "/assets/img/bg/bg.png"}
                    width="100%"
                    height="100%"
                    alt=""
                  />
                </div>
              </div>
              <div className="row row--grid">
                <div className="col-xl-12 col-md-12 col-12">
                  <div className="author author--page">
                    <AuthorMeta data={user} getData={getProfile} />
                  </div>
                </div>

                <div className="col-xl-12 col-md-12 col-12">
                  <div className="profile adCard inner-adminprofile pl-0">
                    {/* tabs nav */}
                    <ul
                      className="nav nav-tabs profile__tabs"
                      id="profile__tabs"
                      role="tablist"
                    >
                      {accounts?.toLowerCase() !== id?.toLowerCase() && (
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              localTab === "items" || accounts?.toLowerCase() !== id?.toLowerCase()
                                ? "active"
                                : ""
                            }`}
                            data-toggle="tab"
                            href="#tab-collection"
                            role="tab"
                            aria-controls="tab-collection"
                            aria-selected={accounts?.toLowerCase() !== id?.toLowerCase()}
                            onClick={() => setLocalTab("items")}
                          >
                            Items
                          </a>
                        </li>
                      )}
                      {accounts?.toLowerCase() === id?.toLowerCase() && (
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              localTab === "items" || accounts?.toLowerCase() !== id?.toLowerCase()
                                ? "active"
                                : ""
                            }`}
                            data-toggle="tab"
                            href="#tab-collection"
                            role="tab"
                            aria-controls="tab-collection"
                            aria-selected={accounts?.toLowerCase() !== id?.toLowerCase()}
                            onClick={() => setLocalTab("items")}
                          >
                            My Items
                          </a>
                        </li>
                      )}
                      {accounts?.toLowerCase() === id?.toLowerCase() && (
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              localTab === "collection" || accounts?.toLowerCase() !== id?.toLowerCase()
                                ? "active"
                                : ""
                            }`}
                            data-toggle="tab"
                            href="#tab-collection1"
                            role="tab"
                            aria-controls="tab-collection1"
                            aria-selected={accounts?.toLowerCase() !== id?.toLowerCase()}
                            onClick={() => setLocalTab("collection")}
                          >
                            My Collections
                          </a>
                        </li>
                      )}

                      {accounts?.toLowerCase() === id?.toLowerCase() && (
                        <li className="nav-item">
                          <a
                            className={`nav-link ${
                              localTab === "profile" ? "active" : ""
                            }`}
                            data-toggle="tab"
                            href="#tab-setting"
                            role="tab"
                            aria-controls="tab-setting"
                            aria-selected="true"
                            onClick={() => setLocalTab("profile")}
                          >
                            {/* Settings */}
                            Profile
                          </a>
                        </li>
                      )}
                      {(adminUser === "true" || adminUser === true) &&
                      accounts?.toLowerCase() === id?.toLowerCase() ? (
                        <li className="nav-item">
                          <Link
                            className={`nav-link ${
                              localTab === "approval" || accounts?.toLowerCase() !== id?.toLowerCase()
                                ? "active"
                                : ""
                            }`}
                            data-toggle="tab"
                            to="/bleu-admin"
                            role="tab"
                            aria-controls="tab-collection"
                            aria-selected={accounts?.toLowerCase() !== id?.toLowerCase()}
                            onClick={() => setLocalTab("approval")}
                          >
                            Approval
                          </Link>
                        </li>
                      ) : null}
                    </ul>
                  </div>
                  {localTab !== "profile" &&
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
                  }
                  <div className="tab-content">
                    <div
                      className={`tab-pane fade ${
                        localTab === "items" || accounts?.toLowerCase() !== id?.toLowerCase()
                          ? "show active"
                          : ""
                      }`}
                      id="tab-collection"
                      role="tabpanel"
                    >
                      <div>
                        <BrowserView className="row row--grid mt-20">
                          {moralisList &&
                            moralisList.map((card, index) => (
                              <div
                                className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                                key={`card-collection-${index}`}
                              >
                                <CardMoralis
                                  key={card?._id}
                                  data={card}
                                  id={card.id}
                                />
                              </div>
                            ))}

                          {cards && cards?.length > 0 ? (
                            <>
                              {cards.map((card, index) => {
                                return (
                                  <div
                                    className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                                    key={`card-collection-${index}`}
                                  >
                                    <Card
                                      key={card?._id}
                                      data={card}
                                      id={card.id}
                                    />
                                  </div>
                                );
                              })}
                            </>
                          ) : (
                            play === false && (
                              <div style={{ marginTop: "10px" }}>
                                <h3 style={{ color: "white" }}>
                                  No records found...
                                </h3>
                              </div>
                            )
                          )}
                        </BrowserView>
                        <BrowserView className="row row--grid mt-20">
                          <div className="col-12">
                            <Loader isLoading={play} />
                            {cards &&
                              cards.length > 0 &&
                              totalPages > currentPage && (
                                <button
                                  className="main__load"
                                  type="button"
                                  onClick={handleShowMoreImages}
                                  variant="contained"
                                >
                                  Load more
                                </button>
                              )}
                          </div>
                        </BrowserView>
                        <MobileView className="row row--grid relative">
                          {moralisList &&
                            moralisList.map((card, index) => (
                              <div
                                className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                                key={`card-collection-${index}`}
                              >
                                <CardMoralis
                                  key={card?._id}
                                  data={card}
                                  id={card.id}
                                />
                              </div>
                            ))}

                          {mobileCards &&
                            mobileCards.map((card, index) => (
                              <div
                                className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                                key={`card-collection-${index}`}
                              >
                                <Card
                                  key={card?._id}
                                  data={card}
                                  id={card.id}
                                />
                              </div>
                            ))}
                        </MobileView>
                      </div>
                    </div>

                    {/* black listed nfts */}
                    <div
                      className={`tab-pane fade ${
                        localTab === "blacklisted" || accounts?.toLowerCase() !== id?.toLowerCase()
                          ? "show active"
                          : ""
                      }`}
                      id="tab-blacklisted"
                      role="tabpanel"
                    >
                      <div className="row row--grid mt-20">
                        {blackListedNFTs &&
                          blackListedNFTs.map((card, index) => (
                            <div
                              className="col-6 col-md-4 col-lg-3 mb-md-3 mb-2 items_nft_box"
                              key={`card-collection-${index}`}
                            >
                              <PutOffSale
                                handlePutOffSale={putOffSale}
                                key={card?._id}
                                data={card}
                                id={card.id}
                              />
                            </div>
                          ))}
                      </div>
                      <div className="row row--grid">
                        <div className="col-12"></div>
                      </div>
                    </div>

                    {accounts?.toLowerCase() === id?.toLowerCase() && (
                      <div
                        className={`tab-pane fade ${
                          localTab === "collection" || accounts?.toLowerCase() !== id?.toLowerCase()
                            ? "show active"
                            : ""
                        }`}
                        id="tab-collection1"
                        role="tabpanel"
                      >
                      {nftCollection && nftCollection?.length > 0 ? (
                          <>
                            <div className="row row--grid mt-20">
                              {nftCollection &&
                                nftCollection.map((card, index) => (
                                  <div
                                    className="col-6 col-md-4 col-xl-3 col-lg-4 mb-4 collectionitemfix"
                                    key={`card-collection-${index}`}
                                  >
                                    <CollectionCard
                                      data={card}
                                      id={card._id}
                                      showUpdates={showUpdates}
                                    />
                                  </div>
                                ))}
                            </div>
                          </>
                        )
                        : (
                            play === false && (
                              <div style={{ marginTop: "10px" }}>
                                <h3 style={{ color: "white" }}>
                                  No records found...
                                </h3>
                              </div>
                            )
                          )}
                        <div className="row row--grid">
                          <div className="col-12">
                            {nftCollection &&
                              nftCollection.length > 0 &&
                              totalCollectionPages > currentCollectionPage && (
                                <button
                                  className="main__load"
                                  type="button"
                                  onClick={handleShowMoreCollection}
                                  variant="contained"
                                >
                                  Load more
                                </button>
                              )}
                          </div>
                        </div>
                      </div>
                    )}
                   

                    <div className="tab-pane fade" id="tab-3" role="tabpanel">
                      <div className="row">
                        {/* sidebar */}
                        <div className="col-12 col-xl-4 order-xl-2">
                          <div className="filter-wrap">
                            <button
                              className="filter-wrap__btn"
                              type="button"
                              data-toggle="collapse"
                              data-target="#collapseFilter"
                              aria-expanded="false"
                              aria-controls="collapseFilter"
                            >
                              Open filter
                            </button>

                            <div
                              className="collapse filter-wrap__content"
                              id="collapseFilter"
                            >
                              {/* filter */}
                              <Filter />
                              {/* end filter */}
                            </div>
                          </div>
                        </div>
                        {/* end sidebar */}
                      </div>
                    </div>

                    <div
                      className={`tab-pane fade ${
                        localTab === "profile" ? "show active" : ""
                      }`}
                      id="tab-setting"
                      role="tabpanel"
                    >
                      {accounts?.toLowerCase() === id?.toLowerCase() && (
                        <div className="row row--grid profile_form_new">
                          {/* details form */}
                          <div className="col-12">
                            <form
                              action="#"
                              className="sign__form sign__form--profile"
                            >
                              <div className="row" style={{ width: "100%" }}>
                                <div className="col-md-4 col-6">
                                  <label
                                    className="sign__label mb-2"
                                    htmlFor=""
                                  >
                                    Profile Banner
                                  </label>
                                  <div className="sign__cover">
                                    <img
                                      src={
                                        imageCover
                                          ? imageCover
                                          : "/assets/img/bg/bg.png"
                                      }
                                      alt=""
                                      onClick={openFileHandler}
                                    />
                                    <input
                                      type="file"
                                      id="imgCover"
                                      accept="image/*"
                                      onChange={updateCover}
                                      hidden
                                    />
                                  </div>
                                </div>

                                <div className="col-md-4 col-6">
                                  <label
                                    className="sign__label mb-2"
                                    htmlFor=""
                                  >
                                    Profile Image
                                  </label>

                                  <div className="sign__avatar">
                                    <img
                                      src={
                                        avatar ||
                                        "assets/img/avatars/avatar.jpg"
                                      }
                                      alt=""
                                      onClick={openAvtarHandle}
                                    />
                                    <input
                                      type="file"
                                      id="imgAvtar"
                                      accept="image/*"
                                      onChange={updateAvatar}
                                      hidden
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="row" style={{ width: "102%" }}>
                                <div className="col-12"></div>
                                <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                                  <div className="sign__group">
                                    {/* <label
                                      className="sign__label"
                                      htmlFor="firstname"
                                    >
                                      First name
                                      <span className="validation">*</span>
                                    </label> */}
                                    <input
                                      id="firstname"
                                      type="text"
                                      name="firstname"
                                      className="sign__input"
                                      placeholder="First name"
                                      value={firstName || ""}
                                      onChange={(e) => {
                                        setFirstName(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                                  <div className="sign__group">
                                    {/* <label
                                      className="sign__label"
                                      htmlFor="lastname"
                                    >
                                      Last name
                                    </label> */}
                                    <input
                                      id="lastname"
                                      type="text"
                                      name="lastname"
                                      className="sign__input"
                                      placeholder="Last name"
                                      value={lastName || ""}
                                      onChange={(e) => {
                                        setLastName(e.target.value);
                                      }}
                                    />
                                    {/* {errors.lastName && (
                                      <div className="error-className">
                                        {errors.lastname}
                                      </div>
                                    )} */}
                                  </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-4 col-xl-4">
                                  <div className="sign__group">
                                    {/* <label
                                      className="sign__label"
                                      htmlFor="nickName"
                                    >
                                      Nick name
                                      <span className="validation">*</span>
                                    </label> */}
                                    <input
                                      id="nickName"
                                      type="text"
                                      name="nickName"
                                      className="sign__input"
                                      placeholder="Nick name"
                                      value={nickName || ""}
                                      onChange={(e) => {
                                        setNickName(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-md-6 col-lg-12 col-xl-12">
                                  <div className="sign__group">
                                    {/* <label className="sign__label" htmlFor="bio">
                                      Bio
                                      <span className="validation">*</span>
                                    </label> */}
                                    <textarea
                                      id="bio"
                                      type="text"
                                      name="bio"
                                      className="sign__textarea"
                                      placeholder="Type your bio"
                                      value={bio || ""}
                                      onChange={(e) => {
                                        setBio(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-md-8 col-lg-8 col-xl-8">
                                  <div className="sign__group">
                                    <input
                                      id="email"
                                      type="email"
                                      name="email"
                                      className="sign__input"
                                      placeholder="Email"
                                      value={email || ""}
                                      onChange={(e) => {
                                        setEmail(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12">
                                  <h4 className="sign__title">Social Links</h4>
                                </div>

                                <div className="col-12 col-lg-4">
                                  <div className="sign__group social_icon_img">
                                    <img src={Twitter} alt="Twitter" />
                                    {/* <label
                                    className="sign__label"
                                    htmlFor="twitter"
                                  >
                                    Twitter
                                  </label> */}
                                    <input
                                      id="twitter"
                                      type="text"
                                      name="twitter"
                                      className="sign__input"
                                      placeholder="johndoe"
                                      value={twitter || ""}
                                      onChange={(e) => {
                                        setTwitter(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-lg-4">
                                  <div className="sign__group social_icon_img">
                                    <img src={Telegram} alt="Telegram" />

                                    <input
                                      id="telegram"
                                      type="text"
                                      name="telegram"
                                      className="sign__input"
                                      placeholder="johndoe"
                                      value={telegram || ""}
                                      onChange={(e) => {
                                        setTelegram(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 col-lg-4">
                                  <div className="sign__group social_icon_img">
                                    <img src={Instagram} alt="Instagram" />

                                    <input
                                      id="instagram"
                                      type="text"
                                      name="instagram"
                                      className="sign__input"
                                      placeholder="johndoe"
                                      value={instagram || ""}
                                      onChange={(e) => {
                                        setInstagram(e.target.value);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-12 sign__btn__group mt-3 row highlightHover">
                                  <div className="col-12 text-center">
                                    <button
                                      className="btn-glow btn-hover-shine btn_width_glow"
                                      type="button"
                                      disabled={isProcessing}
                                      onClick={saveProfile}
                                    >
                                      {isProcessing ? "Wait..." : "Save"}
                                    </button>
                                  </div>
                                  <div className="col-6">
                                    {isProcessing && "Please Open Your Wallet"}
                                  </div>

                                  {/* <button
                                  className="btn-glow-outline ml-3"
                                  type="button"
                                  onClick={resetProfile}
                                >
                                  Cancel
                                </button> */}
                                </div>
                              </div>
                            </form>
                          </div>
                          {/* end details form */}
                        </div>
                      )}
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
export default AuthorPage;

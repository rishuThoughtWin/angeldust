import React, { useEffect, useState } from "react";
import collectionAbi from "../../services/smart-contract/CollectionFactory";
import buyCollectionNFTabi from "../../services/smart-contract/ERC721";
import reserveAuctionAbi from "../../services/smart-contract/reserveAuction";
import FixedSaleMarketPlaceAbi from "../../services/smart-contract/FixedSaleMarketPlace";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { BrowserView, MobileView } from 'react-device-detect';
// import address from '../../services/contractAddresses/address'
import Web3 from "web3";
import Product from "components/Product";
import Loader from "components/Loader";
import { toast } from "react-toastify";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Filter from "./Filter";

import test from "assets/img/test.jpg";

import 'styles/explore.css'
import './styles.css'
import { useSelector } from 'react-redux'
import LoaderNew from '../../components/Loader-New';
import { deleteNft, getAllNFTSApi } from 'apis'
import axios from "axios";
import { RPC_URLS } from "../Header/connectors";
import { useDisconnect } from "hooks/useDisconnect";
import { deleteLazyMintNft } from "apis";
import { AWS_IMAGE_PATH, DEFAULT_TOKEN_URI } from "../../constants";


let timer = null;
let setTimeOutDetails = null;

export const Explore = () => {

  const mobileAccount = localStorage.getItem("mobileAccount");
  const isActive = localStorage.getItem("isActive");
  const { testvalue } = useParams();
  const location = useLocation();
  const fromDashboard = location.state?.fromDashboard;
  const admin = useSelector((state) => state);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("owner"));
  const [getMoreNFT, setGetMoreNFT] = useState(false);
  const [price, setPrice] = useState(100);
  const [cards, setCards] = useState([]);
  const [mobileCards, setMobileCards] = useState()
  const [searchText, setSearchText] = useState("");
  const [play, setPlay] = useState(true);
  const [status, setStatus] = useState(true)
  const [chain, setChain] = useState(true)
  const [categories, setCategories] = useState(true)
  const [payment, setPayment] = useState(true)
  const [pageNFT, setPageNFT] = useState(0)
  const [order, setOrder] = useState('new')
  const [saleType, setSaleType] = useState('')
  const [category, setCategory] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [pageMy, setPageMy] = useState(0)
  const [onSaleNFT, setOnSaleNFT] = useState(true)
  const [selectedProducts, setSelectedProducts] = useState([])
  const [deleteNFTListId, setDeleteNFTListId] = useState([])
  const [deleteNFTListIdAction, setDeleteNFTListIdAction] = useState([])
  const [nftId, setNftId] = useState([])
  const [nftIdAction, setNftIdAction] = useState([])
  const [deleteNFTListAddress, setDeleteNFTListAddress] = useState([])
  const [
    deleteNFTListAddressAuction,
    setDeleteNFTListAddressAuction,
  ] = useState([])
  const [
    lazyMintNFTID,
    setLazyMintNFTID,
  ] = useState([])
  const [deleteEnable, seDeleteEnable] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [deleteCheckBox, setDeleteCheckBox] = useState(false)
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const limitPerPage = 40;
  const [pageNo, setPageNo] = useState(1);
  const [creatorlength, setCreatorlength] = useState();
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);

  const params = useParams();
  const tokenId = useSelector(state => state?.tokenData?.token);
  const { disconnectWalletConnect } = useDisconnect();
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);

  useEffect(() => {
    if (params.Data === undefined) {
      setCategory("");
    } else {
      setCategory(params.Data);
    }
  }, [params]);

  const [selectedNFTCollection, setSelectedNFTCollection] =
    useState("NFT collections");
  const [selectedNFTstatus, setSelectedNFTstatus] = useState("");
  const [selectedNFTprice, setSelectedNFTprice] = useState("Price ");
  const [selectedNFTchains, setSelectedNFTchains] = useState("Chains");
  const [responsiveData, setResponsiveData] = useState();

  const history = useHistory();

  const web3 = new Web3(Web3.givenProvider || window.ethereum);
  // const newContract = "0x196693Fc466ef3A50dA1309a56e4Bdbc913154c1"res
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
  const contract = new web3.eth.Contract(
    FixedSaleMarketPlaceAbi.abi,
    FixedSaleMarketPlace
  );


  useEffect(() => {

    return () => {
      if (history.action === "POP") {
        // Code here will run when back button fires. Note that it's after the `return` for useEffect's callback; code before the return will fire after the page mounts, code after when it is about to unmount.
      }
    }
  })


  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (pageNo > 1) {
      getNFTList(false, searchText);
    }
  }, [pageNo])

  useEffect(() => {
    setPageNo(1);
  }, [paymentType, selectedNFTstatus, category])

  const getNFTList = async (isNew = false, value) => {
    setGetMoreNFT(true)
    try {
      if (isNew) {
        setPageNo(1)
      }
      setPlay(true);
      const filter = [];

      if (paymentType !== "All") filter.push([`paymentType:${paymentType}`]);
      filter.push([`isSale:${true}`]);
      if (selectedNFTstatus !== "all")
        filter.push([`saleType:${selectedNFTstatus}`]);
      if (category !== "Allcategories") filter.push([`category:${category}`]);

      let sortBy = "-createdAt";
      if (order === "new") {
        sortBy = "-createdAt";
      }
      else if (order === "old") {
        sortBy = "createdAt";
      }
      else if (order === "most") {
        sortBy = "-likes"
      }
      else if (order === "least") {
        sortBy = "likes"
      }
      else {
        sortBy = "-createdAt"
      }
      const req = {
        page: isNew ? 1 : pageNo,
        limit: limitPerPage,
        status: selectedNFTstatus === 'all' ? '' : selectedNFTstatus,
        category: category === 'Allcategories' ? '' : category ? category : params.Data,
        payment: paymentType === 'All' ? '' : paymentType,
        search: value,
        sort: sortBy,
        isSale: true
      }
      const res = await getAllNFTSApi(req);
      const data = res?.data;
      const resList = res?.data?.data;
      setCreatorlength(data?.data?.length)

      let lists1 = [];
      let lists2 = [];
      if (!resList?.length) {
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
            else if (doc?.image) {
              nft_data1 = { id: doc.id, ...doc }
              nft_data2 = { id: doc.id, ...doc }
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
          if (isNew) {
            setCards([...lists1]);
            setMobileCards([...lists2])
          } else {
            setCards([...cards, ...lists1]);
            setMobileCards([...cards, ...lists2]);
          }
        });
      }
      else {
        setCards([]);
        setMobileCards([])
      }
      setGetMoreNFT(false)
      setIsLoading(false);
      setTotalPages(data.totalPages);
      setCurrentPage(Number(data.currentPage))
      setPageNFT(isNew ? 1 : pageNFT + 1)
      setPlay(false)
    } catch (err) {
      setGetMoreNFT(false)
      setPlay(false)
      setIsLoading(false);
      console.log(err)
    }
  };



  const handleSearch = (value) => {
    clearTimeout(setTimeOutDetails)
    setSearchText(value);
    setTimeOutDetails = setTimeout(() => {
      setPageNo(1)
      getNFTList(true, value);
    }, 2000);

  };

  const handleHitSearch = () => {
    // setPageNo(1)
    // getNFTList(true);
  }

  const deleteNFTs = async () => {
    if (!tokenId) {
      return await disconnectWalletConnect();
    }
    try {
      if (isAdmin == "true" && accounts) {
        if (nftId.length > 0) {
          const deleteNFT = await deleteNft(tokenId, { ids: nftId });
          if (deleteNFT?.success) {
            window.$("#exampleModal").modal("hide");
            toast.success(`Selected NFTs have Removed`);
            seDeleteEnable(!deleteEnable);
            setDeleteNFTListId([]);
            setDeleteNFTListIdAction([]);
            let newCards = null
            for (let i = 0; i < nftId.length; i++) {
              newCards = cards.splice(cards.findIndex(({ id }) => id == nftId[i]), 1);
            }
            setNftId([])
          }
          else {
            toast.error(deleteNFT?.message)
            window.$("#exampleModal").modal("hide");
            setDeleteNFTListId([]);
          }
        }

        if (nftIdAction.length > 0) {
          const deleteNFT = await deleteNft(tokenId, { ids: nftIdAction });
          if (deleteNFT?.success) {
            window.$("#exampleModal").modal("hide");
            toast.success(`Selected NFTs have Removed`);
            seDeleteEnable(!deleteEnable);
            setDeleteNFTListId([]);
            setDeleteNFTListIdAction([]);
            let newCards = null
            for (let i = 0; i < nftIdAction.length; i++) {
              newCards = cards.splice(cards.findIndex(({ id }) => id == nftIdAction[i]), 1);
            }
            setNftIdAction([])
          }
          else {
            toast.error(deleteNFT?.message)
            window.$("#exampleModal").modal("hide");
            setDeleteNFTListId([]);
            setDeleteNFTListIdAction([]);
          }
        }

        if (lazyMintNFTID.length > 0) {
          const deleteNFT = await deleteLazyMintNft(tokenId, { nftIds: lazyMintNFTID });
          if (deleteNFT?.success) {
            window.$("#exampleModal").modal("hide");
            toast.success(`Selected NFTs have Removed`);
            seDeleteEnable(!deleteEnable);
            setDeleteNFTListId([]);
            setDeleteNFTListIdAction([]);
            let newCards = null
            for (let i = 0; i < lazyMintNFTID.length; i++) {
              newCards = cards.splice(cards.findIndex(({ id }) => id == lazyMintNFTID[i]), 1);
            }
            setLazyMintNFTID([])
          }
          else {
            toast.error(deleteNFT?.message)
            window.$("#exampleModal").modal("hide");
            setDeleteNFTListId([]);
            setDeleteNFTListIdAction([]);
          }
        }
      }

    } catch (err) {
      console.log(err);
      window.$("#exampleModal").modal("hide");
      setDeleteNFTListId([]);
      setDeleteNFTListIdAction([]);
    }
  };


  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await provider.enable();
      setAccount(provider.accounts[0]);
    }
    else {
      setAccount(account);
    }
    const admin = localStorage.getItem("owner");
    setIsAdmin(admin);
  }, [account]);

  useEffect(() => {
    getNFTList(true);
    setSearchText("");
  }, [
    category,
    order,
    price,
    paymentType,
    saleType,
    selectedNFTstatus,
  ]);

  const handleChangeFollow = () => {
    getNFTList(true)
  }

  const onDeleteNFTHandler = (tokenId, data, id, saleType) => {
    if (tokenId == 0) {
      if (lazyMintNFTID.some((e) => e == id)) {
        const newListId = lazyMintNFTID.filter((item) => item !== id);
        setLazyMintNFTID(newListId);
      }
      else {
        setLazyMintNFTID([...lazyMintNFTID, id]);
      }
    }
    if ((saleType == "fix" || saleType === "Fixed") && (tokenId != 0)) {
      if (deleteNFTListId.some((e) => e == tokenId)) {
        const newListId = deleteNFTListId.filter((item) => item !== tokenId);
        setDeleteNFTListId(newListId);
        const newListAdd = deleteNFTListAddressAuction.filter((address) => address !== data);
        setDeleteNFTListAddress(newListAdd);
        const newIdList = nftId.filter((txt) => txt !== id);
        setNftId(newIdList);
      } else {
        setDeleteNFTListId([...deleteNFTListId, tokenId]);
        setNftId([...nftId, id]);
        setDeleteNFTListAddress([...deleteNFTListAddress, data]);
      }
    } else if (saleType === "Auction") {

      if (deleteNFTListIdAction.some((e) => e == tokenId)) {
        const newListId = deleteNFTListIdAction.filter(
          (item) => item !== tokenId
        );
        setDeleteNFTListIdAction(newListId);

        const newListAdd = deleteNFTListAddressAuction.filter((address) => address !== data);
        setDeleteNFTListAddressAuction(newListAdd);
        const newIdList = nftIdAction.filter((txt) => txt !== id);
        setNftIdAction(newIdList);
      } else {
        setDeleteNFTListIdAction([...deleteNFTListIdAction, tokenId]);
        setNftIdAction([...nftIdAction, id]);
        setDeleteNFTListAddressAuction([...deleteNFTListAddressAuction, data]);
      }
    }
  };

  const handleActiveNFTCollection = (key) => {
    if (
      key === selectedNFTCollection ||
      key === paymentType ||
      key === selectedNFTstatus ||
      key === selectedNFTprice ||
      key === selectedNFTchains ||
      key === category ||
      key === saleType
    ) {
      return "active";
    } else {
      return;
    }
  };

  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 10);
    });
  }, []);


  const handleShowMoreImages = () => {
    setPageNo(pageNo + 1);
    // if (limit <= creatorlength) {
    //   setLimit(limit + 12);

    // }
  };

  const clearAll = () => {
    window.location.reload()
    setShowFilter(!showFilter)
  }

  return (
    isLoading ? <LoaderNew />
      :
      <main className="main contentCol">
        <div className="hero_common hero_detail">
          <div className="p-0 hero_border">
            <div className="container">
              <div className="row explorerPanel m-0">
                {/* Filter Sidebar */}
                {/* <div className="col-12 col-xl-2 col-lg-3 col-md-4 exploreFilter bleuFrosted">
             */}

                <div className="col-12 col-xl-12 col-lg-12 col-md-12">
                  {/* <Loader isLoading={play} /> */}

                  <div className="text-center market_head_top mt-3 mb-5">
                    {/* <div style={{position:'absolute',backdropFilter:'blur(5px)',zIndex:'9'}}> */}

                    {/* </div> */}
                    <h1>welcome to <br /> <span>  angel marketplace </span></h1>
                    <p>
                      Here you can search and buy creator's ASSETS with BNB & $BLEU
                    </p>
                  </div>
                  <div className="explorerHead marketexplore">
                    <div className="row">
                      <div className="col-xl-7 col-lg-8 col-md-8 col-12">
                        <div
                          className={
                            showFilter == false
                              ? "col-12 col-xl-12 col-lg-12 col-md-12 exploreFilter bleuFrosted"
                              : scroll
                                ? "col-12 col-xl-12 col-lg-12 col-md-12 exploreFilter bleuFrosted filtershow_explore filtershow_explore_top"
                                : "col-12 col-xl-12 col-lg-12 col-md-12 exploreFilter bleuFrosted filtershow_explore"
                          }
                        >
                          <div className="image-card exploreFilterSidenav">
                            <div className="image-caption">
                              <div className="select_detail_filter">
                                <div className="select_img_place d-md-inline-block">
                                  <select
                                    name="order"
                                    className="explore__select opened d-md-inline-block"
                                    onChange={(e)=>setSelectedNFTstatus(e.target.value)}
                                  >
                                    <option value="">Status</option>
                                    <option value="all">All</option>
                                    <option value="Fixed">Buy Now</option>
                                    <option value="Auction">On Auction</option>
                                  </select>
                                </div>

                                <div className="select_img_place d-md-inline-block ml-md-3">
                                  <select
                                    name="order"
                                    className="explore__select opened d-md-inline-block"
                                    onChange={(e)=>setCategory(e.target.value)}
                                  >
                                    <option value="">Categories</option>
                                    <option value="Allcategories">All</option>
                                    <option value="art">Art</option>
                                    <option value="music">Music</option>
                                    <option value="film">Film</option>
                                    <option value="sports">Sports</option>
                                    <option value="education">Education</option>
                                    <option value="photography">Photography</option>
                                    <option value="games">Games</option>
                                    <option value="Other">Others</option>
                                  </select>
                                </div>

                                <div className="select_img_place d-md-inline-block ml-md-3">
                                  <select
                                    name="order"
                                    className="explore__select opened d-md-inline-block"
                                    onChange={(e)=>setPaymentType(e.target.value)}
                                  >
                                    <option value="">Payment</option>
                                    <option value="All">All</option>
                                    <option value="BNB">BNB</option>
                                  </select>
                                </div>
                              </div>
                              {/* <div className="switch_shop d-md-none d-block mb-5">

                      <p
                        onClick={() => setShowFilter(!showFilter)}
                        className="d-md-none d-inline-block clear_para pl-3"
                      >
                        Done
                      </p>

                      <p
                        onClick={clearAll}
                        className="d-md-none d-inline-block clear_para">
                        Clear All
                      </p>
                    </div> */}
                              {/*
                    <div className={status ? "praktyka " : "praktyka"}>

                      <h4
                        onChange={(e) => {
                          setStatus(e.target.value);
                        }}
                      >
                        Status
                      </h4>
                      <div className="praktyka-content">
                        <ul className="p-0">

                          <li
                            onClick={() => {
                              setSelectedNFTstatus("all");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("all")
                            }
                          >
                            All
                          </li>
                          <li
                            onClick={() => {
                              setSelectedNFTstatus("Fixed");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("Fixed")
                            }
                          >
                            Buy Now
                          </li>
                          <li
                            onClick={() => {
                              setSelectedNFTstatus("Auction");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("Auction")
                            }
                          >
                            On Auction
                          </li>
                        </ul>
                      </div>
                    </div> */}

                              {/* <div className={categories ? "praktyka " : "praktyka"}>
                      {

                        <h4
                          onChange={(e) => {
                            setCategories(e.target.value);
                          }}
                        >
                          categories
                        </h4>
                      }
                      <div className="praktyka-content">
                        <ul className="p-0">

                          <li
                            onClick={() => {
                              setCategory("Allcategories");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("Allcategories")
                            }
                          >
                            All
                          </li>
                          <li
                            onClick={() => {
                              setCategory("art");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("art")
                            }
                          >
                            Art
                          </li>
                          <li
                            onClick={() => {
                              setCategory("music");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("music")
                            }
                          >
                            Music
                          </li>
                          <li
                            onClick={() => {
                              setCategory("film");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("film")
                            }
                          >
                            Film
                          </li>
                          <li
                            onClick={() => {
                              setCategory("sports");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("sports")
                            }
                          >
                            Sports
                          </li>
                          <li
                            onClick={() => {
                              setCategory("education");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("education")
                            }
                          >
                            Education
                          </li>
                          <li
                            onClick={() => {
                              setCategory("photography");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("photography")
                            }
                          >
                            Photography
                          </li>
                          <li
                            onClick={() => {
                              setCategory("games");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("games")
                            }
                          >
                            Games
                          </li>
                          <li
                            onClick={() => {
                              setCategory("Other");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("Other")
                            }
                          >
                            Other
                          </li>
                        </ul>
                      </div>
                    </div> */}

                              {/* <div className={payment ? "praktyka " : "praktyka"}>
                      <h4
                        onChange={(e) => {
                          setPayment(e.target.value);
                        }}
                      >
                        Payment
                      </h4>
                      <div className="praktyka-content">
                        <ul className="p-0">
                          <li
                            onClick={() => {
                              setPaymentType("All");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("All")
                            }
                          >
                            All
                          </li>
                          <li
                            onClick={() => {
                              setPaymentType("BNB");
                            }}
                            className={
                              "praktyka-content-item " +
                              handleActiveNFTCollection("BNB")
                            }
                          >
                            BNB
                          </li>

                        </ul>
                      </div>
                    </div> */}
                            </div>
                          </div>
                        </div>

                        {/* <p className="d-inline-block result_total market_result">
                        {cards.length} RESULTS
                      </p> */}

                        {/* <div className="d-md-none d-inline-block width_mob_div">
                        <Filter
                          onChange={(e) => handleSearch(e)}
                          onSort={(e) => console.log(e)}
                          onFormSubmit={handleHitSearch}
                          searchText={searchText}
                        />
                      </div> */}
                      </div>

                      <div className="col-xl-5 col-lg-4 col-md-4 col-12 text-right market_sort_filter pl-md-0 pl-lg-3 pl-2">
                        {/* <div className="d-md-inline-block d-none width_mob_div">
                        <Filter
                          onChange={(e) => handleSearch(e)}
                          onSort={(e) => console.log(e)}
                          onFormSubmit={handleHitSearch}
                          searchText={searchText}
                        />
                      </div> */}
                        <h4 className="d-inline-block mr-2">Sort by</h4>
                        <div className="select_img_place d-inline-block mr-md-0 mr-sm-0 mb-md-0 mb-sm-0 mb-3">
                          <select
                            name="order"
                            className="explore__select opened d-inline-block"
                            value={order}
                            onChange={(e) => {
                              setOrder(e.target.value);
                            }}

                          >
                            <option value="new">Newest</option>
                            <option value="old">Oldest</option>
                            <option value="most">Most liked</option>
                            <option value="least">Least liked</option>
                          </select>
                        </div>

                        <div className="delete-marketdiv ml-md-3 mt-xl-0 mt-lg-0 mt-md-3 mt-sm-0 mt-0 ml-2">
                          {deleteNFTListId.length > 0 ||
                            deleteNFTListIdAction.length > 0 || lazyMintNFTID.length > 0 ? (
                            <button
                              type="button"
                              className="btn delete-btn"
                              data-toggle="modal"
                              data-target="#exampleModal"
                            // onClick={()=>setConfirmModal(true)}
                            >
                              Confirm
                            </button>
                          ) : isAdmin == "true" && isActive == 'true' ? (
                            <button
                              type="button"
                              className="btn delete-btn"
                              data-toggle="modal"
                              data-target="#exampleModal1"
                              onClick={() => seDeleteEnable(!deleteEnable)}
                            >
                              Delete
                            </button>
                          ) : null}
                          <div
                            className="modal fade"
                            id="exampleModal"
                            tabindex="-1"
                            role="dialog"
                            aria-labelledby="exampleModalLabel"
                            aria-hidden="true"
                          >
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-body">
                                  <div className="">
                                    <div style={{ color: 'black' }}> Are you want to delete this</div>

                                  </div>
                                </div>
                                <div className="modal-footer text-center">
                                  <button
                                    type="button"
                                    className="btn btn-primary mr-3"
                                    onClick={deleteNFTs}
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-dismiss="modal"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Loader isLoading={play} />
                    <BrowserView className="row row--grid relative mt-5">
                      {cards && cards.length > 0 ?
                        <>
                          {cards?.map((card, index) => (
                            <div className="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3 bottom_space_product width_card_market" key={index} style={{
                              maxWidth: '228px'
                            }}>
                              <Product
                                key={card._id}
                                data={card}
                                image={test}
                                comment1="Pixel Birds Collection"
                                comment2="Pixel Pigeon #23456"
                                comment3="@ArtistPerson"
                                onDeleteNFTHandler={onDeleteNFTHandler}
                                deleteEnable={deleteEnable}
                                accounts={accounts}
                                handleChangeFollow={handleChangeFollow}
                              />
                            </div>
                          ))}
                        </>
                        :
                        <>{play === false &&
                          <h3 className="no_items">No Items Found...</h3>
                        }
                        </>
                      }
                    </BrowserView>
                    <MobileView className="row row--grid relative">
                      {mobileCards && mobileCards.length > 0 ?
                        <>
                          {mobileCards?.map((card, index) => (
                            <div className="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3 bottom_space_product width_card_market" key={index} style={{
                              maxWidth: '228px'
                            }}>
                              <Product
                                key={card._id}
                                data={card}
                                image={test}
                                comment1="Pixel Birds Collection"
                                comment2="Pixel Pigeon #23456"
                                comment3="@ArtistPerson"
                                onDeleteNFTHandler={onDeleteNFTHandler}
                                deleteEnable={deleteEnable}
                                accounts={accounts}
                                handleChangeFollow={handleChangeFollow}
                              />
                            </div>
                          ))}
                        </>
                        :
                        <>{play === false &&
                          <h3 className="no_items">No Items Found...</h3>
                        }
                        </>
                      }
                    </MobileView>

                    <div className="col-12">
                      {/* <Loader isLoading={play} /> */}
                      {cards && cards.length > 0 && totalPages > currentPage &&
                        <button
                          className="main__load roundedHeaderButton"
                          type="button"
                          onClick={handleShowMoreImages}
                          variant="contained"
                        >
                          {getMoreNFT ? 'Loading...' : 'Load more'}
                          {/* Load more */}
                        </button>
                      }
                    </div>
                  </div>
                </div>

                {/* <div className="filter_btn">
                <button
                  className="filter_load"
                  onClick={() => setShowFilter(!showFilter)}
                >
                  Filter
                </button>
              </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>
  );
};

export default Explore;

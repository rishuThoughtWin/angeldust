import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams, useHistory } from "react-router-dom";
import Web3 from "web3";
import { BrowserView, MobileView } from "react-device-detect";
import test from "assets/img/test.jpg";
import Loader from "components/Loader";
import LoaderNew from "components/Loader-New";
import { getCollectionStasticsApi } from "apis";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AWS_IMAGE_PATH, DefaultNetwork, DEFAULT_TOKEN_URI } from "../../constants";
import { getCollectionMetaData } from "apis";
import { getLaunchpadNft } from "apis";
import LaunchpadNftCard from "components/Product/LaunchpadNftCard";
import { useSelector } from "react-redux";
import { RPC_URLS } from "../../pages/Header/connectors";
import { createSignatureAndNonce } from "apis";
import collectionAbiFile from "../../services/smart-contract/NFTCollection";
import approveAbiFile from "../../services/smart-contract/approveERC721";
import { toast } from "react-toastify";
import ReactSlider from "react-slider";
import { parseUnits } from "@ethersproject/units";
import { launchpad_Collection_Update } from "apis";
import { BaseModal } from "components/Modal";
import { LoaderIcon } from "components";
import { Get_Profile_By_AccountId } from "apis";
import axios from "axios";
import Range from "components/Range";

function LaunchpadCollectinDetail() {
  const { id, data: collectionAdd,type } = useParams();
  const tab = "items";
  const mobileAccount = localStorage.getItem("mobileAccount");
  const networkId = localStorage.getItem("networkId");
  const currency = localStorage.getItem("currency");
  const loginNetwork = useSelector((state) => state?.loginNetwork?.value);
  const loginActive = useSelector((state) => state?.loginNetwork?.isActive);
  const userActive = useSelector((state) => state?.activeUser?.value);
  const isActive = localStorage.getItem("isActive");
  const { account } = useWeb3React();
  const [pageNFT, setPageNFT] = useState(0);
  const [cards, setCards] = useState([]);
  const [mobileCards, setMobileCards] = useState();
  const [paymentType, setPaymentType] = useState("");
  const [category, setCategory] = useState("");
  const [order, setOrder] = useState();
  const [selectedNFTstatus, setSelectedNFTstatus] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [nftInformation, setnftInformation] = useState(null);
  const [nftInformationItem, setnftInformationItem] = useState(null);
  const [rangeVal, setRangeVal] = useState(1);
  const limitPerPage = 40;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [play, setPlay] = useState(true);
  const [accounts, setAccount] = useState(account);
  const [mintEnable, setMintEnable] = useState(false)
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const [showLoader, setShowLoader] = useState(false);
  const history = useHistory();
  const [provider, setProvider] = useState(null);
  const [nftCount, setNFTCount] = useState(0);
  // const web3 = new Web3(Web3.givenProvider || window.etherum);
  // const currentAccount = web3.eth.requestAccounts();

  useEffect(() => {
    getCollectiondetail();
  }, [userActive,loginActive]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (pageNo > 1) {
      getNFTList(true, '');
    }
  }, [pageNo]);

  const convertExponentialToDecimal = (exponentialNumber) => {
    const str = exponentialNumber.toString();
    if (str.indexOf("e") !== -1) {
      const exponent = parseInt(str.split("-")[1], 10);

      const result = exponentialNumber.toFixed(exponent);
      return result;
    } else {
      return exponentialNumber;
    }
  };

  const hasDecimal = (num) => {
    return !!(num % 1);
  };

  const getCollectiondetail = async () => {
    let currentAccount = null;
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });
      await providers.enable();
      currentAccount = providers.accounts[0];
    }
    else if (loginActive == "true" && accounts) currentAccount = accounts;
    else if (loginActive == "true") {
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    }
    const collectionRes = await getCollectionMetaData(id, currentAccount);
    const res = collectionRes?.data?.success?.data;
    if(res?.currency!=currency){
      return history.push('/')
    }
    setIsLoading(false);
    if (res) {
      setNFTCount(res?.nftMintCount)
      setnftInformation(res);
      setnftInformationItem(res);
      getNFTList(true,res?.owner)
    }
  };

  const getNFTList = async (isNew = false,value) => {
    setCards([])
    let currentAccount = null;
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });
      await providers.enable();
      currentAccount = providers.accounts[0];
    }
    else if (loginActive == "true" && accounts) currentAccount = accounts;
    else if (loginActive == "true") {
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    }
    try {
      const filter = [];
      setPlay(true);
      if (paymentType !== "All") filter.push([`paymentType:${paymentType}`]);
      if (selectedNFTstatus !== "all")
        filter.push([`saleType:${selectedNFTstatus}`]);
      if (category !== "Allcategories") filter.push([`category:${category}`]);

      let sortBy = "";
      if (order === "new") {
        sortBy = "createdAt";
      } else if (order === "old") {
        sortBy = "-createdAt";
      } else if (order === "most") {
        sortBy = "likes";
      } else if (order === "least") {
        sortBy = "-likes";
      } else {
        sortBy = "createdAt";
      }
      let req = null
      if((loginActive == "true" || mobileAccount=="true") && value?.toLocaleLowerCase()==currentAccount?.toLocaleLowerCase())
      req = {
        page: isNew ? 1 : pageNo,
        limit: limitPerPage,
        sortBy: sortBy,
        collectionId: id,
        owner: value,
        loginUserAddress:currentAccount,
      };
      else if(loginActive == "true" || mobileAccount=="true")
      req = {
        page: isNew ? 1 : pageNo,
        limit: limitPerPage,
        sortBy: sortBy,
        collectionId: id,
        loginUserAddress:currentAccount,
      };
      else
      req = {
        page: isNew ? 1 : pageNo,
        limit: limitPerPage,
        sortBy: sortBy,
        collectionId: id,
      };
      const res = await getLaunchpadNft(req);
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
          if (isNew) {
            setCards([...lists1]);
            setMobileCards([...lists2]);
          } else {
            setCards([...lists1]);
            setMobileCards([...lists2]);
          }
        });
      } else {
        setCards([]);
        setMobileCards([]);
      }
      setPageNFT(isNew ? 1 : pageNFT + 1);
      setTotalPages(res?.data?.success?.data?.totalPages);
      setPlay(false);
      setCurrentPage(Number(res?.data?.success?.data?.totalResults));
    } catch (err) {
      setPlay(false);
      console.log(err);
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
  };

  const accountEnable = async()=>{
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });

      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      if(loginActive=='true'){
        const web3 = new Web3(Web3.givenProvider || window.etherum);
        const getAccount = await web3.eth.requestAccounts()
        setAccount(getAccount[0]);
      }
    }
  }
  useEffect(() => {
    accountEnable()
  }, [account, loginActive]);

  const handleMint = async () => {
    setShowLoader(true)
    let currentAccount = null;
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });
      await providers.enable();
      currentAccount = providers.accounts[0]
    }
    if (loginActive == "true" && accounts) currentAccount = accounts;
    else if (loginActive == "true") {
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    }
    const userData = await Get_Profile_By_AccountId(currentAccount, "");
    const userExist = userData ? userData?.data : {};
    if (!userExist?.nickName) {
      setShowLoader(false)
      toast.error(`Please update your profile first.`);
      return;
    }
    setMintEnable(true)
    try {
      if (mobileAccount == "true") {
        const web3 = new Web3(provider);
        const collectionAbi = collectionAbiFile.abi;
        const collectionContract = nftInformation?.collectionAddress;
        const contractInstance = new web3.eth.Contract(
          collectionAbi,
          collectionContract
        );
        const req = {
          networkId : networkId,
          collectionId: nftInformation?._id
            ? nftInformation?._id
            : nftInformation?.id,
          collectionAddress: nftInformation?.collectionAddress,
        };
        const mintData = await createSignatureAndNonce(req,tokenIdBearer);
        let res = null;
        let amount = null;
        if (new Date(nftInformation?.endDate) > new Date())
            amount = nftInformation?.whitelistedFee*rangeVal;
          else amount = nftInformation?.mintCost*rangeVal;
        if (nftInformation?.currency == "BNB" || "ETH")
          res = await contractInstance.methods
            .mint(
              rangeVal,
              mintData?.data?.success?.data?.signData?.nonce,
              mintData?.data?.success?.data?.sign,
              mintData?.data?.success?.data?.signData?.isWhiteListed
            )
            .send({
              from: currentAccount,
              value: web3.utils.toWei(amount.toString(), 'ether')
            });
        else {
          const web3 = new Web3(Web3.givenProvider || window.etherum);
          const approveAbi = approveAbiFile.abi;
          const approveContract = nftInformation?.currencyAddress;
          const approveInstance = new web3.eth.Contract(
            approveAbi,
            approveContract
          );
          let amount = null;
          if (new Date(nftInformation?.endDate) > new Date())
            amount = nftInformation?.whitelistedFee*rangeVal;
          else amount = nftInformation?.mintCost*rangeVal;
          await approveInstance.methods.approve(
            nftInformation?.collectionAddress,
            parseUnits(amount.toFixed())
          );
          res = await contractInstance.methods
            .mint(
              rangeVal,
              mintData?.data?.success?.data?.signData?.nonce,
              mintData?.data?.success?.data?.sign,
              mintData?.data?.success?.data?.signData?.isWhiteListed
            )
            .send({ from: currentAccount });
        }
          setNFTCount(nftCount+rangeVal)
          setRangeVal(1)
          toast.success("Successfully Mint nft");
          setTimeout(()=>{
            setMintEnable(false)
            getCollectiondetail();
            setShowLoader(false)
            getNFTList(true,'')
          },4000)
      }
      else{
        const web3 = new Web3(Web3.givenProvider || window.etherum);
        const collectionAbi = collectionAbiFile.abi;
        const collectionContract = nftInformation?.collectionAddress;
        const contractInstance = new web3.eth.Contract(
          collectionAbi,
          collectionContract
        );
        const req = {
          networkId : networkId,
          collectionId: nftInformation?._id
            ? nftInformation?._id
            : nftInformation?.id,
          collectionAddress: nftInformation?.collectionAddress,
        };
        const mintData = await createSignatureAndNonce(req,tokenIdBearer);
        let res = null;
        let amount = null;
        if (new Date(nftInformation?.endDate) > new Date())
            amount = nftInformation?.whitelistedFee*rangeVal;
          else amount = nftInformation?.mintCost*rangeVal;
        if (nftInformation?.currency == "BNB" || "ETH")
          res = await contractInstance.methods
            .mint(
              rangeVal,
              mintData?.data?.success?.data?.signData?.nonce,
              mintData?.data?.success?.data?.sign,
              mintData?.data?.success?.data?.signData?.isWhiteListed
            )
            .send({
              from: currentAccount,
              value: web3.utils.toWei(amount.toString(), 'ether')
            });
        else {
          const web3 = new Web3(Web3.givenProvider || window.etherum);
          const approveAbi = approveAbiFile.abi;
          const approveContract = nftInformation?.currencyAddress;
          const approveInstance = new web3.eth.Contract(
            approveAbi,
            approveContract
          );
          let amount = null;
          if (new Date(nftInformation?.endDate) > new Date())
            amount = nftInformation?.whitelistedFee*rangeVal;
          else amount = nftInformation?.mintCost*rangeVal;
          await approveInstance.methods.approve(
            nftInformation?.collectionAddress,
            parseUnits(amount.toFixed())
          );
          res = await contractInstance.methods
            .mint(
              rangeVal,
              mintData?.data?.success?.data?.signData?.nonce,
              mintData?.data?.success?.data?.sign,
              mintData?.data?.success?.data?.signData?.isWhiteListed
            )
            .send({ from: currentAccount });
        }
          setNFTCount(nftCount+rangeVal)
          setRangeVal(1)
          toast.success("Successfully Mint nft");
          setTimeout(()=>{
            setMintEnable(false)
            getCollectiondetail();
            setShowLoader(false)
            getNFTList(true,'')
          },4000)
      }
    } catch (error) {
      setMintEnable(false)
      setShowLoader(false)
      console.log(error)
      if (error.code === 4001) {
        return toast.error("User denied transaction signature.");
      }
      toast.error("something went to wrong");
    }
  };

  const updateRanges = (val)=> {
    setRangeVal(val)
  } 

  return isLoading ? (
    <LoaderNew />
  ) : (
    <main className="main contentCol">
      <div className="hero_common hero_detail">
        <div className="hero_border collection_user_main mt-md-5">
          <div className="border_card">
            <div
              className="main__author1 authorImageWrapper"
              data-bg="assets/img/bg/bg.png"
            >
              <img
                src={nftInformationItem?.bannerImages}
                className="imageBanner"
                alt=""
              />
            </div>
          </div>

          <div className="container">
            <div className="collection_detail_box">
              <div className="row explorerPanel">
                <div className="col-12 col-xl-12 col-lg-12 col-md-12">
                  <div className="collection_user_box">
                    <img
                      className="sign__avatar"
                      src={nftInformation ? nftInformation.imageCover : ""}
                      alt=""
                    />
                  </div>
                  <div className="collection_user_detail">
                    {/* <h1>{nftInformation ? nftInformation.name : ""}</h1> */}
                    <h1>{nftInformation?.collectionName}</h1>
                    <p>
                      Created by :{" "}
                      <span>
                        {" "}
                        {nftInformation ? nftInformation.creator : ""}{" "}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="col-lg-6 offset-md-3 col-md-8 offset-md-2 col-12">
                  <div className="box_category_div mt-3 mb-3">
                    <div className="box_content border-right">
                      <h5>Mint Price</h5>
                      <p>
                        <span>
                          {" "}
                          {nftInformationItem?.endDate &&
                          new Date(nftInformationItem?.endDate) > new Date()
                            ? nftInformationItem?.whitelistedFee
                            : nftInformationItem?.mintCost}{" "}
                        </span>
                        {/* <img src={Arrow} /> */}
                      </p>
                    </div>

                    <div className="box_content border-right">
                      <h5>Status</h5>
                      <p>
                        {nftInformationItem?.endDate &&
                        new Date(nftInformationItem?.endDate) > new Date()
                          ? "WhiteSale"
                          : "Public Mint"}
                      </p>
                    </div>

                    <div className="box_content">
                      <h5>
                        {
                          nftInformation?.nftMintCount >=nftInformation?.maxSupply ? (nftInformation?.maxSupply /
                          nftInformationItem?.maxSupply *
                        100
                        ).toFixed(2) : (nftInformation?.nftMintCount /
                        nftInformationItem?.maxSupply *
                      100
                      ).toFixed(2) }{" "}
                        % Sold (
                        {nftInformation?.nftMintCount >=nftInformation?.maxSupply ? nftInformation?.maxSupply : nftInformation?.nftMintCount}/{nftInformationItem?.maxSupply}
                        )
                      </h5>
                      <p>
                        <ReactSlider
                        disabled
                        style={{marginBottom:'10px'}}
                          className="horizontal-slider"
                          // thumbClassName="example-thumb"
                          trackClassName="example-track"
                          value={nftInformation?.nftMintCount}
                          max={nftInformation?.maxSupply}
                          renderTrack={(props, state) => (
                          <div {...props}>{state.valueNow}</div>
                          )}
                        />
                        {/* progress bar */}
                      </p>
                    </div>
                  </div>
                  <p className="category_detail_para">
                    {nftInformation?.nftDescription}
                  </p>
                </div>
              </div>
            </div>

            <div className="row row--grid">
              <div className="col-12 col-xl-12">
                <div className="profile bleuFrosted mt-0">
                  <ul
                    className="nav nav-tabs profile__tabs"
                    id="profile__tabs"
                    role="tablist"
                  >
                    <li className="nav-item">
                      <a
                        className={`nav-link ${
                          tab === "items" || accounts !== id ? "active" : ""
                        }`}
                        data-toggle="tab"
                        href="#tab-collection"
                        role="tab"
                        aria-controls="tab-collection"
                        aria-selected={accounts !== id}
                        style={{ fontWeight: "bold" }}
                      >
                        {nftInformation?.owner?.toLocaleLowerCase()==accounts?.toLocaleLowerCase() ? 'All NFTs' : 'Minted NFTs'}
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="tab-content pt-5">
                  <div
                    className={`tab-pane fade ${
                      tab === "items" ? "show active" : ""
                    }`}
                    id="tab-collection"
                    role="tabpanel"
                  >
                    <div>
                      <BrowserView className="row row--grid relative">
                        {cards && cards.length > 0 ? (
                          <>
                            {cards?.map((card, index) => (
                              <div
                                className="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3 bottom_space_product width_card_market"
                                key={index}
                                style={{
                                  maxWidth: "233px",
                                }}
                              >
                                <LaunchpadNftCard
                                  key={card.id}
                                  data={card}
                                  image={test}
                                  currency={nftInformation?.currency}
                                  comment1="Pixel Birds Collection"
                                  comment2="Pixel Pigeon #23456"
                                  comment3="@ArtistPerson"
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {play === false && (
                              <h3 className="no_items">No Items Found...</h3>
                            )}
                          </>
                        )}
                      </BrowserView>
                      <MobileView className="row row--grid relative">
                        {mobileCards && mobileCards.length > 0 ? (
                          <>
                            {mobileCards?.map((card, index) => (
                              <div
                                className="col-6 col-sm-4 col-md-6 col-lg-4 col-xl-3 bottom_space_product width_card_market"
                                key={index}
                                style={{
                                  maxWidth: "233px",
                                }}
                              >
                                <LaunchpadNftCard
                                  key={card.id}
                                  data={card}
                                  image={test}
                                  currency={nftInformation?.currency}
                                  comment1="Pixel Birds Collection"
                                  comment2="Pixel Pigeon #23456"
                                  comment3="@ArtistPerson"
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <>
                            {play === false && (
                              <h3 className="no_items">No Items Found...</h3>
                            )}
                          </>
                        )}
                      </MobileView>
                    </div>
                    <div className="row row--grid">
                      <div className="col-12">
                        <Loader isLoading={play} />
                        {cards &&
                          cards?.length > 0 &&
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mintDivWrapper">
        <div className="mintDiv">

          { mintEnable ?
              <button disabled type="button" className="mintButton">
                Minting..
              </button>

              : (nftInformation?.maxSupply <= nftCount || (type == 'upcoming' || type == 'ended' ) || (new Date() < new Date(nftInformation?.endDate) && !nftInformation?.isWhiteListed))
                  ? ""
                  :
                  nftInformation?.approved  ? (
                      <div className="colum mintDivContent">
                        {nftInformation?.mintCountPerUser > nftInformation?.mintCountPerTransaction && (nftInformation?.mintCountPerTransaction=='1' || (nftInformation?.mintCountPerUser-nftInformation?.userMintCount==1) || (nftInformation?.maxSupply-nftInformation?.nftMintCount==1)) ? null : nftInformation?.mintCountPerUser=='1' ? null : <Range maxRange={(nftInformation?.maxSupply-nftInformation?.nftMintCount) < nftInformation?.mintCountPerTransaction ? (nftInformation?.maxSupply-nftInformation?.nftMintCount) < (nftInformation?.mintCountPerUser-nftInformation?.userMintCount) ? (nftInformation?.maxSupply-nftInformation?.nftMintCount) : (nftInformation?.mintCountPerUser-nftInformation?.userMintCount) : (nftInformation?.mintCountPerUser-nftInformation?.userMintCount) < nftInformation?.mintCountPerTransaction ? nftInformation?.mintCountPerUser-nftInformation?.userMintCount : nftInformation?.mintCountPerTransaction } range={rangeVal} updateRange={updateRanges}/>}

                        <button
                            disabled={(loginActive == "true" || mobileAccount=="true") && accounts ? false : true}
                            type="button"
                            className={`${
                                (loginActive == "true" || mobileAccount=="true") ? "mintButton" : "mintButtonDisable"
                            }`}
                            onClick={handleMint}
                        >
                          {(loginActive == "true" || mobileAccount=="true") && accounts
                              ? "Mint"
                              : `Sign in to ${loginNetwork == DefaultNetwork ? "Binance" : "Ethereum"}`}
                        </button>
                        {nftInformation?.mintCountPerUser > nftInformation?.mintCountPerTransaction ? (nftInformation?.mintCountPerTransaction=='1' || (nftInformation?.mintCountPerUser-nftInformation?.userMintCount==1) || (nftInformation?.maxSupply-nftInformation?.nftMintCount==1)) ? null : <span id="output">{rangeVal}</span>  : nftInformation?.mintCountPerUser=='1' ? null : <span id="output">{rangeVal}</span> }

                      </div>

                  ) : (
                      <button disabled type="button" className="mintButtonDisable">
                        {(loginActive == "true" || mobileAccount=="true") &&
                        accounts && nftInformation?.approve
                            ? "Mint"
                            : (loginActive == "true" || mobileAccount=="true") && accounts
                                ? "Collection not approve"
                                : `Sign in to ${loginNetwork == DefaultNetwork ? "Binance" : "Ethereum"}`}
                      </button>
                  )}
        </div>
      </div>

        <BaseModal className="baseModal" show={showLoader}>
          <div className="loader_container">
            <h2>Please Wait...</h2>
            <LoaderIcon />
          </div>
        </BaseModal>
    </main>
  );
}
export default LaunchpadCollectinDetail;

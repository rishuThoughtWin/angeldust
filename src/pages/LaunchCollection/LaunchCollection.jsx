import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { CreationSteps } from "components";
import { Container, Button } from "components";
import { CollectionMeta } from "../CollectionMeta";
import { useDispatch, useSelector } from "react-redux";
import WalletConnectProvider from "@walletconnect/web3-provider";
import "./launchCollection.css";
import { useState, useEffect } from "react";
import { setUserAgent } from "react-device-detect";
import { UploadImages } from "pages/UploadImages";
import { DeployToChain } from "pages/ChainConnection";
import { Success } from "pages/Success";
import { getCollectionMetaData } from "apis";
import { launchpad_Collection_Delete } from "apis";
import { DefaultNetwork } from "../../constants";
import { RPC_URLS } from "../../pages/Header/connectors";

export const LaunchCollection = () => {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isAdmin = localStorage.getItem("owner");
  const isActive = localStorage.getItem("isActive");
  const loginActive = useSelector((state) => state?.loginNetwork?.isActive);
  const networkId = localStorage.getItem("networkId");
  const [collectionID, setCollectionID] = useState(
    localStorage.getItem("collectionID")
  );
  const [isCollectionID, setIsCollectionId] = useState(false);
  const [isAccount, setIsAccount] = useState(false);
  const [collectionInfo, setCollectionInfo] = useState({
    contractName: "TEST",
    collectionName: "",
    isWhiteListedUser: false,
    currency: networkId==DefaultNetwork ? "BNB" : 'ETH',
    WhiteListedUser: [],
    whitelistedFee: 0,
    startDate: "",
    endDate: "",
    bannerImages: "",
    imageCover: "",
    symbol: "",
    collectionJson: "",
    nftDescription: "",
    mintCost: "",
    royalties: "",
    tokenURI: null,
    maxSupply: 0,
    mintCountPerUser: 1,
    mintCountPerTransaction: 1
  });
  const [nftName, setNftName] = useState("NFT #");
  const [collectionName, setCollectionName] = useState("");
  const [uploadComp, setUploadComp] = useState(false);
  const [secondClass, setSecondClass] = useState("");
  const [thirdClass, setThirdClass] = useState("");
  const [fourthClass, setFourthClass] = useState("");
  const [chain, setChain] = useState(false);
  const [success, setSuccess] = useState(false);
  const { account } = useWeb3React();
  const dispatch = useDispatch();
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const [accounts, setAccount] = useState(account);
  const history = useHistory()

  useEffect(async () => {
    if(loginActive=='true'){
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      const getAccount = await web3.eth.requestAccounts()
      setAccount(getAccount[0]);
      if (
        (isAdmin == "true" ||
         loginActive == "true" ||
          mobileAccount == "true" ||
          tokenIdBearer) &&
          getAccount[0]
      ) {
        setIsAccount(true);
      } else {
        setIsAccount(false);
      }
    }
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId: networkId
      });

      //  Enable session (triggers QR Code modal)
      await providers.enable();
      setAccount(providers.accounts[0]);
      if (
        (isAdmin == "true" ||
         loginActive == "true" ||
          mobileAccount == "true" ||
          tokenIdBearer) &&
          providers.accounts[0]
      ) {
        setIsAccount(true);
      } else {
        setIsAccount(false);
      }
    } 
  }, [account, loginActive]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [tokenIdBearer, account, collectionID]);

  const handleChain = async () => {
    let currentAccount = null;
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    if (loginActive == "true" && accounts) currentAccount = accounts;
    else if (loginActive == "true") {
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    }
    setChain(true);
    const collectionId = await localStorage.getItem("collectionID");
    const collectionData = await getCollectionMetaData(collectionId, currentAccount);
    if (collectionData?.data?.success?.data) {
      setCollectionInfo(collectionData?.data?.success?.data);
    }
    setChain(true);
    setUploadComp(true);
    setThirdClass("active");
  };

  const handleSuccess = async() => {
    setSuccess(true);
    setFourthClass("active");
  };

  const handleUploadComponet = (value, nft, collection) => {
    // collectionMetaData()
    // setUploadComp(!uploadComp);
    // if (value == "active") {
    //   setSecondClass("active");
    // } else {
    //   setSecondClass("");
    // }
    // setNftName(nft);
    // setCollectionName(collection);
    handleChain()
  };

  const connectWallet = () => {
    dispatch({ type: "SET_LOGIN_MODAL", payload: { value: true } });
  };

  const removeCollectionID = async () => {
    const collectionDelete = await launchpad_Collection_Delete(collectionID,tokenIdBearer);
    if (collectionDelete?.data) {
      await localStorage.removeItem("collectionID");
      setCollectionID("");
    }
  };

  const collectionMetaData = async () => {
    let currentAccount = null;
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    if (loginActive == "true" && accounts) currentAccount = accounts;
    else if (loginActive == "true") {
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    }
    const id = await localStorage.getItem("collectionID");
    const collectionData = await getCollectionMetaData(id,currentAccount);
    if (collectionData?.data?.success?.data) {
      setCollectionInfo(collectionData?.data?.success?.data);
      if (collectionData?.data?.success?.data) {
        setChain(true);
        setUploadComp(true);
        // 63105573bcf3314cee0dc87b
        // setSecondClass("active");
        setThirdClass("active");
      } else setIsCollectionId(true);
    }
  };

  return (
    <div className="main mt-150">
      <div className=" container mt-5">
        <div className="launch_coll">
          <div className="row">
            <div className="col-md-3 col-12">
              <CreationSteps
                secondClass={secondClass}
                thirdClass={thirdClass}
                fourthClass={fourthClass}
                reachedStepType="step1"
              />
            </div>

            <div className="col-md-9 col-12">
              {success && chain && isAccount && uploadComp && loginActive=='true' ? (
                <Success />
              ) : chain && isAccount && uploadComp ? (
                <DeployToChain
                  collectionInfo={collectionInfo}
                  handleSuccess={handleSuccess}
                />
              ) 
              // : isAccount && uploadComp && loginActive ? (
              //   <UploadImages
              //     handleChain={handleChain}
              //     nftName={nftName}
              //     collectionName={collectionName}
              //     handleUploadComponet={handleUploadComponet}
              //   />
              // ) 
              : isAccount && isCollectionID && loginActive=='true' ? (
                <CollectionMeta
                  collectionInfo={collectionInfo}
                  handleUploadComponet={handleUploadComponet}
                />
              ) : isAccount && collectionID && loginActive=='true' ? (
                <div className="signIn_card card">
                  <div className="col-md-12 btn_images btn_images_collection">
                    <label className="mb-3">Resume where you left off?</label>
                    <div className="d-flex justify-content-end">
                      <Button onClick={() => removeCollectionID()}>
                        Start Fresh
                      </Button>
                      <Button
                        type="secondary"
                        onClick={() => collectionMetaData()}
                      >
                        Resume
                      </Button>
                    </div>
                  </div>
                </div>
              ) : isAccount && loginActive=='true' ? (
                <CollectionMeta
                  collectionInfo={collectionInfo}
                  handleUploadComponet={handleUploadComponet}
                />
              ) : (
                <div className="signIn_card card connect_btn_mask">
                  <div>
                    <label>Please Connect</label>
                    <Button type="primary" onClick={() => connectWallet()}>
                      Connect Wallet
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

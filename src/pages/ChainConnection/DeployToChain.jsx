import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CreationSteps, Button } from "components";
import { useSelector } from "react-redux";
import "./DeployToChain.css";
import Upload from "../../assets/img/folder.png";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import launchpadAbiFile from "../../services/smart-contract/NFTLaunchPad";
import { launchpad_Collection_Update, uploadJSONToPinata } from "apis";
import { BaseModal } from "components/Modal";
import { LoaderIcon } from "components";
import { toast } from "react-toastify";
import { parseUnits } from "@ethersproject/units";
import { DefaultNetwork } from "../../constants";
import { RPC_URLS } from "../../pages/Header/connectors";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { UpdateCollectionWithNFTCreate } from "apis";


export const DeployToChain = ({handleSuccess, collectionInfo}) => {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const [showLoader, setShowLoader] = useState(false);
  const { account } = useWeb3React();
  const launchpadAbi = launchpadAbiFile.abi;
  const launchpadBnbContract = process.env.REACT_APP_LAUNCHPAD_BNB_ADDRESS
  const launchpadEthContract = process.env.REACT_APP_LAUNCHPAD_ETH_ADDRESS
  const networkId = localStorage.getItem("networkId");
  const networkName = localStorage.getItem("networkName");
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const [provider, setProvider] = useState(null);
  const [accounts, setAccounts] = useState(account);

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId: networkId
      });
      await providers.enable();
      setProvider(providers);
    } 
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const deployToChain = async()=>{
    setShowLoader(true)
    let currentAccount = null
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId: networkId
      });
      await providers.enable();
      currentAccount = providers.accounts[0]
    }
      else if(account) currentAccount=account
      else {  
        const web3 = new Web3(Web3.givenProvider || window.etherum);
        currentAccount = await web3.eth.requestAccounts();
        currentAccount = currentAccount[0]
      }
  
    try {
      const collectionId = await localStorage.getItem("collectionID");
      let contractInstance = null
      const jsonData = JSON.stringify({
        name: collectionInfo?.collectionName,
        creator: collectionInfo?.owner,
        royalties: collectionInfo?.royalties * 100,
        symbolNFT: collectionInfo?.symbol,
        maxSupply: collectionInfo?.maxSupply,
        image: collectionInfo?.imageCover,
        bannerImages: collectionInfo?.bannerImages
      });
      const contractJsonFile = new Blob([jsonData], { type: 'application/json' });
      const contractJsonFileRes = await uploadJSONToPinata(contractJsonFile);
      const contractURI = contractJsonFileRes?.data?.data?.url;
      if (mobileAccount == "true") {
        const web3 = new Web3(provider);
        if(networkId==DefaultNetwork) contractInstance = new web3.eth.Contract(launchpadAbi, launchpadBnbContract);
        else contractInstance = new web3.eth.Contract(launchpadAbi, launchpadEthContract);
        const arg1 = [collectionInfo?.maxSupply,parseUnits(collectionInfo?.whitelistedFee.toString()),parseUnits(collectionInfo?.mintCost.toString()),parseUnits(collectionInfo?.mintCountPerTransaction.toString()),(collectionInfo?.royalties)*100, new Date(collectionInfo?.startDate).getTime(),new Date(collectionInfo?.endDate).getTime()]
        const arg2 = [collectionInfo?.collectionName,collectionInfo?.symbol,collectionInfo?.tokenURI,contractURI]
        const res = await contractInstance.methods.createLaunchPad(arg1,arg2,collectionInfo?.isWhiteListedUser,collectionInfo?.currencyAddress).send({ from: currentAccount });
        if(res?.events?.CreateLaunchpad?.returnValues?.collection){
          const req = {
            "collectionId": collectionId,
            "collectionAddress": res?.events?.CreateLaunchpad?.returnValues?.collection,
            "status": "completed",
            "networkId":networkId,
            "networkName":networkName,
            "currency": networkId==DefaultNetwork ? "BNB" : 'ETH'
          }
          const result = await UpdateCollectionWithNFTCreate(req)
          if(result?.data?.success?.code==200){
            await localStorage.removeItem("collectionID")
            handleSuccess()
            setShowLoader(false)
          }
          else setShowLoader(false)
        }
        else setShowLoader(false)
      }else{
        const web3 = new Web3(Web3.givenProvider || window.etherum);
        if(networkId==DefaultNetwork) contractInstance = new web3.eth.Contract(launchpadAbi, launchpadBnbContract);
        else contractInstance = new web3.eth.Contract(launchpadAbi, launchpadEthContract);
        const arg1 = [collectionInfo?.maxSupply,parseUnits(collectionInfo?.whitelistedFee.toString()),parseUnits(collectionInfo?.mintCost.toString()),parseUnits(collectionInfo?.mintCountPerTransaction.toString()),(collectionInfo?.royalties)*100, new Date(collectionInfo?.startDate).getTime(),new Date(collectionInfo?.endDate).getTime()]
        const arg2 = [collectionInfo?.collectionName,collectionInfo?.symbol,collectionInfo?.tokenURI,contractURI]
        const res = await contractInstance.methods.createLaunchPad(arg1,arg2,collectionInfo?.isWhiteListedUser,collectionInfo?.currencyAddress).send({ from: currentAccount });
        if(res?.events?.CreateLaunchpad?.returnValues?.collection){
          const req = {
            "collectionId": collectionId,
            "collectionAddress": res?.events?.CreateLaunchpad?.returnValues?.collection,
            "status": "completed",
            "networkId":networkId,
            "networkName":networkName,
            "currency": networkId==DefaultNetwork ? "BNB" : 'ETH'
          }
          const result = await UpdateCollectionWithNFTCreate(req)
          if(result?.data?.success?.code==200){
            await localStorage.removeItem("collectionID")
            handleSuccess()
            setShowLoader(false)
          }
          else setShowLoader(false)
        }
        else setShowLoader(false)
      }
      

    } catch (error) {
      setShowLoader(false)
      toast.error("collection not deploy to blockchain")
      console.log(error)
    }

  }
  return (
    <div className="signIn_card card chain_Card">
        <div className="d-flex w-100">
          <img src={Upload} alt="Image" />
            <label>Uploaded !</label>
            <h5 className="text-center collect_chain">Deploy collection to chain</h5>
            <Button type="primary" onClick={()=>deployToChain()} >
                Deploy to chain
            </Button>
        </div>
        <BaseModal className="baseModal" show={showLoader}>
          <div className="loader_container">
            <h2>Please Wait...</h2>
            <LoaderIcon />
          </div>
        </BaseModal>
    </div>
  );
};

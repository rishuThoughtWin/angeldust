import { Container, Button } from "components";
import NFTDropzone from "components/Dropzone";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Alert from "../../assets/img/icons/alert.png";
import SmallAlert from "../../assets/img/icons/alert_small.png";
import Switch from "react-switch";
import Collection1 from "../../assets/img/collection.png";
import "./collectionMeta.css";
import { launchpad_Collection_Create } from "apis";
import { launchpad_Collection_Update } from "apis";
import { uploadFileToPinata } from "apis";
import { BaseModal } from "components/Modal";
import { LoaderIcon } from "components";
import { RPC_URLS } from "../Header/connectors";
import { parseUnits } from "@ethersproject/units";
import { Get_Profile_By_AccountId } from "apis";
import { updateWhitelistedUser } from "apis";
import ETH from "../../assets/img/icons/eth.png";
import BNB from "../../assets/img/icons/bnb.png";
import metaJSON from "../CreateCollection/metadata.json";
import { uploadMultiJsonData } from "apis";
import { uploadPinHash } from "apis";
import { uploadMultiJSON } from "apis";

// Allowed extensions for input file
const allowedExtensions = ["csv"];

export const CollectionMeta = (props) => {
  const json = JSON.stringify(metaJSON);
  const blob = new Blob([json], { type: "application/json" });
  const metadata = URL.createObjectURL(blob);
  const mobileAccount = localStorage.getItem("mobileAccount");
  const collectionID = localStorage.getItem("collectionID");
  const networkName = localStorage.getItem("networkName");
  const networkId = localStorage.getItem("networkId");
  const [collDetails, setCollDetails] = useState(props.collectionInfo);
  const [showLoader, setShowLoader] = useState(false);
  const [data, setData] = useState(
    props?.collectionInfo?.whiteListedUsersInArray
  );
  const [error, setError] = useState("");
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const [provider, setProvider] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [collectionImage, setCollectionImage] = useState(null);
  const [uploadJson, setUploadJson] = useState(null);
  const [colPreview, setColPreview] = useState({ preview: props?.image });
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const loginActive = useSelector((state) => state?.loginNetwork?.isActive);
  const [maxLength, setMaxLength] = useState(0)
  const [jsonFileText, setJsonFileText] = useState("Upload JSON_file")
  const [enableRange, setEnableRange] = useState(true)

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });
      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  const handleFileChange = (e) => {
    setError("");
    if (e.target.files.length) {
      const inputFile = e.target.files[0];

      const fileExtension = inputFile?.type.split("/")[1];
      if (!allowedExtensions.includes(fileExtension)) {
        setError("Please input a csv file");
        return;
      }
      handleParse(inputFile);
    }
  };

  const handleParse = (text) => {
    if (!text) return setError("Enter a valid file");
    const reader = new FileReader();
    reader.onload = async ({ target }) => {
      setData(target.result.split("\r\n"));
    };
    const str = reader.readAsText(text);
  };

  const handleMaxLength = (e) => {
    const fileReader = new FileReader();
    if (e?.target?.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        setMaxLength(JSON.parse(e.target.result).length);
      };
    }
    setEnableRange(false);
  };

  const handleChange = (e) => {
    if (e.target.name === "mintCountPerUser" || e.target.name === "mintCountPerTransaction") {
      let { value, min, max } = e.target;
      value = Math.max(Number(min), Math.min(Number(max), Number(value)));

      setCollDetails({ ...collDetails, [e.target.name]: value });
    }
    else{
      if (e.target.name === "royalties") {
        let mockValue = e.target.value;
        if (mockValue > 100) {
          return toast.error("Royalties can not be greater than 100");
        }
      }
      if (e.target.name === "mintCost") {
        let mockValue = e.target.value;
        if (mockValue > 100000) {
          return toast.error("MintCost can not be greater than 100000");
        }
      }
      setCollDetails({ ...collDetails, [e.target.name]: e.target.value });
    }
  };

  const handleChangeWhiteList = (e) => {
    setCollDetails({
      ...collDetails,
      isWhiteListedUser: !collDetails?.isWhiteListedUser,
    });
  };

  const handlerBanner = async (file) => {
    if (!file) {
      setCollDetails({ ...collDetails, bannerImages: null });
      return toast.error("Please select valid file.");
    }
    setBannerFile(file);
    setCollDetails({ ...collDetails, bannerImages: file });
  };
  const handlerImage = async (file) => {
    if (!file) {
      setCollDetails({ ...collDetails, imageCover: null });
      return toast.error("Please select valid file.");
    }
    setCollectionImage(file);
    setCollDetails({ ...collDetails, imageCover: file });
  };

  useEffect(() => {
    if (props?.collectionInfo) {
      setCollDetails(props?.collectionInfo);
    }
  }, []);

  const submitCollectionMeta = async () => {
    let currentAccount = null;
    if (mobileAccount === "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      currentAccount = provider.accounts[0]
    }else{
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      if (loginActive == "true" && accounts) currentAccount = accounts;
      else if (loginActive == "true") {
        currentAccount = await web3.eth.requestAccounts();
        currentAccount = currentAccount[0];
      }
    }
    
    const userData = await Get_Profile_By_AccountId(currentAccount, "");
    const userExist = userData ? userData?.data : {};
    if (!userExist?.nickName) {
      toast.error(`Please update your profile first.`);
      return;
    }

    setShowLoader(true);
    
    if (
      !collDetails?.bannerImages ||
      !collDetails?.imageCover ||
      !collDetails?.symbol ||
      !collDetails?.collectionName ||
      // !collDetails?.collectionJson ||
      !collDetails?.nftDescription ||
      !collDetails?.mintCost ||
      !collDetails?.royalties 
    ) {
      if (collDetails?.bannerImages === "") {
        setShowLoader(false);
        return toast.error("Banner images is required");
      }
      if (collDetails?.imageCover === "") {
        setShowLoader(false);
        return toast.error("Collection image is required");
      }
      if (collDetails?.collectionName === "") {
        setShowLoader(false);
        return toast.error("Collection name is required");
      }
      if(!uploadJson){
        setShowLoader(false);
        return toast.error("Collection Json File required");
      }
      if (collDetails?.symbol === "") {
        setShowLoader(false);
        return toast.error("symbol is required");
      }
      // if (collDetails?.collectionJson === "") {
      //   setShowLoader(false);
      //   return toast.error("Collection Json is required");
      // }
      if (collDetails?.nftDescription === "") {
        setShowLoader(false);
        return toast.error("NFT description is required");
      }
      if (collDetails?.mintCost <= 0) {
        setShowLoader(false);
        return toast.error("MintCost can not be 0 or less than 0");
      }
      const mintCostVal = (collDetails?.mintCost.toString())?.split(".")[1];
      if (mintCostVal?.length > 4) {
        setShowLoader(false);
        return toast.error("Please enter correct mint cost");
      }
      if (collDetails?.mintCost === "") {
        setShowLoader(false);
        return toast.error("Mint Cost is required");
      }
      if (collDetails?.royalties === "") {
        setShowLoader(false);
        return toast.error("Royalties is required");
      }
      if (collDetails?.royalties <= 0) {
        setShowLoader(false);
        return toast.error("Royalties can not be 0 or less than 0");
      }
      setShowLoader(false);
      return;
    }
    if(collDetails?.mintCountPerUser < collDetails?.mintCountPerTransaction){
      setShowLoader(false);
        return toast.error("mintCountPerUser can not less than mintCountPerTransaction");
    }
    if (collDetails?.isWhiteListedUser) {
      if (
        !collDetails?.whitelistedFee ||
        !collDetails?.startDate ||
        !collDetails?.endDate ||
        !data
      ) {
        if (data === undefined) {
          setShowLoader(false);
          toast.error("Whitelisted user's addresses required");
        }
        if (collDetails?.whitelistedFee === "") {
          setShowLoader(false);
          return toast.error("White listed Fee is required");
        }
        if (collDetails?.whitelistedFee <= 0) {
          setShowLoader(false);
          toast.error("White listed can not be 0 or less than 0");
        }
        if (collDetails?.startDate === "") {
          setShowLoader(false);
          return toast.error("Start Date is required");
        }
        if (collDetails?.endDate === "") {
          setShowLoader(false);
          return toast.error("End Date is required");
        }
        setShowLoader(false);
        return;
      }
    }
    try {
      let bannerImages = null;
      if (bannerFile) {
        const data1 = new FormData();
        data1.append("file", collDetails?.bannerImages);
        const res = await uploadFileToPinata(data1);
        bannerImages = res?.data?.data?.url;
      } else bannerImages = collDetails?.bannerImages;
      let imageRes = null;
      if (collectionImage) {
        const data2 = new FormData();
        data2.append("file", collDetails?.imageCover);
        const res = await uploadFileToPinata(data2);
        imageRes = res?.data?.data?.url;
      } else imageRes = collDetails?.imageCover;
      let baseURI = null;
      if(uploadJson){
        const data = new FormData();
        data.append("metadata", uploadJson);
        const multiJsonRes = await uploadMultiJSON(data);
        if(multiJsonRes)
        {
          const cid = multiJsonRes?.data?.success?.data?.IpfsHash;
          const metaRes = await uploadPinHash({ hashvar: cid });
          baseURI = metaRes?.data?.data;
        }
        
      } else baseURI = collDetails?.tokenURI;
      // const web3 = await new Web3(Web3.givenProvider || window.ethereum);
      // const account1 = await web3.eth.requestAccounts();
      if(!baseURI){
        setShowLoader(false);
        return toast.error("Collection Json File required");
      } 
      if (collectionID) {
        const req = {
          collectionId: collectionID,
          contractName: collDetails?.contractName,
          collectionName: collDetails?.collectionName,
          bannerImages: bannerImages,
          imageCover: imageRes,
          symbol: collDetails?.symbol,
          launchCollectionLater: false,
          isWhiteListedUser: collDetails?.isWhiteListedUser,
          WhiteListedUser: data ? data : [],
          whitelistedFee: collDetails?.whitelistedFee,
          currency: collDetails?.currency,
          currencyAddress:
            collDetails?.currency == "BNB" ||
            collDetails?.currency == "ETH" ||
            collDetails?.currency == "DOGE"
              ? "0x0000000000000000000000000000000000000000"
              : collDetails?.currency == "SAFEMOON"
              ? "0xaBb7A42DFfE225B64D0AeEa03216c55425d68513"
              : "0x40d8a586Ec9BC65C589935219B6Ac521fF9e2683",
          tokenURI: baseURI,
          maxSupply: maxLength ? maxLength : collDetails?.maxSupply,
          nftDescription: collDetails?.nftDescription,
          mintCost: parseFloat(collDetails?.mintCost),
          royalties: parseFloat(collDetails?.royalties),
          startDate: new Date(collDetails?.startDate)?.toISOString(),
          endDate: new Date(collDetails?.endDate)?.toISOString(),
          creator: currentAccount,
          owner: currentAccount,
          networkId: networkId,
          networkName: networkName,
          mintCountPerUser: collDetails?.mintCountPerUser,
          mintCountPerTransaction: collDetails?.mintCountPerTransaction
        };
        const request = {
          collectionId : collectionID,
          userAddresses : data ? data : []
        }
        await updateWhitelistedUser(request, tokenIdBearer)
        const collectionRes = await launchpad_Collection_Update(req);
        if (collectionRes?.data?.success) {
          props.handleUploadComponet(
            "active",
            collDetails?.collectionJson,
            collDetails?.collectionName
          );
          setShowLoader(false);
        } else setShowLoader(false);
      } else if (collDetails?.isWhiteListedUser === true) {
        const req = {
          contractName: collDetails?.contractName,
          collectionName: collDetails?.collectionName,
          bannerImages: bannerImages,
          imageCover: imageRes,
          symbol: collDetails?.symbol,
          launchCollectionLater: false,
          isWhiteListedUser: collDetails?.isWhiteListedUser,
          WhiteListedUser: data ? data : [],
          whitelistedFee: collDetails?.whitelistedFee,
          currency: collDetails?.currency,
          currencyAddress:
            collDetails?.currency == "BNB" ||
            collDetails?.currency == "ETH" ||
            collDetails?.currency == "DOGE"
              ? "0x0000000000000000000000000000000000000000"
              : collDetails?.currency == "SAFEMOON"
              ? "0x07865c6e87b9f70255377e024ace6630c1eaa37f"
              : "0xdacbdecc2992a63390d108e8507b98c7e2b5584a",
          // collectionJson: collDetails?.collectionJson,
          tokenURI: baseURI,
          maxSupply: maxLength ? maxLength : collDetails?.maxSupply,
          nftDescription: collDetails?.nftDescription,
          mintCost: parseFloat(collDetails?.mintCost),
          royalties: parseFloat(collDetails?.royalties),
          startDate: new Date(collDetails?.startDate)?.toISOString(),
          endDate: new Date(collDetails?.endDate)?.toISOString(),
          creator: currentAccount,
          owner: currentAccount,
          networkId: networkId,
          networkName: networkName,
          mintCountPerUser: collDetails?.mintCountPerUser,
          mintCountPerTransaction: collDetails?.mintCountPerTransaction
        };
        
        const collectionRes = await launchpad_Collection_Create(
          req,
          tokenIdBearer
        );
        if (collectionRes?.data?.success) {
          await localStorage.setItem(
            "collectionID",
            collectionRes?.data?.success?.data?.id
          );
          props.handleUploadComponet(
            "active",
            collDetails?.collectionJson,
            collDetails?.collectionName
          );
          setShowLoader(false);
        } else setShowLoader(false);
      } else {
        const req = {
          contractName: collDetails?.contractName,
          collectionName: collDetails?.collectionName,
          bannerImages: bannerImages,
          imageCover: imageRes,
          symbol: collDetails?.symbol,
          launchCollectionLater: false,
          isWhiteListedUser: collDetails?.isWhiteListedUser,
          WhiteListedUser: data ? data : [],
          whitelistedFee: collDetails?.whitelistedFee,
          currency: collDetails?.currency,
          currencyAddress:
            collDetails?.currency == "BNB" ||
            collDetails?.currency == "ETH" ||
            collDetails?.currency == "DOGE"
              ? "0x0000000000000000000000000000000000000000"
              : collDetails?.currency == "SAFEMOON"
              ? "0x07865c6e87b9f70255377e024ace6630c1eaa37f"
              : "0xdacbdecc2992a63390d108e8507b98c7e2b5584a",
          // collectionJson: collDetails?.collectionJson,
          tokenURI: baseURI,
          maxSupply: maxLength ? maxLength : collDetails?.maxSupply,
          nftDescription: collDetails?.nftDescription,
          mintCost: parseFloat(collDetails?.mintCost),
          royalties: parseFloat(collDetails?.royalties),
          startDate: null,
          endDate: null,
          creator: currentAccount,
          owner: currentAccount,
          networkId: networkId,
          networkName: networkName,
          mintCountPerUser: collDetails?.mintCountPerUser,
          mintCountPerTransaction: collDetails?.mintCountPerTransaction
        };
        const collectionRes = await launchpad_Collection_Create(
          req,
          tokenIdBearer
        );
        if (collectionRes?.data?.success) {
          await localStorage.setItem(
            "collectionID",
            collectionRes?.data?.success?.data?.id
          );
          props.handleUploadComponet(
            "active",
            collDetails?.collectionJson,
            collDetails?.collectionName
          );
          setShowLoader(false);
        } else {
          setShowLoader(false);
          toast.error("")
        }
      }
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };

  return (
    <div>
      <Container>
        <div className="coll-details mt-md-0 mt-5">
          <div className="image_uploader">
            <div className="row">
              <div className="col-md-6 col-12 mb-md-0 mb-4">
                <h4 className="text-heading">
                  Upload Collection Banner <span>*</span>
                </h4>
                <NFTDropzone
                  nftType="image"
                  image={collDetails?.bannerImages}
                  onChange={(file) => {
                    if (collDetails?.bannerImages) {
                      handlerBanner(collDetails?.bannerImages);
                    }
                    if (file) handlerBanner(file);
                  }}
                />
              </div>
              <div className="col-md-6 col-12">
                <h4 className="text-heading">
                  Upload Collection Image <span>*</span>
                </h4>
                <NFTDropzone
                  nftType="image"
                  image={collDetails?.imageCover}
                  onChange={(file) => handlerImage(file)}
                  setColPreview={setColPreview}
                />
              </div>
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-lg-4 col-md-12 col-sm-12 col-12">
              <h4 className="page_head1">
                {" "}
                Collection Details{" "}
                <img src={Alert} className="ml-3" alt="info" />{" "}
              </h4>

              <div className="input_div_collection mt-4">
                <div className="mb-3">
                  <label htmlFor="">
                    Collection Name{" "}
                    <img src={SmallAlert} className="ml-2" alt="info" />
                  </label>
                  <input
                    value={collDetails?.collectionName}
                    onChange={(e) => handleChange(e)}
                    name="collectionName"
                    className="sign__input"
                    placeholder="MyNFTs"
                    maxLength={20}
                  />
                </div>{" "}
                <div className="mb-3">
                  <label htmlFor="">
                    Symbol <img src={SmallAlert} className="ml-2" alt="info" />
                  </label>
                  <input
                    value={collDetails?.symbol}
                    onChange={(e) => handleChange(e)}
                    name="symbol"
                    className="sign__input"
                    placeholder="symbol"
                    maxLength={10}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="">
                    Mint Count Per User <img src={SmallAlert} className="ml-2" alt="info" />
                  </label>
                  <input
                    value={collDetails?.mintCountPerUser}
                    disabled={enableRange}
                    onChange={(e) => handleChange(e)}
                    name="mintCountPerUser"
                    className="sign__input"
                    placeholder="mintCountPerUser"
                    type='number'
                    min="1"
                    max={maxLength}
                  />
                </div>
                <div className="select_drop1">
                  <label htmlFor="">
                    Currency{" "}
                    <img src={SmallAlert} className="ml-2" alt="Image" />
                  </label>
                  {networkName == "Binance" ? (
                    <select
                      name="currency"
                      value={collDetails?.currency}
                      className="sign__input sign__select"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="BNB">BNB</option>
                      {/* <option value="USDC">USDC</option>
                      <option value="SAFEMOON">SAFEMOON</option> */}
                    </select>
                  ) : networkName == "Ethereum" ? (
                    <select
                      name="currency"
                      value={collDetails?.currency}
                      className="sign__input sign__select"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="ETH">ETH</option>
                      {/* <option value="USDC">USDC</option> */}
                    </select>
                  ) : (
                    <select
                      name="currency"
                      value={collDetails?.currency}
                      className="sign__input sign__select"
                      onChange={(e) => handleChange(e)}
                    >
                      <option value="DOGE">DOGE</option>
                    </select>
                  )}
                </div>
                <div className="sign__group mt-4 pb-3">
                  <label
                    className="sign__label switch_lab_space mr-4"
                    htmlFor=""
                  >
                    Add whitelist{" "}
                    <img src={SmallAlert} className="ml-2" alt="info" />
                  </label>
                  <Switch
                    onColor="#CDE438"
                    checked={collDetails?.isWhiteListedUser}
                    onChange={() => {
                      handleChangeWhiteList();
                      setData();
                    }}
                    checkedIcon
                    uncheckedIcon
                    name="isWhiteListedUser"
                    height={26}
                    className="createListSwitch"
                  />
                </div>
              </div>
            </div>

            <div className="section_border d-md-none d-block"></div>

            <div className="col-lg-8 col-md-12 col-sm-12 col-12">
              <div className="row">
                <div className="col-lg-6 col-md-12 col-sm-12 col-12">
                  <h4 className="page_head1">
                    NFT Details <img src={Alert} className="ml-3" alt="info" />
                  </h4>
                  <div className="input_div_collection mt-4">
                    <div className="margin_bottom_div1">
                      {/* <label htmlFor="">
                        Collection Json{" "}
                        <img src={SmallAlert} className="ml-2" alt="info" />
                      </label> */}
                      <label>
                        Upload JSON file{" "}
                        <span className="validation">*</span> (
                        <a
                          href={metadata}
                          target="_blank"
                          download="metadata.json"
                          className="samplefile_link"
                        >
                          {" "}
                           Sample File
                        </a>
                        )
                      </label>
                      {/* <input
                        value={collDetails?.collectionJson}
                        onChange={(e) => handleChange(e)}
                        name="collectionJson"
                        className="sign__input"
                        placeholder="collection json"
                        maxLength={20}
                      /> */}
                      <div className="label_input_file">
                        <label for="JSON">
                          {jsonFileText}
                          <input
                            required
                            title="please select file"
                            id="JSON"
                            className="sign__input"
                            accept=".json"
                            type="file"
                            style={{
                              textAlign: "center",
                              paddingTop: "7px",
                            }}
                            name="collectionJson"
                            onChange={(e) => {
                              setJsonFileText(e.target.files[0].name)
                              handleMaxLength(e)
                              setUploadJson(e.target.files[0]);
                            }}
                            placeholder="Upload JSON_file"
                          />
                        </label>
                      </div>
                    </div>{" "}
                    <div className="margin_bottom_div1">
                      <label htmlFor="">
                        Description{" "}
                        <img src={SmallAlert} className="ml-2" alt="info" />
                      </label>
                      <input
                        value={collDetails?.nftDescription}
                        onChange={(e) => handleChange(e)}
                        name="nftDescription"
                        className="sign__input"
                        placeholder="description"
                        maxLength={100}
                      />
                    </div>{" "}
                    <div className="mb-3">
                      <label htmlFor="">
                        Mint Count Per Transaction <img src={SmallAlert} className="ml-2" alt="info" />
                      </label>
                      <input
                        value={collDetails?.mintCountPerTransaction}
                        disabled={enableRange}
                        onChange={(e) => handleChange(e)}
                        name="mintCountPerTransaction"
                        className="sign__input"
                        type='number'
                        placeholder="mintCountPerTransaction"
                        min="1"
                        max={maxLength}
                      />
                    </div>
                    <div className="flex mb-3 mt-3" style={{ gap: "1rem" }}>
                      <div>
                        <label htmlFor="">
                          Mint Cost{" "}
                          <img src={SmallAlert} className="ml-2" alt="info" />
                        </label>
                        <input
                          value={collDetails?.mintCost}
                          onChange={(e) => handleChange(e)}
                          name="mintCost"
                          min="0"
                          className="sign__input"
                          placeholder="mint cost"
                          type="number"
                        />
                      </div>
                      <div className="royalties_input">
                        <label htmlFor="">
                          Royalties{" "}
                          <img src={SmallAlert} className="ml-2" alt="info" />
                        </label>
                        <input
                          value={collDetails?.royalties}
                          onChange={(e) => handleChange(e)}
                          name="royalties"
                          className="sign__input"
                          placeholder="2.5"
                          type="number"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    <>
                      <div className="flex mb-3" style={{ gap: "1rem" }}>
                        {collDetails?.isWhiteListedUser ? (
                          <div>
                            <label htmlFor="">
                              Whitelist Cost{" "}
                              <img
                                src={SmallAlert}
                                className="ml-2"
                                alt="info"
                              />
                            </label>
                            <input
                              className="sign__input"
                              placeholder="whitelisted Fee"
                              type="number"
                              value={collDetails?.whitelistedFee}
                              name="whitelistedFee"
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        ) : null}
                      </div>
                    </>
                  </div>
                </div>

                <div className="col-lg-6 col-md-6 col-sm-6 col-9 d-lg-inline-block">
                  <h4 className="page_head1">
                    Collection Preview{" "}
                    <img src={Alert} className="ml-3" alt="info" />
                  </h4>

                  <div className="card preview_card">
                    <div className="card_image">
                      <img
                        src={
                          colPreview.preview ? colPreview.preview : Collection1
                        }
                        className="card-img-top"
                        alt="..."
                      />
                    </div>
                    <div className="nft_Detail">
                        <p>{collDetails?.collectionName}</p>
                        <p>{collDetails?.nftDescription}</p>
                        {collDetails.mintCost &&(
                        <div className="nft_price">
                          <span className="nft_spam">
                            <span className="nft_span">
                            <img className="nft_image" src={collDetails?.currency=='BNB' ? BNB : ETH}/>
                            </span>
                          </span>
                            <strong style={{fontSize: "14px"}}>{collDetails.mintCost}</strong>
                        </div>
                        )}
                    </div>
                  </div>
                </div>
                {collDetails?.isWhiteListedUser ? (
                  <>
                    <div className="input_div_collection w-100 pl-md-3 pr-md-2 mt-md-0 mt-0 mob_box_input">
                      <label htmlFor="">
                        Date{" "}
                        <img src={SmallAlert} className="ml-2" alt="info" />
                      </label>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-12">
                          <div className="mb-3">
                            <input
                              className="sign__input"
                              min={new Date()?.toISOString()?.slice(0, -8)}
                              type="datetime-local"
                              name="startDate"
                              value={collDetails?.startDate || null}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>

                        <div className="col-md-6 col-sm-6 col-12 pr-lg-4">
                          <div>
                            <input
                              className="sign__input"
                              min={
                                collDetails?.startDate ||
                                new Date()?.toISOString()?.split(".")[0]
                              }
                              type="datetime-local"
                              name="endDate"
                              value={collDetails?.endDate || null}
                              onChange={(e) => handleChange(e)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="input_div_collection image_uploader mt-md-0 mt-2 w-100 pl-md-3 mob_box_input">
                      <label htmlFor="">
                        Upload CSV /CSE{" "}
                        <img src={SmallAlert} className="ml-2" alt="info" />
                      </label>
                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-12 mt-md-2 mt-2 mb-md-0 mb-3 pl-md-3 pr-md-3 pl-3 pr-3">
                          <textarea
                            className="sign__input input_h_100"
                            type="text"
                            value={data ? data : ""}
                            onChange={(e) => setData(e.target.value.split(","))}
                          />
                        </div>

                        <div className="col-md-6 col-sm-6 col-12 pr-lg-4 pl-md-2 pl-3 pr-3">
                          <div>
                            <input
                              onChange={handleFileChange}
                              id="csvInput"
                              name="file"
                              type="File"
                              accept={".csv"}
                              className="mt-md-5 mt-1 input_file_div"
                            />

                            <div style={{ marginTop: "3rem", color: "white" }}>
                              <div>{error}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-4 btn_images_collection">
          <div className="col-md-12 col-12 text-right">
            <Button onClick={() => submitCollectionMeta()}>Next</Button>
          </div>
        </div>
      </Container>
      <BaseModal className="baseModal" show={showLoader}>
        <div className="loader_container">
          <h2>Please Wait...</h2>
          <LoaderIcon />
        </div>
      </BaseModal>
    </div>
  );
};

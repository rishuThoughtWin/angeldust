import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { toast } from "react-toastify";
import ReactSlider from "react-slider";
import Web3 from "web3";
import NFTDropzone from "../../components/Dropzone";
import "styles/create.css";
import collectionAbi from "../../services/smart-contract/CollectionFactory";
import LoaderNew from "components/Loader-New";
import metaJSON from "./metadata.json";
import placeholder from "./placeholder.json";
import { RPC_URLS } from "../Header/connectors";
import {
  uploadPinHash,
  uploadMultiJsonData,
  uploadJSONToPinata,
  uploadFileToPinata,
  Get_Profile_By_AccountId,
} from "apis";

export function CreateCollection() {
  const json = JSON.stringify(metaJSON);
  const placeholderjson = JSON.stringify(placeholder);
  const blob = new Blob([json], { type: "application/json" });
  const placeholderblob = new Blob([placeholderjson], {
    type: "application/json",
  });
  const metadata = URL.createObjectURL(blob);
  const placeholdermetadata = URL.createObjectURL(placeholderblob);
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isActive = localStorage.getItem("isActive");
  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const newContract = process.env.REACT_APP_COLLECTION_FACTORY;
  const abiFile = collectionAbi.abi;
  const contractInstance = new web3.eth.Contract(abiFile, newContract);
  const [bannerPinata, setBannerPinata] = useState(null);
  const [collectionPinata, setCollectionPinata] = useState(null);
  const [placeholderPinata, setPlaceholderJson] = useState(null);
  const [uploadJsonPinata, setUploadJson] = useState(null);
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const [names, setName] = useState("");
  const [symbols, setSymbol] = useState("");
  const [name, setNames] = useState("");
  const [symbol, setSymbols] = useState("");
  const [royalties, setRoyalties] = useState(0);
  const [startRange, setStartRange] = useState(0);
  const [endRange, setEndRange] = useState(0);
  const [isCreateProcess, setCreateProcess] = useState(false);
  const [jsonFile, setJSONFile] = useState();
  const [uploadJsonFile, setUploadJsonFile] = useState("");
  const [uploadplaceholderJsonFile, setUploadplaceholderJsonFile] =
    useState("");
  const [maxlength, setMaxLength] = useState(0);
  const [RangeEnabled, setRangeEnabled] = useState(true);
  const [enableEnd, setEnableEnd] = useState(true);
  const JsonfileUpload = useRef(null);
  const JsonfileUploadPlaceholder = useRef(null);
  const history = useHistory();
  const [formData, setFormData] = useState({
    Name: { value: "", errorMessage: "" },
    Symbol: { value: "", errorMessage: "" },
    Uploadfile: { value: "", errorMessage: "" },
    UploadJsonfile: { value: "", errorMessage: "" },
    UploadPlaceholderJsonfile: { value: "", errorMessage: "" },
  });

  const headerfun = (e) => {
    switch (e.target.value) {
      case "createCollection":
        history.push("/createcollection");
        break;
      case "create":
        history.push("/create");
        break;
      default:
        history.push("/createcollection");
    }
  };

  const isNameValidation = (value) => {
    const validname = new RegExp(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
    return !validname.test(value);
  };
  const isSymbolValidation = (value) => {
    const validSymbol = new RegExp(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
    return !validSymbol.test(value);
  };
  const isUploadfileValidation = (value) => {
    return value.length === 0;
  };
  const isUploadJsonfileValidation = (value) => {
    return value.length === 0;
  };
  const isUploadPlaceholderJsonfileValidation = (value) => {
    return value.length === 0;
  };

  const HandleChange = (key, value) => {
    switch (key) {
      case "name":
        setNames({
          value: value,
          errorMessage: isNameValidation(value) ? "please use alphabet*" : "",
        });
        setName(value);
        return;
      case "Symbol":
        setSymbols({
          value: value,
          errorMessage: isSymbolValidation(value) ? "please use alphabet*" : "",
        });
        setSymbol(value);
        return;
      case "Uploadfile":
        setFormData({
          ...formData,
          Uploadfile: {
            value: value,
            errorMessage: isUploadfileValidation(value)
              ? "please fill Uploadfile*"
              : "",
          },
        });
        return;
      case "UploadJsonfile":
        setFormData({
          ...formData,
          UploadJsonfile: {
            value: value,
            errorMessage: isUploadJsonfileValidation(value)
              ? "please fill UploadJsonfile*"
              : "",
          },
        });
        return;
      case "UploadPlaceholderJsonfile":
        setFormData({
          ...formData,
          UploadPlaceholderJsonfile: {
            value: value,
            errorMessage: isUploadPlaceholderJsonfileValidation(value)
              ? "please fill UploadPlaceholderJsonfile*"
              : "",
          },
        });
        return;
      default:
        break;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const getFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      const binaryStr = reader.result;
    };
    reader.readAsArrayBuffer(file);
  };

  const getBannerFile = (file, isAttach = false) => {
    if (file) {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.readAsArrayBuffer(file);
    }
  };

  const createCollection = async (e) => {
    e.preventDefault();
    setCreateProcess(true);
    const nameNFT = name.value;
    const symbolNFT = symbol.value;
    if (!nameNFT || !jsonFile || !symbolNFT) {
      toast.error("Please fill the Collection information.");
      setCreateProcess(false);
      return;
    }
    if (!(isActive == "true" || mobileAccount == "true")) {
      setCreateProcess(false);
      return toast.error("Please connect your wallet first.");
    }
    try {
      if (!accounts) toast.error("Please connect your wallet first.");
      const userData = await Get_Profile_By_AccountId(accounts, "");
      const userExist = userData ? userData?.data : {};
      if (!userExist?.nickName) {
        setCreateProcess(false);
        toast.error("Please update your profile first.");
        return;
      }
      if (accounts) {
        const data1 = new FormData();
        if (bannerPinata) {
          const fileSize = bannerPinata.size / 1024 / 1024; // in MiB
          if (fileSize > 100) {
            setCreateProcess(false);
            return toast.error("Banner size not greater than 100 MB.");
          }
        }
        data1.append("file", bannerPinata);
        const bannerRes = await uploadFileToPinata(data1);
        const resBanner = bannerRes?.data?.data?.url;
        const data2 = new FormData();
        if (collectionPinata) {
          const fileSize = collectionPinata.size / 1024 / 1024; // in MiB
          if (fileSize > 100) {
            setCreateProcess(false);
            return toast.error("Image size not greater than 100 MB.");
          }
        }
        data2.append("file", collectionPinata);
        const collectionRes = await uploadFileToPinata(data2);
        const resCollectionImage = collectionRes?.data?.data?.url;
        const placeholderRes = await uploadJSONToPinata(placeholderPinata);
        const placeHolderURI = placeholderRes?.data?.data?.url;
        const data3 = new FormData();
        data3.append("metadata", uploadJsonPinata);
        const multiJsonRes = await uploadMultiJsonData(data3);
        const cid = multiJsonRes?.data?.data?.IpfsHash;
        const metaRes = await uploadPinHash({ hashvar: cid });
        const baseURI = metaRes?.data?.data;
        const jsonData = JSON.stringify({
          name: nameNFT,
          creator: accounts,
          royalties: royalties * 100,
          symbolNFT: symbolNFT,
          startRange: startRange,
          endRange: endRange,
          maxSupply: maxlength,
          image: resCollectionImage,
          bannerImages: resBanner,
        });
        const contractJsonFile = new Blob([jsonData], {
          type: "application/json",
        });
        const contractJsonFileRes = await uploadJSONToPinata(contractJsonFile);
        const contractURI = contractJsonFileRes?.data?.data?.url;
        if (contractURI && resBanner && resCollectionImage) {
          let contractResp;
          if (mobileAccount == "true") {
            const provider = new WalletConnectProvider({
              rpc: RPC_URLS,
            });
            await provider.enable();
            const web3 = new Web3(provider);
            const contractInstance = new web3.eth.Contract(
              abiFile,
              newContract
            );
            contractResp = await contractInstance.methods
              .createCollection(
                nameNFT,
                symbolNFT,
                baseURI,
                royalties * 100,
                startRange,
                endRange,
                maxlength,
                placeHolderURI,
                contractURI
              )
              .send({ from: accounts });
          } else {
            contractResp = await contractInstance.methods
              .createCollection(
                nameNFT,
                symbolNFT,
                baseURI,
                royalties * 100,
                startRange,
                endRange,
                maxlength,
                placeHolderURI,
                contractURI
              )
              .send({ from: accounts });
          }
          setCreateProcess(false);
          toast.success("Collection is successfully created!");
          setTimeout(() => {
            history.push(`/creator/${accounts}?tab=collection`);
          }, 5000);
        } else {
          toast.error("Uploading failed");
          setCreateProcess(false);
        }
      }
    } catch (err) {
      setCreateProcess(false);
      toast.error("Failed To Create Collection");
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setStartRange(0);
    setEndRange(0);
    const fileReader = new FileReader();
    if (e?.target?.files[0]) {
      setUploadJsonFile(e.target.files[0].name);
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (e) => {
        setJSONFile(e.target.result);
        setMaxLength(JSON.parse(e.target.result).length);
        setEnableEnd(false);
      };
      setRangeEnabled(false);
    }
  };

  const handlePlaceholderJson = (e) => {
    const fileReader = new FileReader();
    setUploadplaceholderJsonFile(e.target.files[0].name);
    fileReader.readAsText(e.target.files[0], "UTF-8");
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (mobileAccount === "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      setAccount(account);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  const fileHandlerBanner = (newfile) => {
    if (!newfile) {
      setBannerPinata(null);
      return toast.error("Please select valid file.");
    }
    setBannerPinata(newfile);
    getBannerFile(newfile);
  };

  const fileHandlerProfile = (newfile) => {
    if (!newfile) {
      setCollectionPinata(null);
      return toast.error("Please select valid file.");
    }
    setCollectionPinata(newfile);
    getFile(newfile);
  };
  return (
    <>
      {isCreateProcess && <LoaderNew />}
      <form onSubmit={createCollection} method="post">
        <main className="buyFlokin main">
          <div className="hero_common">
            <div className="hero_border">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-12">
                    <div className="create_nft_head mt-4 mb-4 pb-2">
                      <div className="row">
                        <div className="col-md-6 col-6">
                          <h1>create new NFT COllection</h1>
                        </div>

                        <div className="col-md-6 col-6 text-right">
                          <div className="create_drop_nft">
                            <select
                              className="header__nav-link form-select"
                              value="createCollection"
                              onChange={headerfun}
                            >
                              <option value="create">NFT Item</option>
                              <option value="createCollection" selected={true}>
                                NFT Collection
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-12 col-12 pr-md-2 createPart collection_nft_div">
                        <div className="row">
                          <div className="col-md-6 col-12">
                            <h2 className="createStepLabel">
                              Upload Collection Banner{" "}
                              <span className="validation">*</span>
                            </h2>
                            <div className="nftdropzone">
                              <NFTDropzone
                                nftType="image"
                                onChange={(newfile) =>
                                  fileHandlerBanner(newfile)
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <h2 className="createStepLabel">
                              Upload Collection Image{" "}
                              <span className="validation">*</span>
                            </h2>
                            <div className="nftdropzone">
                              <NFTDropzone
                                nftType="image"
                                onChange={(newfile) =>
                                  fileHandlerProfile(newfile)
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className='col-md-6 col-12'>
                            <div className="sign__group">
                              <label>
                                Upload JSsadON file{" "}
                                <span className="validation">*</span> (
                                <a
                                  href={metadata}
                                  target="_blank"
                                  download="metadata.json"
                                  className="samplefile_link"
                                >
                                  {" "}
                                  Download Sample File
                                </a>
                                )
                              </label>
                              <input
                                ref={JsonfileUpload}
                                required
                                title="please select file"
                                id="JSON"
                                className="sign__input "
                                accept=".json"
                                style={{
                                  textAlign: "center",
                                  paddingTop: "7px",
                                  // display: "none",
                                }}
                                type="file"
                                onChange={(e) => {
                                  handleChange(e);
                                  setUploadJson(e.target.files[0]);
                                }}
                                placeholder="Upload JSON_fileasddsds"
                              />
                              <input
                                id="JSON"
                                className="sign__input "
                                required
                                accept=".json"
                                type="text"
                                onClick={() => {
                                  JsonfileUpload?.current?.click();
                                }}
                                placeholder="Upload JSON file"
                                title="please select file"
                                value={uploadJsonFile}
                              />
                              <br />
                              <span className="validation">
                                {formData.UploadJsonfile.errorMessage}
                              </span>
                              <br />
                            </div>
                          </div>

                          <div className='col-md-6 col-12'>
                            <div className="sign__group">
                              <label>
                                JSON File with Placeholder Image
                                <span className="validation">*</span> (
                                <a
                                  href={placeholdermetadata}
                                  target="_blank"
                                  className="samplefile_link"
                                  download="placeholder.json"
                                >
                                  {" "}
                                  Download Sample File
                                </a>
                                )
                              </label>
                              <input
                                ref={JsonfileUploadPlaceholder}
                                id="JSON"
                                value={formData.UploadPlaceholderJsonfile.value}
                                required
                                onChange={(e) => {
                                  HandleChange(
                                    "UploadPlaceholderJsonfile",
                                    e.target.value
                                  );
                                  handlePlaceholderJson(e);
                                  setPlaceholderJson(e.target.files[0]);
                                }}
                                className="sign__input "
                                accept=".json"
                                style={{
                                  textAlign: "center",
                                  paddingTop: "7px",
                                  display: "none",
                                }}
                                type="file"
                                placeholder="Upload Placeholder JSON file"
                              />

                              <input
                                id="JSON"
                                required
                                className="sign__input "
                                accept=".json"
                                value={uploadplaceholderJsonFile}
                                type="text"
                                onClick={() => {
                                  JsonfileUploadPlaceholder?.current?.click();
                                }}
                                placeholder="JSON File with Placeholder Image (if unrevealed)"
                              />
                              <br />
                              <span className="validation">
                                {formData.UploadPlaceholderJsonfile.errorMessage}
                              </span>
                              <br />
                            </div>
                          </div>

                          <div className='col-md-6 col-12'>
                            <div className="sign__group">
                              <label>
                                Collection Name{" "}
                                <span className="validation">*</span>
                              </label>
                              <input
                                type="text"
                                required
                                pattern="[a-zA-Z-, ]{1,100}"
                                title="You can't use numeric value in name field"
                                className="sign__input "
                                placeholder="Collection Name"
                                value={names.value}
                                onChange={(e) => {
                                  HandleChange("name", e.target.value);
                                }}
                              />
                              <br />
                              <span className="validation">
                                {name.errorMessage}
                              </span>
                              <br />
                            </div>
                          </div>

                          <div className='col-md-6 col-12'>
                            <div className="sign__group">
                              <label>
                                Collection Symbol{" "}
                                <span className="validation">*</span>
                              </label>
                              <input
                                id="Symbol"
                                pattern="[a-zA-Z-, ]{1,10}"
                                title="You can't use numeric value in Symbol field"
                                type="text"
                                className="sign__input "
                                placeholder="Collection Symbol"
                                required
                                value={symbols.value}
                                onChange={(e) => {
                                  HandleChange("Symbol", e.target.value);
                                }}
                              />
                              <br />
                              <span className="validation">
                                {symbol.errorMessage}
                              </span>
                              <br />
                            </div>
                          </div>
                        </div>
                        <label className="sign__label createStepLabel mb-3 mt-2">
                          Hide NFTs
                        </label>

                        <div className="row">
                          <div className="col-md-6 col-12">
                            <label className="sign__label" htmlFor="royalties">
                              From
                            </label>
                            <div className="sign__group">
                              <input
                                className="royaltyBtn"
                                style={{ textAlign: "center" }}
                                value={startRange}
                                onChange={(e) => setStartRange(e.target.value)}
                                disabled={enableEnd}
                              />
                              <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="example-thumb"
                                trackClassName="example-track"
                                defaultValue={0}
                                disabled={RangeEnabled}
                                value={startRange}
                                onChange={(e) => {
                                  setStartRange(e);
                                }}
                                max={maxlength}
                                renderTrack={(props, state) => (
                                  <div {...props}>{state.valueNow}</div>
                                )}
                              />
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <label className="sign__label" htmlFor="royalties">
                              To
                            </label>
                            <div className="sign__group">
                              <input
                                className="royaltyBtn"
                                style={{ textAlign: "center" }}
                                value={
                                  startRange < endRange ? endRange : startRange
                                }
                                onChange={(e) => {
                                  if (e.target.value <= maxlength)
                                    setEndRange(e.target.value);
                                }}
                                disabled={enableEnd}
                              />
                              <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="example-thumb"
                                trackClassName="example-track"
                                disabled={RangeEnabled}
                                value={
                                  endRange > startRange ? endRange : startRange
                                }
                                onChange={(e) => {
                                  setEndRange(e);
                                }}
                                max={maxlength}
                                renderTrack={(props, state) => (
                                  <div {...props}>{state.valueNow}</div>
                                )}
                              />
                            </div>
                          </div>


                          <div className='col-md-6 col-12'>
                            <label className="sign__label mt-3" htmlFor="royalties">
                              Royalties
                            </label>
                            <div className="sign__group">
                              <button className="royaltyBtn" disabled>
                                {royalties}%
                              </button>
                              <ReactSlider
                                className="horizontal-slider"
                                thumbClassName="example-thumb"
                                trackClassName="example-track"
                                defaultValue={7}
                                value={royalties}
                                onChange={(e) => {
                                  setRoyalties(e);
                                }}
                                min={0}
                                max={20}
                                renderTrack={(props, state) => (
                                  <div {...props}>{state.valueNow}</div>
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12 pr-md-0 mb-100">
                        <button
                          type="submit"
                          className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0 createbtn"
                          onClick={createCollection}
                          disabled={isCreateProcess}
                        >
                          {isCreateProcess
                            ? "Creating..."
                            : "Create Collection"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </form>
    </>
  );
}

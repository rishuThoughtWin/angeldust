import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";

import {
  import_CollectionApi,
  uploadFileToPinata,
  getAllAdminCollectionsApi,
  getLaunchpadCollection,
} from "apis";
import { RPC_URLS } from "../Header/connectors";
import { useDisconnect } from "hooks/useDisconnect";
import LoaderNew from "components/Loader-New";
import NFTDropzone from "../../components/Dropzone";
import supportInterface from "../../services/smart-contract/supportInterface";
import factoryABI from "../../services/smart-contract/FACTORY_V2";
import { CardBox } from "../../components/Card/CardBox";
import Table from 'react-bootstrap/Table';
import "./styles.css";
import { TopCreator } from "pages/Creators/TopCreator";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

const IsTitle = "moderate" | "import" | "launchpad";

function Dashboard() {
  const history = useHistory();
  const dispatch = useDispatch();
  const context = useWeb3React();
  const { deactivate } = context;

  const mobileAccount = localStorage.getItem("mobileAccount");
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const { disconnectWalletConnect } = useDisconnect();
  const networkId = localStorage.getItem("networkId");
  const [bannerPinata, setBannerPinata] = useState(null);
  const [collectionPinata, setCollectionPinata] = useState(null);

  const [nftCollection, setNFTCollection] = useState([]);
  const [isImportCollection, setIsImportCollection] = useState(false);
  const [enableApprove, setEnableApprove] = useState(false);
  const [pageMy, setPageMy] = useState(0);
  const [play, setPlay] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [names, setName] = useState("");
  const [collectionAddress, setCollectionAddress] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [links, setLinks] = useState("");
  const [owner, setOwner] = useState("");
  const [isCreateProcess, setCreateProcess] = useState(false);
  const [provider, setProvider] = useState(null);
  const limitPerPage = 20;
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const [collectionId, setCollectionId] = useState(null);
  const [isUnique, setIsUnique] = useState("launchpad");
  const [launchpadNFT, setLaunchpadNTF] = useState([]);

  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const newContract = process.env.REACT_APP_COLLECTION_FACTORY;
  const abiFile = supportInterface.abi;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [isImportCollection]);

  useEffect(() => {
    if (!tokenIdBearer) {
      disconnectWallet();
    }
  }, [tokenIdBearer]);

  const disconnectWallet = async () => {
    const provider = new WalletConnectProvider({
      rpc: RPC_URLS,
      chainId : networkId
    });
    dispatch({ type: "SET_TOKEN", payload: {} });
    await provider.close();
    localStorage.setItem("mobileAccount", "false");
    deactivate();
    localStorage.setItem("owner", false);
    toast.error("Token expired, Please login again!");
    history.push("/");
    window.location.reload();
  };

  const getFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
    };

    reader.readAsArrayBuffer(file);
  };

  const getBannerFile = (file, isAttach = false) => {
    const reader = new FileReader();
    reader.onabort = () => console.log("file reading was aborted");
    reader.onerror = () => console.log("file reading has failed");
    reader.onload = () => {
      // Do whatever you want with the file contents
    };
    reader.readAsArrayBuffer(file);
  };

  const getMyAllCollection = async (isNew = false) => {
    if (!tokenIdBearer) {
      return await disconnectWalletConnect();
    }
    const res = await getAllAdminCollectionsApi(
      tokenIdBearer,
      isNew ? 1 : pageNo,
      limitPerPage
    );
    if (isNew) setPageNo(1);
    const data = res?.data?.data;
    setNFTCollection(isNew ? data : [...nftCollection, ...data]);

    setPlay(false);
    setTotalPages(res?.data?.totalPages);
    setCurrentPage(Number(res?.data?.currentPage));
    setPageMy(isNew ? 1 : pageMy + 1);
  };

  useEffect(() => {
    if (!tokenIdBearer) {
      return disconnectWalletConnect();
    }
  }, [tokenIdBearer]);

  useEffect(async () => {
    if (pageNo > 1) getMyAllCollection(false);
  }, [pageNo]);

  const handleShowMoreItemImages = () => {
    setPageNo(pageNo + 1);
  };

  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId : networkId
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setProvider(provider);
      setAccount(provider.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  useEffect(() => {
    getMyAllCollection(true);
    getLaunchCollection(true);
  }, []);

  const req = {
    page: 1,
    limit: 20,
    sortBy: {"name":"created_at", "order":-1},
    approved: false,
  };
  const getLaunchCollection = async (isNew = false) => {
    const res = await getLaunchpadCollection(req);
    const data = res?.data?.success?.data.results;
    setLaunchpadNTF(isNew ? data : [...launchpadNFT, ...data]);
    if (isNew) setPageNo(1);

    setPlay(false);
    setTotalPages(res?.data?.totalPages);
    setCurrentPage(Number(res?.data?.currentPage));
    setPageMy(isNew ? 1 : pageMy + 1);
  };

  const handleFunc = async (id) => {
    setCollectionId(id);
    setEnableApprove(!enableApprove);
  };

  const getTitleColor = (IsTitle) => {
    if (isUnique === IsTitle) return "#E9B008";
    return "";
  };

  var isAddress = function () {
    try {
      if (collectionAddress) {
        const supportInstance = new web3.eth.Contract(
          abiFile,
          collectionAddress
        );

        const isCorrect = supportInstance.methods
          .supportsInterface("0x80ac58cd")
          .call();
        return isCorrect;
      }
    } catch (error) {
      return false;
    }
    return false;
  };

  const approveHandler = async () => {
    const newList = nftCollection.filter(
      (itemsList) => itemsList.id !== collectionId
    );
    setNFTCollection(newList);
    setEnableApprove(false);
  };

  const setEmpty = () => {
    setCollectionAddress("");
    setCollectionName("");
    setOwner("");
    setLinks("");
    setCollectionDescription("");
    setBannerPinata(null);
    setCollectionPinata("");
  };

  const isNameValidation = (value) => {
    const validname = new RegExp(/^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-, ])*$/);
    return !validname.test(value);
  };

  const HandleChange = (key, value) => {
    switch (key) {
      case "name":
        setName({
          value: value,
          errorMessage: isNameValidation(value) ? "please use alphabet*" : "",
        });
        setCollectionName(value);
        return;
      default:
        break;
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let addresList = [];
      addresList.push(collectionAddress);
      const validAddress = isAddress();
      if (!collectionAddress) {
        return toast.error("Please enter collection address");
      } else if (collectionAddress == owner) {
        return toast.error("Collection address and owner address not same.");
      } else if (!validAddress) {
        return toast.error("Please enter valid collection address.");
      } else if (!collectionName) {
        return toast.error("Please enter collection name.");
      } else if (!bannerPinata) {
        return toast.error("Please select banner.");
      } else if (!collectionPinata) {
        return toast.error("Please select profile image.");
      } else if (!collectionDescription) {
        return toast.error("Please enter collection description.");
      } else if (!owner) {
        return toast.error("Please enter collection owner.");
      } else {
        setCreateProcess(true);
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

        const req = {
          name: collectionName,
          description: collectionDescription,
          collectionAddress: collectionAddress,
          owner: owner,
          links: links || "NA",
          creator: accounts ? accounts : account,
          imageCover: resCollectionImage,
          bannerImages: resBanner,
        };
        const factoryFile = factoryABI.abi;
        const factoryV2Address = process.env.REACT_APP_FACTORY_V2;
        const result = await import_CollectionApi(req, tokenIdBearer);
        setCreateProcess(false);
        if (result.status == 201) {
          toast.success("Collection imported.");
          setEmpty();
          setIsImportCollection(false);
          getMyAllCollection(true);
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const contractInstance = new web3.eth.Contract(
              factoryFile,
              factoryV2Address
            );
            await contractInstance.methods
              .addCollections(addresList)
              .send({ from: accounts });
          } else {
            const contractInstance = new web3.eth.Contract(
              factoryFile,
              factoryV2Address
            );
            await contractInstance.methods
              .addCollections(addresList)
              .send({ from: accounts });
          }
        } else {
          toast.error("This collection already imported");
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went to wrong");
    }
  };

  return (
    <>
      {isCreateProcess && <LoaderNew />}
      <main className="main contentCol">
        <div className="hero_common creator_hero_main">
          <div className="hero_border">
            <div className="p-0">
              <div className="row explorerPanel exploreMargin admin_margin_explore">
                {/* sidebar start from here */}
                <div className="col-xs-3 p-0 col-md-2">
                  <div className=" sidebar fixed_dashboardsidebar">
                    <h1 className="dashboard-head">Dashboard</h1>
                    <div className="btn_drp">
                      <ul>
                        {/* <li
                          style={{ color: `${getTitleColor("moderate")}` }}
                          className="header__nav-item moderate_btn m-0"
                          onClick={() => setIsUnique("moderate")}
                        >
                          Moderate Collections
                        </li>
                        <li
                          style={{ color: `${getTitleColor("import")}` }}
                          className="header__nav-item moderate_btn m-0"
                          onClick={() => setIsUnique("import")}
                        >
                          Import Collection
                        </li> */}
                        <li
                          style={{ color: `${getTitleColor("launchpad")}` }}
                          className="header__nav-item moderate_btn m-0"
                          onClick={() => setIsUnique("launchpad")}
                        >
                          Launchpad
                        </li>
                        <li
                          style={{ color: `${getTitleColor("creator")}` }}
                          className="header__nav-item moderate_btn m-0"
                          onClick={() => setIsUnique("creator")}
                        >
                          Creators
                        </li>
                        <li
                          style={{ color: `${getTitleColor("coolTime")}` }}
                          className="header__nav-item moderate_btn m-0"
                          onClick={() => setIsUnique("coolTime")}
                        >
                          Cool Time
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                {isUnique === "moderate" ? (
                  <CardBox
                    getAllCollection={getMyAllCollection}
                    collection={nftCollection}
                    handleFunc={handleFunc}
                    handleShowMoreItemImages={handleShowMoreItemImages}
                    play={play}
                    totalPages={totalPages}
                    currentPage={currentPage}
                  />
                ) : isUnique === "import" ? (
                  <div className="col-md-8 col-12">
                    <h1 className="main__title address_head mt-3">
                      Enter your contract address
                    </h1>
                    <p className="address_para ">
                      What is the address of your ERC721 contract on the mainnet
                      network?
                    </p>
                    <div className="address_form">
                      <form>
                        <div className="row">
                          <div className="col-md-6 col-12">
                            <h4>
                              Collection Address
                              <span className="validation">*</span>
                            </h4>
                            <input
                              className="__input form_control_same"
                              type={"text"}
                              placeholder="Collection Address"
                              value={collectionAddress}
                              onChange={(e) =>
                                setCollectionAddress(e.target.value)
                              }
                            />
                          </div>
                        </div>

                        <div className="row mt-md-4 mt-4 mb-0">
                          <div className="col-md-6 col-12">
                            <h4>
                              Upload Banner Image
                              <span className="validation">*</span>
                            </h4>
                            <div className="nftdropzone1">
                              <NFTDropzone
                                nftType="image"
                                onChange={(newFile) => {
                                  setBannerPinata(newFile);
                                  getBannerFile(newFile);
                                }}
                              />
                            </div>
                          </div>

                          <div className="col-md-6 col-12">
                            <h4>
                              Upload Profile Image
                              <span className="validation">*</span>
                            </h4>
                            <div className="nftdropzone1">
                              <NFTDropzone
                                nftType="image"
                                onChange={(newFile) => {
                                  setCollectionPinata(newFile);
                                  getFile(newFile);
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="row">
                          <div className="col-md-6 col-12 mb-md-5">
                            <h4>
                              Collection Name
                              <span className="validation">*</span>
                            </h4>

                            <input
                              pattern="[a-zA-Z-, ]{1,100}"
                              className="form_control_same"
                              type={"text"}
                              value={collectionName.value}
                              onChange={(e) =>
                                HandleChange("name", e.target.value)
                              }
                            />
                          </div>
                          <span className="validation1">
                            {names.errorMessage}
                          </span>
                          <div className="col-md-12 col-12 mt-md-0 mt-3 mb-md-5 mb-4">
                            <h4>
                              Description<span className="validation">*</span>
                            </h4>

                            <textarea
                              className="form_control_same textarea_height"
                              onChange={(e) =>
                                setCollectionDescription(e.target.value)
                              }
                              value={collectionDescription}
                            ></textarea>
                          </div>

                          <div className="col-md-6 col-12 mb-md-5 mb-4">
                            <h4>Links (Apply if Yes)</h4>

                            <input
                              className="form_control_same"
                              type={"text"}
                              value={links}
                              onChange={(e) => setLinks(e.target.value)}
                            />
                          </div>

                          <div className="col-md-6 col-12 mb-5">
                            <h4>
                              Owner<span className="validation">*</span>
                            </h4>
                            <input
                              className="form_control_same"
                              type={"text"}
                              value={owner}
                              onChange={(e) => setOwner(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-md-12 col-12 mb-md-5 p-0">
                          <button
                            className="btn_submit_address w-100 "
                            onClick={handleSubmit}
                          >
                            {" "}
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                ) : isUnique === "creator" ? (
                  // <div className="col-md-9 col-12 mt-20">
                  //   <div className="creator_table mt-20">
                  //     <div>
                  //       <Table responsive="sm">
                  //         <thead>
                  //           <tr>
                  //             <th>Name</th>
                  //             <th>Nick Name</th>
                  //             <th>Address</th>
                  //             <th>Actions</th>
                  //           </tr>
                  //         </thead>
                  //         <tbody>
                  //           <tr>
                  //             <td className="name_head">lorem ipsum</td>
                  //             <td className="name_head">lorem</td>
                  //             <td>xyz</td>
                  //             <td>
                  //               <div class="form-group">
                  //                 <input type="checkbox" id="html" />
                  //                 <label for="html"></label>
                  //               </div>
                  //             </td>
                  //           </tr>

                  //           <tr>
                  //             <td className="name_head">lorem ipsum</td>
                  //             <td className="name_head">lorem</td>
                  //             <td>xyz</td>
                  //             <td>
                  //               <div class="form-group">
                  //                 <input type="checkbox" id="html1" />
                  //                 <label for="html1"></label>
                  //               </div>
                  //             </td>
                  //           </tr>


                  //           <tr>
                  //             <td className="name_head">lorem ipsum</td>
                  //             <td className="name_head">lorem</td>
                  //             <td>xyz</td>
                  //             <td>
                  //               <div class="form-group">
                  //                 <input type="checkbox" id="html2" />
                  //                 <label for="html2"></label>
                  //               </div>
                  //             </td>
                  //           </tr>
                  //         </tbody>
                  //       </Table>
                  //     </div>
                  //   </div>

                  //   <div className="row">
                  //     <div class="col-md-12 text-right">
                  //       <button className="creator_submit btn">
                  //         Submit
                  //       </button>
                  //     </div>
                  //   </div>
                  // </div>
                  <TopCreator />

                )
                  : isUnique === "coolTime" ?
                    <div className="col-md-9 col-12 mt-20">
                      <div className="cool_time_tab">
                        <Tab.Container id="tabs-example" defaultActiveKey="create">
                          <Row>
                            <Col sm={12}>
                              <Nav variant="pills" className="flex-column mb-4">
                                <Nav.Item>
                                  <Nav.Link eventKey="create">create collection </Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                  <Nav.Link eventKey="mint">mint collection</Nav.Link>
                                </Nav.Item>
                              </Nav>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm={12}>
                              <Tab.Content>
                                <Tab.Pane eventKey="create">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-5 col-12">
                                      <div class="sign__group">
                                        <label>Select Time</label>
                                        <input id="firstname" type="time" class="sign__input" />
                                      </div>

                                      <button class="btn-glow btn-hover-shine btn_width_glow" type="button">Save</button>
                                    </div>
                                  </div>
                                </Tab.Pane>
                                <Tab.Pane eventKey="mint">
                                  <div className="row">
                                    <div className="col-md-4 col-sm-5 col-12">
                                      <div class="sign__group">
                                        <label>Select Time</label>
                                        <input id="firstname" type="time" class="sign__input" />
                                      </div>

                                      <button class="btn-glow btn-hover-shine btn_width_glow" type="button">Save</button>
                                    </div>
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>
                            </Col>
                          </Row>

                        </Tab.Container>
                      </div>
                    </div>
                    :
                    (
                      <CardBox
                        getAllCollection={getLaunchCollection}
                        collection={launchpadNFT}
                        handleFunc={handleFunc}
                        handleShowMoreItemImages={handleShowMoreItemImages}
                        play={play}
                        totalPages={totalPages}
                        currentPage={currentPage}
                      />
                    )}
              </div>
            </div>
            {enableApprove && (
              <div className="mfp-wrap">
                <div className="mfp-container">
                  <div
                    className="mfp-backdrop"
                    onClick={() => {
                      setEnableApprove(false);
                    }}
                  ></div>
                  <div className="zoom-anim-dialog mfp-preloader modal modal--form">
                    <button
                      className="modal__close"
                      onClick={() => {
                        setEnableApprove(false);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                      </svg>
                    </button>
                    <h4 className="sign__title">Approve</h4>
                    <div className="sign__group sign__group row">
                      <div className="col-md-6">
                        <button
                          className="confirmButton"
                          disabled={false}
                          onClick={approveHandler}
                        >
                          confirm
                        </button>
                      </div>
                      <div className="col-md-6">
                        <button
                          className="confirmButton"
                          disabled={false}
                          onClick={() => setEnableApprove(!enableApprove)}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;

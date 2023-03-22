import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useParams } from "react-router-dom";
import axios from "axios";
import Web3 from "web3";
import { BrowserView, MobileView } from "react-device-detect";
import test from "assets/img/test.jpg";
import Product from "components/Product";
import Loader from "components/Loader";
import LoaderNew from "components/Loader-New";
import {
  getAllNFTSApi,
  getCollectionByIdApi,
  getCollectionStasticsApi,
} from "apis";
import { AWS_IMAGE_PATH, DEFAULT_TOKEN_URI } from "../../constants";
import ETH from "../../assets/img/icons/ethereum.png";

let timer = null;
function CollectionDetail() {
  const { id, data: collectionAdd } = useParams();
  const tab = "items";
  const { account } = useWeb3React();
  const [pageNFT, setPageNFT] = useState(0);
  const [cards, setCards] = useState([]);
  const [mobileCards, setMobileCards] = useState();
  const [paymentType, setPaymentType] = useState("");
  const [payment, setPayment] = useState(true);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState();
  const [status, setStatus] = useState(true);
  const [order, setOrder] = useState();
  const [selectedNFTstatus, setSelectedNFTstatus] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [nftInformation, setnftInformation] = useState(null);
  const [nftInformationItem, setnftInformationItem] = useState(null);
  const [stastics, setStastics] = useState({});
  const limitPerPage = 40;
  const [pageNo, setPageNo] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [play, setPlay] = useState(true);

  useEffect(() => {
    getStastics();
    getCollectiondetail();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (pageNo > 1) {
      getNFTList();
    }
    // eslint-disable-next-line
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

  const getStastics = async () => {
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    const req = {
      collection_address: collectionAdd,
    };
    const stasticsData = await getCollectionStasticsApi(req);
    if (stasticsData?.data?.data) {
      const floorPrice = stasticsData?.data?.data?.floorPrice;
      const volumeTraded = stasticsData?.data?.data?.volumeTraded;
      let ethprice1 = null;
      let ethprice2 = null;
      if (hasDecimal(stasticsData?.data?.data?.floorPrice)) {
        ethprice1 = convertExponentialToDecimal(floorPrice);
        ethprice2 = convertExponentialToDecimal(volumeTraded);
      } else {
        if (floorPrice >= 1 && floorPrice < 100000) {
          ethprice1 = floorPrice;
          ethprice2 = volumeTraded;
        } else {
          ethprice1 = web3.utils.fromWei(floorPrice.toString(), "ether");
          ethprice2 = web3.utils.fromWei(volumeTraded.toString(), "ether");
        }
      }
      setStastics({
        items: stasticsData?.data?.data?.items,
        owners: stasticsData?.data?.data?.owners,
        floorPrice: ethprice1,
        volumeTraded: ethprice2,
      });
    }
  };

  const getCollectiondetail = async () => {
    const collectionRes = await getCollectionByIdApi(collectionAdd);
    const res = collectionRes?.data?.data[0];
    setIsLoading(false);
    if (res) {
      setnftInformation(res);
      setnftInformationItem(res);
    }
  };

  const getNFTList = async (isNew = false) => {
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
      const req = {
        page: isNew ? 1 : pageNo,
        limit: limitPerPage,
        status: selectedNFTstatus === "all" ? "" : selectedNFTstatus,
        category: category === "Allcategories" ? "" : category,
        payment: paymentType === "All" ? "" : paymentType,
        search: "",
        sort: sortBy,
        collectionID: collectionAdd,
      };
      const res = await getAllNFTSApi(req);
      const data = res?.data;
      const resList = res?.data?.data;

      let lists1 = [];
      let lists2 = [];
      if (resList?.length) {
        resList?.map(async (doc) => {
          let nft_data1 = null;
          let nft_data2 = null;
          if (doc?.tokenURI) {
            const result = await axios.get(doc?.tokenURI);
            if (result?.data) {
              if (doc?.awsImage) {
                const awsImageBrowser = doc?.awsImage?.webp["400X400"];
                const awsImageMobile = doc?.awsImage?.webp["200X200"];
                const nftInfo1 = `${AWS_IMAGE_PATH}${awsImageBrowser}`;
                const nftInfo2 = `${AWS_IMAGE_PATH}${awsImageMobile}`;
                delete doc["image"];
                nft_data1 = { id: doc.id, image: nftInfo1, ...doc };
                nft_data2 = { id: doc.id, image: nftInfo2, ...doc };
              } else if (doc?.image) {
                nft_data1 = { id: doc.id, ...doc };
                nft_data2 = { id: doc.id, ...doc };
              } else if (!result?.data?.image) {
                delete doc["image"];
                nft_data1 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc };
                nft_data2 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc };
              } else {
                let imgurl = null;
                if (!result?.data?.image?.includes("bleufi.mypinata.cloud")) {
                  if (result?.data?.image?.includes("ipfs://")) {
                    imgurl = result?.data?.image?.replace(
                      "ipfs://",
                      "https://bleufi.mypinata.cloud/ipfs/"
                    );
                  } else {
                    imgurl = result?.data?.image;
                  }
                } else {
                  imgurl = result.data.image;
                }
                delete doc["image"];
                nft_data1 = { id: doc.id, image: imgurl, ...doc };
                nft_data2 = { id: doc.id, image: imgurl, ...doc };
              }
            }
          } else {
            delete doc["image"];
            nft_data1 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc };
            nft_data2 = { id: doc.id, image: DEFAULT_TOKEN_URI, ...doc };
          }
          lists1 = [...lists1, nft_data1];
          lists2 = [...lists2, nft_data2];
          if (isNew) {
            setCards([...lists1]);
            setMobileCards([...lists2]);
          } else {
            setCards([...cards, ...lists1]);
            setMobileCards([...cards, ...lists2]);
          }
        });
      } else {
        setCards([]);
        setMobileCards([]);
      }
      setPageNFT(isNew ? 1 : pageNFT + 1);
      setTotalPages(data.totalPages);
      setPlay(false);
      setCurrentPage(Number(data.currentPage));
    } catch (err) {
      setPlay(false);
      console.log(err);
    }
  };

  useEffect(() => {
    if (timer) {
      window.clearTimeout(timer);
    }
    timer = window.setTimeout(() => {
      getNFTList(true);
      setPageNo(1);
    }, 500);

    // eslint-disable-next-line
  }, [category, order, paymentType, selectedNFTstatus]);

  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 10);
    });
  }, []);

  const handleActiveNFTCollection = (key) => {
    if (key === paymentType || key === selectedNFTstatus || key === category) {
      return "active";
    } else {
      return;
    }
  };

  const handleShowMoreImages = () => {
    setPageNo(pageNo + 1);
  };

  return isLoading ? (
    <LoaderNew />
  ) : (
    <main className="main">
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
                    <h1>{nftInformation ? nftInformation.name : ""}</h1>
                    <p>
                      Created by :{" "}
                      <span>
                        {" "}
                        {nftInformation ? nftInformation.creator : ""}{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>


              <div className="collection_user_detail">
                <div className="row explorerPanel">
                  <div className="col-12 col-xl-10 offset-xl-1 col-lg-12 col-md-12">
                    <div className="profile_detail">
                      <div className="row">
                        <div className="col-md-3 col-sm-3 col-3">
                          <div className="profile_content">
                            <h3 className="profile_detail_value">
                              {stastics ? stastics?.items : "Coming Soon"}
                            </h3>
                            <p className="profile_detail_names">Items</p>
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-3 col-3">
                          <div className="profile_content">
                            <h3 className="profile_detail_value">
                              {stastics ? stastics?.owners : "Coming Soon"}
                            </h3>
                            <p className="profile_detail_names">Owners</p>
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-3 col-3">
                          <div className="profile_content">
                            <h3 className="profile_detail_value">
                              <img src={ETH} className="eth_img" alt="Image" />  {stastics ? stastics?.floorPrice : "Coming Soon"}
                            </h3>
                            <p className="profile_detail_names">Floor Price</p>
                          </div>
                        </div>

                        <div className="col-md-3 col-sm-3 col-3">
                          <div className="profile_content">
                            <h3 className="profile_detail_value">
                              <img src={ETH} className="eth_img" alt="Image" /> {stastics ? stastics?.volumeTraded : "Coming Soon"}
                            </h3>
                            <p className="profile_detail_names">Volume Traded</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-xl-8 offset-xl-2 col-lg-12 col-md-12">
                    <p className="detail_content mt-2 mb-4">
                      {nftInformation?.description && (
                        <>

                          {/* Description :{" "} */}

                          {" "}
                          {nftInformation
                            ? nftInformation.description
                            : ""}{" "}

                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="explorerHead marketexplore">
              <div className="row">
                <div className="col-xl-8 col-lg-8 col-md-8 col-12">
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
                        {/* <div className="switch_shop d-md-none d-block mb-5">
                          <p
                            onClick={() => setShowFilter(!showFilter)}
                            className="d-md-none d-inline-block clear_para pl-3"
                          >
                            Done
                          </p>
                          <p className="d-md-none d-inline-block clear_para">
                            Clear All
                          </p>
                        </div> */}

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
                            <option value="other">Others</option>
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
                        {/* <div className={status ? "praktyka " : "praktyka"}>
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
                                  setSelectedNFTstatus("Buy");
                                }}
                                className={
                                  "praktyka-content-item " +
                                  handleActiveNFTCollection("Buy")
                                }
                              >
                                Buy Now
                              </li>
                              <li
                                onClick={() => {
                                  setSelectedNFTstatus("auction");
                                }}
                                className={
                                  "praktyka-content-item " +
                                  handleActiveNFTCollection("auction")
                                }
                              >
                                On Auction
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className={categories ? "praktyka " : "praktyka"}>
                          <h4
                            onChange={(e) => {
                              setCategories(e.target.value);
                            }}
                          >
                            categories
                          </h4>
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
                                  setCategory("other");
                                }}
                                className={
                                  "praktyka-content-item " +
                                  handleActiveNFTCollection("other")
                                }
                              >
                                Other
                              </li>
                            </ul>
                          </div>
                        </div>
                        <div className={payment ? "praktyka " : "praktyka"}>
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
                </div>

                <div className="col-xl-4 col-lg-4 col-md-4 col-12 text-right mt-xl-1 mt-lg-2 mt-md-2 mt-0">
                  <h4 className="d-inline-block mr-2">Sort by</h4>
                  <div className="select_img_place d-inline-block">
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
                        className={`nav-link ${tab === "items" || account !== id ? "active" : ""
                          }`}
                        data-toggle="tab"
                        href="#tab-collection"
                        role="tab"
                        aria-controls="tab-collection"
                        aria-selected={account !== id}
                        style={{ fontWeight: "bold" }}
                      >
                        Items
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="tab-content pt-5">
                  <div
                    className={`tab-pane fade ${tab === "items" ? "show active" : ""
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
                                <Product
                                  key={card._id}
                                  data={card}
                                  image={test}
                                  comment1="Pixel Birds Collection"
                                  comment2="Pixel Pigeon #23456"
                                  comment3="@ArtistPerson"
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <>{play === false && <h3 className="no_items">No Items Found...</h3>}</>
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
                                <Product
                                  key={card._id}
                                  data={card}
                                  image={test}
                                  comment1="Pixel Birds Collection"
                                  comment2="Pixel Pigeon #23456"
                                  comment3="@ArtistPerson"
                                />
                              </div>
                            ))}
                          </>
                        ) : (
                          <>{play === false && <h3 className="no_items">No Items Found...</h3>}</>
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
    </main >
  );
}
export default CollectionDetail;

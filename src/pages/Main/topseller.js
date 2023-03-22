import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";

import artist3banner from "assets/img/artists/creator3.png";
import promotedCollection1 from "assets/img/promoted/promoted_collection_1/promoted_collection_1.jpg";
import promotedCollection2 from "assets/img/promoted/promoted_collection_1/promoted_collection_2.jpg";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Pick from "../../components/Pick";
import PickCollection from "../../components/PickCollection";
import test from "assets/img/test.jpg";
import AliceCarousel from "react-alice-carousel";
import "react-alice-carousel/lib/alice-carousel.css";
import Tick from "../../assets/img/artists/tick.png";
import Verify from "../../assets/img/icons/verify.png";
import BlackArrow from "../../assets/img/icons/black-arrow.png";
import WhiteArrow from "../../assets/img/icons/white-arrow.png";
import Arrow from "../../assets/img/icons/down-arrow.png";
import {
  addFollowApi,
  getPopularCreatorsApi,
  getTopCollectionsApi,
  unFollowApi,
} from "apis";
import { useDisconnect } from "hooks/useDisconnect";
import { RPC_URLS } from "../../pages/Header/connectors";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { Get_Profile_By_AccountId } from "apis";
import { followAPI } from "apis";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Right from "../../assets/img/icons/right.png";
import Creator1 from "../../assets/img/creator/1.png";
import Creator2 from "../../assets/img/creator/2.png";
import Creator3 from "../../assets/img/creator/3.png";
import Create1 from "../../assets/img/creator/creator1.png";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import { HeartIcon } from "@heroicons/react/outline";
import { getLaunchpadCollection } from "apis";
import LaunchpadCard from "components/Card/ LaunchpadCard";
import { getTopCreators } from "apis";
import { getLatestCreator } from "apis";
import { DefaultAvatar, DefaultCoverImage } from "../../constants";
import { getTopSallers } from "apis";
import { getUpcomingCollection } from "apis";
import { getLiveCollection } from "apis";
import { getEndCollection } from "apis";

function Topseller() {
  const [list, setList] = useState([]);
  const [creatorList, setCreatorList] = useState([]);
  const tokenId = useSelector((state) => state?.tokenData?.token);
  const loginNetwork = useSelector((state) => state?.loginNetwork?.value);
  const { account } = useWeb3React();
  const { disconnectWalletConnect } = useDisconnect();
  const [upComingType, setUpcomingType] = useState("");
  const [liveType, setLiveType] = useState("");
  const [endType, setEndType] = useState("");
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isUser = localStorage.getItem("isActive");
  const [accounts, setAccount] = useState(account);
  const [isFollowing, setIsFollowing] = useState(false);
  const [upcomingCollection, setUpcomingCollection] = useState([]);
  const [liveCollection, setLiveCollection] = useState([]);
  const [endCollection, setEndCollection] = useState([]);
  const [topCreators, setTopCreators] = useState(null);
  // const [isFollowed, setIsFollowed] = useState(null);

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await providers.enable();
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  useEffect(() => {
    getList();
    // getCollection();
    upComingCollection(true, "");
    getLiveCollectionData(false, "");
    getEndCollectionData(false, "");
    getTopLaunchPadCreators();
    getPopularCreator();
  }, [loginNetwork]);

  const getTopLaunchPadCreators = async () => {
    const res = await getTopCreators();
    if (res) {
      setTopCreators(res?.data?.success?.data);
    }
  };

  const upComingCollection = async () => {
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: networkId,
        networkName: networkName,
        searchText: "",
      };
    } else {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: "97",
        networkName: "Binance",
        searchText: "",
      };
    }
    const resUpcoming = await getUpcomingCollection(req);
    const dataUpcoming = resUpcoming?.data?.success?.data?.result?.results;
    setUpcomingType(resUpcoming?.data?.success?.data?.type);
    if (dataUpcoming) setUpcomingCollection([...dataUpcoming]);
  };

  const getLiveCollectionData = async () => {
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: networkId,
        networkName: networkName,
        searchText: "",
      };
    } else {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: "97",
        networkName: "Binance",
        searchText: "",
      };
    }

    const resLive = await getLiveCollection(req);
    const dataLive = resLive?.data?.success?.data?.result?.results;
    setLiveType(resLive?.data?.success?.data?.type);
    if (dataLive) setLiveCollection([...dataLive]);
  };

  const getEndCollectionData = async () => {
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: networkId,
        networkName: networkName,
        searchText: "",
      };
    } else {
      req = {
        page: 1,
        limit: 5,
        sortBy: {"name":"created_at", "order":-1},
        networkId: "97",
        networkName: "Binance",
        searchText: "",
      };
    }

    const resEnd = await getEndCollection(req);
    const dataEnd = resEnd?.data?.success?.data?.result?.results;
    setEndType(resEnd?.data?.success?.data?.type);
    if (dataEnd) setEndCollection([...dataEnd]);
  };

  const getPopularCreator = async () => {
    const userDocs = await getPopularCreatorsApi(tokenId);
    const data = userDocs?.data?.data;
    if (data?.length) {
      setCreatorList(data);
    }
  };

  const getList = async () => {
    const ntfs = await getTopCollectionsApi();
    const data = ntfs?.data?.data;
    setList(data);

  };

  const tabObj = [
    { label: "Upcoming Collections", key: "first" },
    { label: "Live Collections", key: "second" },
    { label: "End Collections", key: "third" },
  ];
  const [isLabel, setIsLabel] = useState(tabObj.length ? tabObj[0] : "");

  const handleDragStart = (e) => e.preventDefault();
  const items = [
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
    <Pick image={test} comment="Seasonal" onDragStart={handleDragStart} />,
  ];

  const responsive = {
    0: { items: 2 },
    990: { items: 2 },
    1024: { items: 3 },
    1444: { items: 4 },
  };

  const followUser = async (creator) => {
    setIsFollowing(true);
    const followData = creator.followers
      ? creator.followers.filter(
          (x) => x?.toLowerCase() === accounts?.toLowerCase()
        )
      : [];
    const isFollowed = creator.is_followed;
    if (isUser === "true" || mobileAccount == "true") {
      if (creator.account?.toLowerCase() === accounts?.toLowerCase()) {
        toast.error("You can't follow yourself.");
      } else {
        if (!tokenId) {
          return await disconnectWalletConnect();
        }
        try {
          if (isFollowed) {
            // const data = await unFollowApi(tokenId, creator._id, accounts);
            const userInfo = await Get_Profile_By_AccountId(accounts, "");
            const userExist = userInfo ? userInfo?.data : {};
            if (!userExist?.nickName) {
              // await creatProfile(accounts);
              toast.error(`Please update your profile first.`);
              return;
            }
            const data = await followAPI(
              tokenId,
              creator._id,
              userInfo?.data?._id
            );
            if (data?.data?.status === 200) {
              toast.success(`You unfollow ${creator.nickName}`);
              setIsFollowing(false);
              // setIsFollowed(false)
              // props.getData();
            } else if (data?.response?.data?.error) {
              toast.error(data.response.data.error);
            } else {
              setIsFollowing(false);
              toast.error("Internal server error");
            }
          } else {
            // const data = await addFollowApi(tokenId, creator._id, accounts);
            const userInfo = await Get_Profile_By_AccountId(accounts, "");
            const userExist = userInfo ? userInfo?.data : {};
            if (!userExist?.nickName) {
              // await creatProfile(accounts);
              toast.error(`Please update your profile first.`);
              return;
            }
            const data = await followAPI(
              tokenId,
              creator._id,
              userInfo?.data?._id
            );
            if (data?.data?.status === 200) {
              toast.success(`You follow ${creator.nickName}`);
              setIsFollowing(false);
              // setIsFollowed(true)
              // props.getData();
            } else if (data?.response?.data?.error) {
              setIsFollowing(false);
              toast.error("Please connect your wallet first");
            } else {
              setIsFollowing(false);
              toast.error("Internal server error");
            }
          }
          getPopularCreator();
        } catch (err) {
          setIsFollowing(false);
          toast.error("Error in following");
        }
      }
    } else {
      setIsFollowing(false);
      toast.error("Please connect your wallet first");
    }
  };

  const pageredirection = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  var settings = {
    dots: false,
    infinite: false,
    autoplay: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  var settings1 = {
    dots: false,
    infinite: false,
    autoplay: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="row">
      <div className="col-12">
        {/* Promoted Collection */}

        <div className="">
          <div className="row d-none">
            <div className="sectionPromotedCollection"></div>
            <div className="col-12 col-md-6 promotedCollectionContent">
              <small className="promotedHandle">@tinycryptobunny</small>

              <h1 className="promotedCollectionHeadline">Chubby Chimps</h1>
              <p>
                A Collection of 1000 Chubby Chimps Ready to go Bananas on BSC
              </p>
              <a href="https://www.Angeldust.com/creator/624bb59064d0f56b81c51e6e/collection/0xfb5906ee223407b84f46142556e609817fc45a46">
                <button className="btn-glow btn-hover-shine mt-3 highlightHover">
                  Explore Collection{" "}
                </button>
              </a>
            </div>
            <div className="col-12 col-md-6 promotedCollectionImage">
              <a href="https://www.Angeldust.com/creator/624bb59064d0f56b81c51e6e/collection/0xfb5906ee223407b84f46142556e609817fc45a46">
                <img src={promotedCollection1} className="promotedCollection" />
              </a>
            </div>
          </div>

          <div className="row mt-150 d-none">
            <div className="sectionPromotedCollection"></div>
            <div className="col-12 col-md-6 promotedCollectionImage">
              <a href="https://Angeldust.com/creator/0x937035Db926EB356DD70ef02DCd4B1c535448704">
                <img src={promotedCollection2} className="promotedCollection" />
              </a>
            </div>
            <div className="col-12 col-md-6 promotedCollectionContent">
              <small className="promotedHandle">@plastic3d</small>
              <h1 className="promotedCollectionHeadline">
                Angeldust 3D Whale Print
              </h1>
              <p>
                A small collection of the 3D printed Angeldust Whale and a
                Dragon by @plastic3d (4.2M+ Followers on{" "}
                <a href="https://www.tiktok.com/@plastic3d" target="_blank">
                  TikTok
                </a>
                ).{" "}
              </p>
              <a href="https://Angeldust.com/creator/0x937035Db926EB356DD70ef02DCd4B1c535448704">
                <button className="btn-glow btn-hover-shine mt-3 highlightHover">
                  Explore Collection
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* Top Collection */}
        <div className="mb-100 d-none">
          <div className="row mb-50">
            <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 text-center w-100 mb-50">
              Top Collections
            </p>
            <div className="row d-flex">
              {/* Top collection 1 */}
              <div className="col-12 col-md-4 p-0 featuredTopCollectionCard mx-auto ">
                <div>
                  <img
                    src={artist3banner}
                    className="featuredTopCollectionBanner"
                  />
                </div>
                <div className="featuredTopCollectionCardAvatarWrapper">
                  <img
                    src={artist3banner}
                    className="featuredArtistCardAvatar"
                  />
                </div>
                <div className="featuredTopCollectionCardDetails p-4 mt-5">
                  <h5 className="text-center featuredTopCollectionCardTitle">
                    Collection Title
                  </h5>
                  <p className="text-center featuredTopCollectionCardHandle">
                    artist1
                  </p>

                  <div className="row">
                    <p className="text-center featuredTopCollectionCardDescription w-100">
                      test
                    </p>
                  </div>
                  <div className="bleuDivider">
                    <hr></hr>
                  </div>

                  <div className="heroButtons d-flex justify-content-center">
                    <a className="btn-glow btn-hover-shine">Collection</a>
                  </div>
                </div>
              </div>

              {/* Top collection 2 */}
              <div className="col-12 col-md-4 p-0 featuredTopCollectionCard mx-auto">
                <div>
                  <img
                    src={artist3banner}
                    className="featuredTopCollectionBanner"
                  />
                </div>
                <div className="featuredTopCollectionCardAvatarWrapper">
                  <img
                    src={artist3banner}
                    className="featuredArtistCardAvatar"
                  />
                </div>
                <div className="featuredTopCollectionCardDetails p-4 mt-5">
                  <h5 className="text-center featuredTopCollectionCardTitle">
                    Collection Title
                  </h5>
                  <p className="text-center featuredTopCollectionCardHandle">
                    artist1
                  </p>

                  <div className="row">
                    <p className="text-center featuredTopCollectionCardDescription w-100">
                      test
                    </p>
                  </div>
                  <div className="bleuDivider">
                    <hr></hr>
                  </div>

                  <div className="heroButtons d-flex justify-content-center">
                    <a className="btn-glow btn-hover-shine">Collection</a>
                  </div>
                </div>
              </div>

              {/* Top collection 3 */}
              <div className="col-12 col-md-4 p-0 featuredTopCollectionCard mx-auto">
                <div>
                  <img
                    src={artist3banner}
                    className="featuredTopCollectionBanner"
                  />
                </div>
                <div className="featuredTopCollectionCardAvatarWrapper">
                  <img
                    src={artist3banner}
                    className="featuredArtistCardAvatar"
                  />
                </div>
                <div className="featuredTopCollectionCardDetails p-4 mt-5">
                  <h5 className="text-center featuredTopCollectionCardTitle">
                    Collection Title
                  </h5>
                  <p className="text-center featuredTopCollectionCardHandle">
                    artist1
                  </p>

                  <div className="row">
                    <p className="text-center featuredTopCollectionCardDescription w-100">
                      test
                    </p>
                  </div>
                  <div className="bleuDivider">
                    <hr></hr>
                  </div>

                  <div className="heroButtons d-flex justify-content-center">
                    <a className="btn-glow btn-hover-shine">Collection</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Angeldust Favs */}
        <div className="mb-100 d-none">
          <div className="row mb-50">
            <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 text-center w-100 mb-50">
              Angeldust Favs
            </p>
            <div className="row d-flex">
              {/* Angeldust Favs 1 */}
              <div className="col-12 col-md-6 p-0 featuredAngeldustFavCard mx-auto">
                <div>
                  <img
                    src={artist3banner}
                    className="featuredAngeldustFavCardBanner"
                  />
                </div>
                <div className="featuredAngeldustFavCardDetails">
                  <h5 className="text-center featuredAngeldustFavCardDetailsTitle">
                    Artist 1
                  </h5>
                  <p className="text-center featuredAngeldustFavCardDetailsArtist">
                    artist1
                  </p>
                  <p className="text-center featuredAngeldustFavCardDetailsDescription">
                    test
                  </p>

                  <div className="bleuDivider">
                    <hr></hr>
                  </div>

                  <div className="heroButtons d-flex justify-content-center pb-25">
                    <a className="btn-glow btn-hover-shine">Collection</a>
                  </div>
                </div>
              </div>

              {/* Angeldust Favs 2 */}
              <div className="col-12 col-md-6 p-0 featuredAngeldustFavCard mx-auto">
                <div>
                  <img
                    src={artist3banner}
                    className="featuredAngeldustFavCardBanner"
                  />
                </div>
                <div className="featuredAngeldustFavCardDetails">
                  <h5 className="text-center featuredAngeldustFavCardDetailsTitle">
                    Artist 1
                  </h5>
                  <p className="text-center featuredAngeldustFavCardDetailsArtist">
                    artist1
                  </p>
                  <p className="text-center featuredAngeldustFavCardDetailsDescription">
                    test
                  </p>

                  <div className="bleuDivider">
                    <hr></hr>
                  </div>

                  <div className="heroButtons d-flex justify-content-center pb-25">
                    <a className="btn-glow btn-hover-shine">Collection</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Artists */}
        <div className="creator_div pt-md-5 pb-md-0 pt-3">
          <div className="mb-50">
            <h2 className="same_heading mb-md-2 pb-2">top creators</h2>

            <div>
              <Slider {...settings}>
                {topCreators &&
                  topCreators.map((item, index) => {
                    return (
                      <div>
                        <Link to={`/creator-public/${item.account}`}>
                          <div className="item">
                            <div className="item_img">
                              <img
                                src={
                                  item?.imageCover
                                    ? item?.imageCover
                                    : DefaultCoverImage
                                }
                                alt="Image"
                              />
                              <div className="user_img">
                                <img
                                  src={
                                    item?.avatar ? item?.avatar : DefaultAvatar
                                  }
                                  alt="Image"
                                />
                                <img
                                  src={
                                    item?.avatar ? item?.avatar : DefaultAvatar
                                  }
                                  className="verify_user_img"
                                  alt="Image"
                                />
                              </div>
                              <h4>
                                {item?.firstName
                                  ? item?.firstName
                                  : "User"}{" "}
                                {item?.lastName}
                              </h4>
                            </div>

                            {/* <button className="btn btn_follow">
                      Follow
                    </button> */}
                            {/* <p className="mt-3">
                      71 Followers
                    </p> */}
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </Slider>
            </div>

          </div>
        </div>

        {/* Top Collections New */}
        <div className="collection_div launchpad_div creator_div sell_buy_div pt-5 pb-md-5 pb-5">
          <div className="row">
            <div className="col-md-12 col-12">
              <h2 className="same_heading mb-4">Launchpad</h2>
            </div>

            <div className="col-md-12 col-12">
              <div className="main_launchpad_content">
                <Tab.Container id="tabs-example" defaultActiveKey="upcoming">
                  <Row className="d-lg-block d-md-none d-none">
                    <Col sm={12}>
                      <Nav variant="pills" className="flex-column mb-4">
                        <Nav.Item>
                          <Nav.Link eventKey="upcoming">
                            Upcoming Collections{" "}
                          </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="live">Live Collections</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="end">End Collections</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Col>
                  </Row>

                  <Row className="d-lg-none d-md-block d-block">
                    <Col md={5} sm={6} xs={12}>
                      <div className="dropdown_collection mb-4">
                        <div class="dropdown head_menu_drop head_menu_dropContent mr-xl-3 d-md-inline-block">
                          <a
                            class="btn dropdown-toggle collection_dropdown"
                            href="javascript"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span> {isLabel?.label} </span>
                          </a>
                          <button
                            class="dropdown-menu"
                            aria-labelledby="dropdownMenuLink"
                          >
                            {tabObj.map((item) => {
                              return (
                                <>
                                  <Nav variant="" className="" key={item.key}>
                                    <Nav.Item onClick={() => setIsLabel(item)}>
                                      <Nav.Link eventKey={item.key}>
                                        {item.label}
                                      </Nav.Link>
                                    </Nav.Item>
                                  </Nav>
                                </>
                              );
                            })}
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm={12}>
                      <Tab.Content>
                        <Tab.Pane eventKey="live">
                          <div>
                            {liveCollection.length !== 0 ? (
                                <Slider {...settings1}>
                                  {liveCollection &&
                                  liveCollection
                                      .slice(0, 5)
                                      .map((item, index) => {
                                        return (
                                            <div>
                                              <Link
                                                  to={`/collection/${item?.id}/${item?.collectionAddress}/${liveType}`}
                                              >
                                                <div className="item">
                                                  <div className="item_img">
                                                    <img
                                                        src={item?.imageCover}
                                                        alt="Image"
                                                    />
                                                  </div>
                                                  <h4>{item?.collectionName}</h4>
                                                  <div class="row">
                                                    <div class="col-md-6 col-6">
                                                      <p class="card_price">
                                                        {item?.mintCost}{" "}
                                                        {item?.currency}
                                                      </p>
                                                    </div>
                                                  </div>
                                                </div>
                                              </Link>
                                            </div>
                                        );
                                      })}
                                </Slider>
                            ) : (
                                <div className="mt-20" style={{ textAlign: "center" }}>
                                  <h4 className="text-center pl-md-5 no_data_found">
                                    No Collection Found
                                  </h4>
                                </div>
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="upcoming">
                          <div>
                            {upcomingCollection.length !== 0 ? (
                              <Slider {...settings}>
                                {upcomingCollection &&
                                  upcomingCollection
                                    .slice(0, 5)
                                    .map((item, index) => {
                                      return (
                                        <div>
                                          <Link
                                            to={`/collection/${item?.id}/${item?.collectionAddress}/${upComingType}`}
                                          >
                                            <div className="item">
                                              <div className="item_img">
                                                <img
                                                  src={item?.imageCover}
                                                  alt="Image"
                                                />
                                              </div>
                                              <h4>{item?.collectionName}</h4>
                                              <div class="row">
                                                <div class="col-md-6 col-6">
                                                  <p class="card_price">
                                                    {item?.mintCost}{" "}
                                                    {item?.currency}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </div>
                                      );
                                    })}
                              </Slider>
                            ) : (
                              <div className="mt-20" style={{ textAlign: "center" }}>
                              <h1 className="text-center pl-md-5 no_data_found">
                                No Collection Found
                              </h1>
                            </div>
                            )}
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="end">
                          <div>
                            {endCollection.length !== 0 ? (
                              <Slider {...settings1}>
                                {endCollection &&
                                  endCollection
                                    .slice(0, 5)
                                    .map((item, index) => {
                                      return (
                                        <div>
                                          <Link
                                            to={`/collection/${item?.id}/${item?.collectionAddress}/${endType}`}
                                          >
                                            <div className="item">
                                              <div className="item_img">
                                                <img
                                                  src={item?.imageCover}
                                                  alt="Image"
                                                />
                                              </div>
                                              <h4>{item?.collectionName}</h4>
                                              <div class="row">
                                                <div class="col-md-6 col-6">
                                                  <p class="card_price">
                                                    {item?.mintCost}{" "}
                                                    {item?.currency}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </Link>
                                        </div>
                                      );
                                    })}
                              </Slider>
                            ) : (
                              <div className="mt-20" style={{ textAlign: "center" }}>
                              <h1 className="text-center pl-md-5 no_data_found">
                                No Collection Found
                              </h1>
                            </div>
                            )}
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
           
          </div>

         
        </div>

        {/* Old section */}
        <div className="row featuredNFTs d-none">
          <div className="container">
            <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 ">
              Featured Collections
            </p>
            <div className="col-12" style={{ padding: "20px 0" }}>
              <ul
                className="nav nav-tabs main__tabs"
                id="main__tabs"
                role="tablist"
                style={{ justifyContent: "center" }}
              >
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#tab-1"
                    role="tab"
                    aria-controls="tab-1"
                    aria-selected="true"
                  >
                    Artwork
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-2"
                    role="tab"
                    aria-controls="tab-2"
                    aria-selected="false"
                  >
                    Music
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-3"
                    role="tab"
                    aria-controls="tab-3"
                    aria-selected="false"
                  >
                    Trading Cards
                  </a>
                </li>

                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-4"
                    role="tab"
                    aria-controls="tab-4"
                    aria-selected="false"
                  >
                    Collectibles
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tab-4"
                    role="tab"
                    aria-controls="tab-4"
                    aria-selected="false"
                  >
                    Utilities
                  </a>
                </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 pickColTitleArea">
                <PickCollection image={test} comment="Hot Collection" />
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-8 col-xl-9 pickColArea">
                <AliceCarousel
                  mouseTracking
                  activeIndex
                  disableDotsControls
                  disableButtonsControls
                  autoWidth
                  items={items}
                  responsive={responsive}
                />
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 pickColTitleArea">
                <PickCollection image={test} comment="Top Movers" />
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-8 col-xl-9 pickColArea">
                <AliceCarousel
                  mouseTracking
                  activeIndex
                  disableDotsControls
                  disableButtonsControls
                  items={items}
                  responsive={responsive}
                />
              </div>

              <div className="col-12 col-sm-6 col-md-6 col-lg-4 col-xl-3 pickColTitleArea">
                <PickCollection image={test} comment="Newest Collections" />
              </div>
              <div className="col-12 col-sm-6 col-md-6 col-lg-8 col-xl-9 pickColArea">
                <AliceCarousel
                  mouseTracking
                  activeIndex
                  disableDotsControls
                  disableButtonsControls
                  items={items}
                  responsive={responsive}
                />
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <button className="viewOnMarketplace mt-5">
                View Collections in the Marketplace
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Topseller;

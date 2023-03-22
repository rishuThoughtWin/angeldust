import React, { useEffect, useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import LoaderNew from "components/Loader-New";
import { RPC_URLS } from "../Header/connectors";
import Tab from "react-bootstrap/Tab";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import { getUpcomingCollection } from "apis";
import { getLiveCollection } from "apis";
import { getEndCollection } from "apis";
import UpComingCollection from "./UpComingCollection";
import LiveCollection from "./LiveCollection";
import EndCollection from "./EndCollection";

const tabObj = [
  { label: "Upcoming Collections", key: "first" },
  { label: "Live Collections", key: "second" },
  { label: "End Collections", key: "third" },
];

function Launchpad() {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const [sortOption, setSortOption] = useState("mostP");
  const [filterData, setFilter] = useState([]);
  const [play, setPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [liveCollection, setLiveCollection] = useState([]);
  const [endCollection, setEndCollection] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [liveTotalPage, setLiveTotalPage] = useState(0);
  const [liveCurrentPage, setLiveCurrentPage] = useState(1);
  const [endTotalPage, setEndTotalPage] = useState(0);
  const [endCurrentPage, setEndCurrentPage] = useState(1);
  const [upComingType, setUpcomingType] = useState("");
  const [liveType, setLiveType] = useState("");
  const [endType, setEndType] = useState("");
  const [tab, setTab] = useState();
  const limitPerPage = 12;
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const loginNetwork = useSelector((state) => state?.loginNetwork?.value);
  const loginModal = useSelector((state) => state?.loginModel?.value);
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
  let time = new Date();
  time.setHours(time.getHours() + 5);
  time.setMinutes(time.getMinutes() + 30);

  useEffect(() => {
    setPageNo(1);
    upComingCollection(true, searchText);
    getLiveCollectionData(true, searchText);
    getEndCollectionData(true, searchText);
  }, [sortOption, loginModal, loginNetwork]);

  const upComingCollection = async (isNew = false, value) => {
    if (isNew) {
      setPageNo(1);
    }
    setPlay(true);
    let sortBy = "";
    if (sortOption === "mostP") {
      sortBy = { name: "created_at", order: -1 };
    } else if (sortOption === "leastP") {
      sortBy = "createdAt";
    } else {
      sortBy = "";
    }
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: isNew ? 1 : totalPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: networkId,
        networkName: networkName,
        searchText: value ? value : searchText,
      };
    } else {
      req = {
        page: isNew ? 1 : totalPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: "97",
        networkName: "Binance",
        searchText: value ? value : searchText,
      };
    }

    const resUpcoming = await getUpcomingCollection(req);
    const dataUpcoming = resUpcoming?.data?.success?.data?.result?.results;
    if (dataUpcoming) {
      if (isNew) {
        setFilter([...dataUpcoming]);
      } else {
        setFilter([...filterData, ...dataUpcoming]);
      }
    }
    setTotalPage(resUpcoming?.data?.success?.data?.result?.totalPages);
    setCurrentPage(Number(resUpcoming?.data?.success?.data?.result?.page));
    setUpcomingType(resUpcoming?.data?.success?.data?.type);

    setIsLoading(false);
    setPlay(false);
  };

  const getLiveCollectionData = async (isNew = false, value) => {
    if (isNew) {
      setLiveCurrentPage(1);
    }
    setPlay(true);
    let sortBy = "";
    if (sortOption === "mostP") {
      sortBy = { name: "created_at", order: -1 };
    } else if (sortOption === "leastP") {
      sortBy = "createdAt";
    } else {
      sortBy = "";
    }
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: isNew ? 1 : liveCurrentPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: networkId,
        networkName: networkName,
        searchText: value ? value : searchText,
      };
    } else {
      req = {
        page: isNew ? 1 : liveCurrentPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: "97",
        networkName: "Binance",
        searchText: value ? value : searchText,
      };
    }

    const resLive = await getLiveCollection(req);
    const dataLive = resLive?.data?.success?.data?.result?.results;
    if (dataLive) {
      if (isNew) {
        setLiveCollection([...dataLive]);
      } else {
        setLiveCollection([...liveCollection, ...dataLive]);
      }
    }
    setLiveTotalPage(resLive?.data?.success?.data?.result?.totalPages);
    setLiveCurrentPage(Number(resLive?.data?.success?.data?.result?.page));
    setLiveType(resLive?.data?.success?.data?.type);
    setIsLoading(false);
    setPlay(false);
  };

  const getEndCollectionData = async (isNew = false, value) => {
    if (isNew) {
      setPageNo(1);
    }
    setPlay(true);
    let sortBy = "";
    if (sortOption === "mostP") {
      sortBy = { name: "created_at", order: -1 };
    } else if (sortOption === "leastP") {
      sortBy = "createdAt";
    } else {
      sortBy = "";
    }
    const networkId = localStorage.getItem("networkId");
    const networkName = localStorage.getItem("networkName");
    let req = null;
    if (networkId && networkName) {
      req = {
        page: isNew ? 1 : endCurrentPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: networkId,
        networkName: networkName,
        searchText: value ? value : searchText,
      };
    } else {
      req = {
        page: isNew ? 1 : endCurrentPage,
        limit: limitPerPage,
        sortBy: sortBy,
        networkId: "97",
        networkName: "Binance",
        searchText: value ? value : searchText,
      };
    }

    const resEnd = await getEndCollection(req);
    const dataEnd = resEnd?.data?.success?.data?.result?.results;
    if (dataEnd) {
      if (isNew) {
        setEndCollection([...dataEnd]);
      } else {
        setEndCollection([...endCollection, ...dataEnd]);
      }
    }
    setEndTotalPage(resEnd?.data?.success?.data?.result?.totalPages);
    setEndCurrentPage(Number(resEnd?.data?.success?.data?.result?.page));
    setEndType(resEnd?.data?.success?.data?.type);

    setIsLoading(false);
    setPlay(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line
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
  }, [account]);

  const [isLabel, setIsLabel] = useState(tabObj.length ? tabObj[0] : "");

  return isLoading ? (
    <LoaderNew />
  ) : (
    <main className="main contentCol">
      <div className="hero_common creator_hero_main">
        <div className="hero_border">
          <div className="container">
            <div className="row row--grid mb-md-5 pb-md-4">
              <div className="col-12">
                <div className="main__title main__title--page text-center">
                  <h1>
                    WELCOME TO
                    <span className="d-block"> Angeldust LAUNCHPAD</span>
                  </h1>

                  <p className="mb-4">
                    Here you can search and buy creator's ASSETS with BNB & ETH
                  </p>
                </div>
              </div>

              <div className="col-md-12 text-center m-auto">
                <button
                  className="btn create_collection"
                  onClick={() => history.push("/launchpadCollection")}
                >
                  Create Collections
                </button>
              </div>
            </div>

            <div className="main__filter bleuFrosted main__filternew modal_Angeldustlter mt-5">
              <div className="main_launchpad_content">
                <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                  <Row className="d-lg-block d-md-none d-none">
                    <Col md={7}  xs={12} className="adCard pt-20">
                      <Nav variant="pills" className="flex-row">
                        {tabObj.map((item) => {
                          return (
                            <Nav.Item>
                              <Nav.Link
                                onClick={() => setTab(item.key)}
                                eventKey={item.key}
                              >
                                {item.label}
                              </Nav.Link>
                            </Nav.Item>
                          );
                        })}
                      </Nav>
                    </Col>
                  </Row>

                  <Row className="d-lg-none d-md-block d-block">
                    <Col md={5} sm={6} xs={12}>
                      <div className="dropdown_collection">
                        <div class="dropdown head_menu_drop mr-xl-3 d-md-inline-block">
                          <a
                            class="btn dropdown-toggle collection_dropdown"
                            href="javascript"
                            role="button"
                            id="dropdownMenuLink"
                            data-toggle="dropdown"
                            aria-haspopup="true"
                            aria-expanded="false"
                          >
                            <span className="dropdownItem"> {isLabel?.label} </span>
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
                    <Col md={12} xs={12}>
                      <Tab.Content className="mt-4">
                        <UpComingCollection
                          eventKey="first"
                          isLabel={isLabel}
                          setIsLabel={setIsLabel}
                          tab={tab}
                          setTab={setTab}
                        />
                        <LiveCollection
                          eventKey="second"
                          isLabel={isLabel}
                          setIsLabel={setIsLabel}
                          tab={tab}
                          setTab={setTab}
                        />
                        <EndCollection
                          eventKey="third"
                          isLabel={isLabel}
                          setIsLabel={setIsLabel}
                          tab={tab}
                          setTab={setTab}
                        />
                      </Tab.Content>
                    </Col>
                  </Row>
                </Tab.Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Launchpad;

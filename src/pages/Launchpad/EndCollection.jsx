import React, { useEffect, useState, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import LoaderNew from "components/Loader-New";
import { RPC_URLS } from "../Header/connectors";
import LaunchpadCard from "components/Card/ LaunchpadCard";
import Search from "assets/img/icons/search.png";
import Tab from "react-bootstrap/Tab";
import { getEndCollection } from "apis";

function EndCollection(props) {
  const { eventKey, setIsLabel, isLabel, setTab, tabObj, tab } = props;

  const mobileAccount = localStorage.getItem("mobileAccount");
  const [sortOption, setSortOption] = useState("mostP");
  const [play, setPlay] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [endCollection, setEndCollection] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [endTotalPage, setEndTotalPage] = useState(0);
  const [endCurrentPage, setEndCurrentPage] = useState(1);
  const [endType, setEndType] = useState("");
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
    getEndCollectionData(true, searchText);
  }, [sortOption, loginModal, loginNetwork]);

  useEffect(() => {
    if (endCurrentPage > 1) {
      getEndCollectionData(false, searchText);
    }
  }, [endCurrentPage]);

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

  const handleEndShowMore = () => {
    setEndCurrentPage(endCurrentPage + 1);
  };

  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 1000);
    };
  };

  const handleChange = (value) => {
    getEndCollectionData(true, value);
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  return isLoading ? (
    <LoaderNew />
  ) : (
    <>
      <Tab.Pane eventKey="third">
        <div className="row row--grid">
          {endCollection && endCollection.length > 0 ? (
            <>
              {endCollection?.map((creator, index) => (
                <div
                  className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 mtb-10 collection_width_mob"
                  key={`creator-${index}`}
                >
                  <LaunchpadCard
                    key={creator._id}
                    data={creator}
                    id={index}
                    type={endType}
                  />
                </div>
              ))}
            </>
          ) : (
            play === false && (
              <div style={{ marginTop: "10px" }}>
                <h3 style={{ color: "white" }}>No records found...</h3>
              </div>
            )
          )}
        </div>
        <div className="row row--grid pb-0 pb-md-5">
          <div className="col-12">
            <Loader isLoading={play} />
            {endCollection &&
              endCurrentPage > 0 &&
              endCollection.length > 0 &&
              endTotalPage > endCurrentPage && (
                <button
                  className="main__load"
                  type="button"
                  onClick={handleEndShowMore}
                  variant="contained"
                >
                  Load more
                </button>
              )}
          </div>
        </div>
      </Tab.Pane>
      {tab === "third" && (
        <div className="search_filter_launchpad d-md-inline-block d-sm-inline-block d-none">
          <div className="main__filter-search">
            <input
              type="text"
              placeholder="Search Collections..."
              value={searchText}
              onChange={(e) => {
                optimizedFn(e.target.value);
                setSearchText(e.target.value);
              }}
            />
            <button className="btn">
              <img src={Search} className="search_input" alt="Search" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
export default EndCollection;

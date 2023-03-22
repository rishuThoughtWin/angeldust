import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from 'web3'
import { toast } from 'react-toastify'
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useSelector } from "react-redux";

import Loader from "../../components/Loader";
import BlackListAbi from '../../services/smart-contract/BlackList'
import Filter from "./Filter";
import Creator from "components/Creator";
import LoaderNew from "components/Loader-New";
import { confirmBlackList, getAllCreatorsApi } from "apis";
import { RPC_URLS } from "../Header/connectors";
import { useDisconnect } from "hooks/useDisconnect";
import { getAllCreatorsApiV2 } from "apis";

function Creators() {
  const isAdmin = localStorage.getItem("owner")
  const mobileAccount = localStorage.getItem("mobileAccount")
  const [deleteNFTListId, setDeleteNFTListId] = useState([])
  const [blackListUserListIds, setBlackListUserListIds] = useState([]);
  const [deleteEnable, seDeleteEnable] = useState(false)
  const [creators, setCreators] = useState([]);
  const [creatorlength, setCreatorlength] = useState()
  const [sortOption, setSortOption] = useState("mostP");
  const [filterData, setFilter] = useState(creators);
  const [play, setPlay] = useState(true);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 20;

  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account)
  const { disconnectWalletConnect } = useDisconnect();
  const tokenId = useSelector(state => state?.tokenData?.token);

  const web3 = new Web3(Web3.givenProvider || window.etherum)
  const blacklistAddress = process.env.REACT_APP_BLACK_LIST_MANAGER

  useEffect(() => {
    setPageNo(1);
    getUsers(true, searchText);
  }, [sortOption]);

  useEffect(() => {
    if (pageNo > 1) {
      getUsers(false, searchText);
    }
  }, [pageNo])


  const handleSort = (e) => {
    setSortOption(e);
    setPageNo(1);
  };

  const getUsers = async (isNew = false, value) => {
    if (isNew) {
      setPageNo(1)
    }
    setPlay(true);
    let sort = sortOption;
    let sortBy = "";
    if (sortOption === "mostP") {
      sortBy = "-createdAt"
    }
    else if (sortOption === "leastP") {
      sortBy = "createdAt"
    }
    else if (sortOption === "mostS") {
      sortBy = ""
    }
    else if (sortOption === "leastS") {
      sortBy = ""
    }
    else if (sortOption === "following") {
      sortBy = "-following"
    }
    else {
      sortBy = ""
    }
    const req = {
      page: isNew ? 1 : pageNo,
      limit: limitPerPage,
      sort: sortBy,
      search: value,
      token:tokenId
    }
    const res = await getAllCreatorsApiV2(req)
    const data = res?.data?.data?.data;
    if (data?.length) {
      setCreators(isNew ? data : [...creators, ...data])
      setFilter(isNew ? data : [...creators, ...data])
      setCreatorlength(data?.length)

      setTotalPage(res?.data?.data?.totalPages);
      setCurrentPage(Number(res?.data?.data?.page));
    }
    else {
      setCreators([]);
      setFilter([])
    }
    setIsLoading(false);
    setPlay(false);
  };
  const updateFollower = (index) => {
    const temp = creators?.map((x) => {
      if (x.accounts === index) {
        const tt = x;
        const ind = tt.followers.indexOf(accounts);
        if (ind === -1) tt.followers.push(accounts);
        else {
          tt.followers[ind] = tt.followers[tt.followers.length - 1];
          tt.followers.pop();
        }
        return tt;
      } else return x;
    });
    setCreators(temp);
    //handleSearch("");
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  useEffect(async () => {
    if (mobileAccount == 'true') {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0])
    }
    else {
      setAccount(account)
    }
    // getUsers(false, searchText);
  }, [account]);

  const onDeleteNFTHandler = (accountId) => {
    if (deleteNFTListId.some((e) => e == accountId)) {
      const newListId = deleteNFTListId.filter((item) => item !== accountId)
      setDeleteNFTListId(newListId)
    } else {
      setDeleteNFTListId([...deleteNFTListId, accountId])
    }

  }


  const onDeleteNFT_IdsHandler = (id) => {
    if (blackListUserListIds.some((e) => e == id)) {
      const newListId = blackListUserListIds.filter((item) => item !== id)
      setBlackListUserListIds(newListId)
    } else {
      setBlackListUserListIds([...blackListUserListIds, id])
    }
  }

  const deletehandler = () => {
    seDeleteEnable(!deleteEnable)
  }

  const blackListHandler = async () => {
    const account = await web3.eth.getAccounts()
    try {
      if (isAdmin == 'true' && accounts) {
        let res
        if (mobileAccount == 'true') {
          const provider = new WalletConnectProvider({
            rpc: RPC_URLS,
          });

          //  Enable session (triggers QR Code modal)
          await provider.enable();
          const web3 = new Web3(provider);
          const blackListContract = new web3.eth.Contract(
            BlackListAbi.abi,
            blacklistAddress,
          )
        } 
        const blacklistRes = await confirmBlackList(tokenId, { ids: blackListUserListIds })

        if (blacklistRes?.status === 200) {
          getUsers(true)
          setDeleteNFTListId([])
          seDeleteEnable(false)
          window.$("#blackListPop").modal("hide");
          toast.success(`Selected User's have BlackListed`);
        }
        else {
          toast.error("something went wrong")
        }
        //}
      }

    } catch (err) {
      console.log(err)
      window.$("#blackListPop").modal("hide");
    }
  }

  const handleShowMoreImages = () => {
    if (limit <= creatorlength) {
      setLimit(limit + 12);
    }
    setPageNo(pageNo + 1);
  };

  const handleSubmitSearch = (value) => {
    setPageNo(1);
    getUsers(true, value);
  }

  return (
    isLoading ? <LoaderNew />
      :
      <main className="main contentCol">
        <div className="hero_common creator_hero_main">
          <div className="hero_border">


            <div className="container">
              <div className="row row--grid mb-md-4">

                <div className="col-12">
                  <div className="main__title main__title--page text-center">
                    <h1>Angeldust Creators</h1>
                    <p>
                    Create and launch your NFT collections on BSC & ETH
                    </p>
                  </div>
                </div>
                {/* end title */}
                <Filter
                  onChange={(e) => setSearchText(e)}
                  onSort={(e) => handleSort(e)}
                  deleteNFTListId={deleteNFTListId}
                  deletehandler={deletehandler}
                  blackListHandler={blackListHandler}
                  onSubmitForm={handleSubmitSearch}
                  searchText={searchText}
                />
              </div>

              {/* creators */}
              <div className="row row--grid">
                {filterData && filterData.length > 0
                  ?
                  <>
                    {filterData?.map((creator, index) => (
                      <div
                        className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 mtb-10 collection_width_mob"
                        key={`creator-${index}`}
                      >
                        <Creator
                          key={creator._id}
                          data={creator}
                          id={index}
                          updateFollower={updateFollower}
                          onDeleteNFTHandler={onDeleteNFTHandler}
                          deleteEnable={deleteEnable}
                          getCreators={(isNew) => getUsers(isNew, searchText)}
                          setBlackListUserListIds={onDeleteNFT_IdsHandler}
                        />
                      </div>
                    ))}
                  </>
                  : play === false &&
                  <div className="w-100" style={{ marginTop: '10px' }}>
                    <h3 className="text-center" style={{color:"white"}}>
                      No records found...
                    </h3>
                  </div>
                }
              </div>
              <div className="row row--grid pb-0 pb-md-5">
                <div className="col-12">
                  <Loader isLoading={play} />
                  {filterData && filterData.length > 0 && totalPage > currentPage &&
                    <button
                      className="main__load"
                      type="button"
                      onClick={handleShowMoreImages}
                      variant="contained"
                    >
                      Load more
                    </button>
                  }
                </div>
              </div>
              {/* end creators */}
            </div>
          </div>
        </div>
      </main>
  );
}
export default Creators;

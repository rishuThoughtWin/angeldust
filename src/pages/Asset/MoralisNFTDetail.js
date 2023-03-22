import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MoralisAssetItem from "components/MoralisAssetItem";
import MoralisItem from "components/MoralisItem";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import Market_INFO from "artifacts/contracts/Marketplace.sol/FlokinomicsNFTMarketplace.json";
import reserveAuctionAbi from "../../services/smart-contract/reserveAuction.json";
import FixedSaleMarketPlaceAbi from "../../services/smart-contract/FixedSaleMarketPlace.json";
import Bid from "../../assets/img/icons/bid.png";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { NFT_MARKET_ADDRESS } from "../../constants";
import { parseUnits } from "@ethersproject/units";
import Axios from "axios";
import axios from "axios";
import Tabs from "./Tabs";
import Switch from "react-switch";
import "styles/activity.css";
import { toast } from "react-toastify";
import Countdown from "react-countdown";
import buyNFTabi from "../../services/smart-contract/AngeldustNFT";
import buyCollectionNFTabi from "../../services/smart-contract/ERC721";
import BlackListAbi from "../../services/smart-contract/black-list.json";

import Web3 from "web3";
import LoaderNew from "components/Loader-New";
import { Get_Profile_By_AccountId, getCollectionByIdApi, getSingleNFTApi, Update_NFTApi } from "apis";
import { RPC_URLS } from "../Header/connectors";
import { useDisconnect } from "hooks/useDisconnect";

function MoralisNFTDetail() {
  const location = useLocation();
  const nftDetail = location.state;
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isAdmin = localStorage.getItem("owner");
  const web3 = new Web3(Web3.givenProvider || window.etherum);

  const newContract = process.env.REACT_APP_Angeldust_NFT;
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const FixedSaleMarketPlace = process.env.REACT_APP_FIXED_MARKETPLACE;
  const abiFile = buyNFTabi.abi;
  const abiFileCollections = buyCollectionNFTabi.abi;
  const contractInstance = new web3.eth.Contract(abiFile, newContract);
  const reserveContractInstance = new web3.eth.Contract(
    reserveAuctionAbi.abi,
    reserveAuction
  );
  const isActive = localStorage.getItem("isActive");

  const { library, active, account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const { disconnectWalletConnect } = useDisconnect();
  const { id } = useParams();
  const bearerTokenId = useSelector((state) => state?.tokenData?.token);
  const [price, setPrice] = useState(0);
  const [user, setUser] = useState({
    account: accounts,
    avatar: "assets/img/avatars/avatar.jpg",
    ownerAvatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "User",
    lastName: "",
    nickName: "user",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });
  const [currentPrice, setCurrentPrice] = useState(0);
  const [auctionLength, setAuctionLength] = useState("12");
  const [isProcessing, setIsProcessing] = useState(false);
  const [item, setItem] = useState({
    name: "",
    description: "",
    owner_of: accounts || null,
    time: 0,
    saleType: null,
    likes: [],
    price: 0,
    paymentType: "BNB",
  });
  const [isSale, setIsSale] = useState(false);
  const [isBid, setIsBid] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [auctionInfo, setAuctionInfo] = useState(null);
  const [rate, setRate] = useState(10);
  const [showUpdate, setShowUpdate] = useState(false);
  const [newPrice, setNewPrice] = useState(item?.amount);
  const [saleType, setSaleType] = useState(item.saleType);
  const [enablePlaceBid, setEnablePlaceBid] = useState(false);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [chartOption] = useState({
    chart: {
      width: 380,
      type: "pie",
    },
    labels: ["Creator's Royalty", "Platform fee", "Seller"],
    theme: {
      monochrome: {
        enabled: true,
        color: "#0000ff",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            id: "pie-chart",
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });

  const dispatch = useDispatch();

  const dispatchNftItem = async (payload) => {

    try {
      const res = await dispatch({ type: "SET_SELECTED", payload });
      setItem(payload);
      setNewPrice(payload.price);
      setSaleType("Fixed");
    }
    catch (err) {
      console.log(err)
    }

  };


  const getItem = async (item_id) => {
    let nft_item = nftDetail;
    setIsLoading(false);
    let nftInfo = { data: {} };
    try {
      nftInfo = await Axios.get(nft_item.token_uri);
    } catch (err) {
      console.log(err);
    }

    dispatchNftItem({ id, ...user, ...nft_item, ...nftInfo.data });

    setIsSale(nft_item?.isSale);
    let auction_info;
    try {
      auction_info = await reserveContractInstance.methods
        .auctions(nft_item.token_address, parseInt(nft_item.token_id))
        .call();
    } catch (err) {
      console.log(err);
    }

    setAuctionInfo(auction_info);
    setAuctionLength(nft_item?.auctionDuration / 3600);

    if (active) {
      const contract = new Contract(
        NFT_MARKET_ADDRESS,
        Market_INFO.abi,
        library.getSigner()
      );
    }
  };

  const updateSale = async (lock = false) => {

    setIsProcessing(true);
    try {
      const userExist = await Get_Profile_By_AccountId(accounts, '');
      if (!userExist?.data?.nickName) {
        toast.error("Please update your profile first.");
        setIsProcessing(false);
        return;
      }
      if (!bearerTokenId) {
        return await disconnectWalletConnect();
      }
      let nftAddress;
      if (item.token_address != newContract) {
        nftAddress = item.token_address;
      } else {
        nftAddress = newContract;
      }
      let contract;
      let nftContract;
      if (mobileAccount == "true") {
        const web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(
          FixedSaleMarketPlaceAbi.abi,
          FixedSaleMarketPlace
        );

        nftContract = new web3.eth.Contract(abiFile, nftAddress);
      } else {
        contract = new web3.eth.Contract(
          FixedSaleMarketPlaceAbi.abi,
          FixedSaleMarketPlace
        );

        nftContract = new web3.eth.Contract(abiFile, nftAddress);
      }

      if (item.isSale) {
        if (item.token_id !== 0) {
          let signature;
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const contractInstance = new web3.eth.Contract(
              abiFile,
              newContract
            );
            const hash = await contractInstance.methods
              .getMessageHash(
                item.nonce,
                parseUnits(newPrice.toString()),
                item.token_uri
              )
              .call();
            const encodedhash = await contractInstance.methods
              .getEthSignedMessageHash(hash)
              .call();
            signature = await web3.eth.sign(encodedhash, accounts);
          } else {
            const hash = await contractInstance.methods
              .getMessageHash(
                item.nonce,
                parseUnits(newPrice.toString()),
                item.token_uri
              )
              .call();
            const encodedhash = await contractInstance.methods
              .getEthSignedMessageHash(hash)
              .call();
            signature = await web3.eth.sign(encodedhash, accounts);
          }
          if (signature) {
            setItem({
              ...item,
              price: 0,
              saleType: "Fixed",
              isSale: false,
              time: 0,
            });

            const updateReq = {
              isSale: false,
              price: 0,
              signature: signature
            };
            await Update_NFTApi(bearerTokenId, updateReq, id);
            setShowUpdate(false);
            setIsProcessing(false);
          }
        }
        if (item.token_id !== 0 && !item.isFirstSale) {
          const res = await contract.methods
            .putOffSale(nftAddress, item.token_id)
            .send({ from: accounts });
          if (res) {
            setItem({
              ...item,
              price: 0,
              saleType: "Fixed",

              isSale: false,
              time: 0,
            });
            setShowUpdate(false);
            setIsProcessing(false);
          }
        }
        setItem({
          ...item,
          isSale: false,
          time: 0,
          saleType: "Fixed",
        });
        getItem()
        toast.success("Delisted from marketplace successfully");
        setShowUpdate(false);
        setIsProcessing(false);
      } else {

        if (newPrice <= 0) {
          toast.error("Price should not be zero.");
          setIsProcessing(false);
          return;
        }

        if (saleType === "Auction") {
          await startAuction();
        } else {

          let res;
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const nftContract = new web3.eth.Contract(abiFile, nftAddress);
            const isApproved = await nftContract.methods
              .isApprovedForAll(accounts, FixedSaleMarketPlace)
              .call();
            if (!isApproved) {
              await nftContract.methods
                .setApprovalForAll(FixedSaleMarketPlace, true)
                .send({ from: accounts });
            }
            res = await contract.methods
              .putOnSale(
                nftAddress,
                item.token_id,
                accounts,
                parseUnits(newPrice.toString())
              )
              .send({ from: accounts });
          } else {
            const isApproved = await nftContract.methods
              .isApprovedForAll(accounts, FixedSaleMarketPlace)
              .call();
            if (!isApproved) {
              await nftContract.methods
                .setApprovalForAll(FixedSaleMarketPlace, true)
                .send({ from: accounts });
            }
            res = await contract.methods
              .putOnSale(
                item.token_address,
                item.token_id,
                accounts,
                parseUnits(newPrice.toString())
              )
              .send({ from: accounts });
          }

          if (res) {

            setItem({
              ...item,
              price: parseFloat(newPrice),
              saleType: "Fixed",

              isSale: true,
              time: 0,
            });
            history.push("/explore");
            toast.success("Listed on marketplace successfully");
            setShowUpdate(false);
            setIsProcessing(false);
          }

        }
      }
    } catch (err) {
      setIsSale((prev) => !prev);
      setShowUpdate(false);
      toast.error("Fail to update ");
      setIsProcessing(false);
    }
  };

  const showUpdates = async () => {
    setAuctionLength("12");
    if (isSale && !showUpdate) updateSale(true);
    setShowUpdate(!isSale);
    setIsSale((prev) => !prev);
  };

  useEffect(async () => {
    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  const buyNft = async () => {

    if (active || mobileAccount == "true") {
      setIsProcessing(true);
      try {
        const userExist = await Get_Profile_By_AccountId(accounts, '');

        if (!userExist?.data?.nickName) {
          toast.error("Please update your profile first.");
          setIsProcessing(false);
          return;
        }
        if (!bearerTokenId) {
          return await disconnectWalletConnect();
        }

        const { price, id, collectionAddress } = item;

        const abi = buyNFTabi.abi;

        const web3 = new Web3(window.ethereum);

        const buContract = new web3.eth.Contract(abi, collectionAddress);
        let isMinted = await buContract.methods.mintedNonce(item.nonce).call();
        if (item.isFirstSale == true && !isMinted) {
          let resFirstSale;
          if (mobileAccount == "true") {
            const voucher = [
              item.nonce,
              parseUnits(price.toString()),
              item.token_uri,
              item.signature,
              item.royalties,
            ];
            resFirstSale = await buContract.methods
              .LazyMint(item.creator, voucher)
              .send({ from: accounts, value: currentPrice.toString() });
          } else {
            const buContract = new web3.eth.Contract(abi, collectionAddress);
            const voucher = [
              item.nonce,
              parseUnits(price.toString()),
              item.token_uri,
              item.signature,
              item.royalties,
            ];
            resFirstSale = await buContract.methods
              .LazyMint(item.creator, voucher)
              .send({
                from: accounts,
                value: parseUnits(currentPrice.toString()),
              });
          }

          if (resFirstSale) {
            let nftId = 0;

            const events = resFirstSale?.events;
            if (events.Transfer.length > 0) {
              nftId = parseInt(events.Transfer[0].returnValues.tokenId);

              const updateReq = {
                isSale: false,
                price: parseFloat(newPrice),
                tokenId: nftId,
                collectionAddress: item.token_address
              };

              await Update_NFTApi(bearerTokenId, updateReq, id);
            }

            setIsProcessing(false);
            setIsAccept(false);
            getItem()
            toast.success("You bought a NFT successfully");
            history.push(`/item/${item.token_address}/${id}`);
          }
        } else {
          let resultFixSale;
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(
              FixedSaleMarketPlaceAbi.abi,
              FixedSaleMarketPlace
            );

            resultFixSale = await contract.methods
              .buy(collectionAddress, item.token_id)
              .send({
                from: accounts,
                value: parseUnits(currentPrice.toString()),
              });
          } else {
            const contract = new web3.eth.Contract(
              FixedSaleMarketPlaceAbi.abi,
              FixedSaleMarketPlace
            );

            resultFixSale = await contract.methods
              .buy(collectionAddress, item.token_id)
              .send({
                from: accounts,
                value: parseUnits(currentPrice.toString()),
              });
          }

          let nftId = 0;

          const events = resultFixSale?.events;
          if (events) {
            nftId = parseInt(events.Sold.returnValues.tokenId);
            const updateReq = {
              isSale: false,
              price: parseFloat(newPrice),
              tokenId: nftId,
              collectionAddress: item.token_address
            };

            await Update_NFTApi(bearerTokenId, updateReq, id);
          }

          setIsProcessing(false);
          setIsAccept(false);
          getItem()
          toast.success("You bought a NFT successfully");
          history.push(`/item/${item.token_address}/${id}`);
        }
      } catch (err) {
        console.log(err);
        toast.error(
          err?.data?.message ? err.data.message : "Failed to buy NFT"
        );
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
      setIsProcessing(false);
    }
  };

  const buyCollectionNft = async () => {

    if (active || mobileAccount == "true") {
      setIsProcessing(true);
      try {
        const userExist = await Get_Profile_By_AccountId(accounts, '');
        if (!userExist?.data?.nickName) {
          // await creatProfile(accounts);
          toast.error("Please update your profile first.");
          setIsProcessing(false);
          return;
        }
        if (!bearerTokenId) {
          return await disconnectWalletConnect();
        }

        const { token_id, id } = item;

        let res;

        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const collectionContractInstance = new web3.eth.Contract(
            abiFileCollections,
            item.token_address
          );

          res = await collectionContractInstance.methods
            .mint(token_id)
            .send({ from: accounts, value: parseUnits(currentPrice) });
        } else {
          const collectionContractInstance = new web3.eth.Contract(
            abiFileCollections,
            item.token_address
          );

          res = await collectionContractInstance.methods
            .mint(token_id)
            .send({ from: accounts, value: parseUnits(currentPrice) });
        }

        let nftId = 0;
        let uri;
        const events = res?.events;
        if (events.Transfer.length > 0) {
          nftId = parseInt(events.Transfer[0].returnValues.tokenId);
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const collectionContractInstance = new web3.eth.Contract(
              abiFileCollections,
              item.token_address
            );
            uri = await collectionContractInstance.methods
              .tokenURI(nftId)
              .call();
          } else {
            const collectionContractInstance = new web3.eth.Contract(
              abiFileCollections,
              item.token_address
            );
            uri = await collectionContractInstance.methods
              .tokenURI(nftId)
              .call();
          }

          const updateReq = {
            isSale: false,
            price: parseFloat(newPrice),
            tokenId: nftId,
            collectionAddress: item.token_address
          };

          await Update_NFTApi(bearerTokenId, updateReq, id);
        }

        dispatchNftItem({
          ...item,
          token_id: parseInt(nftId),
          isSale: false,
          isFirstSale: false,
          owner_of: accounts,
          time: 0,
          saleType: "Fixed",
        });
        setIsSale(false);
        setIsProcessing(false);
        setIsAccept(false);
        getItem()
        toast.success("You bought a NFT successfully");
        history.push(`/item/${item.token_address}/${id}`);
      } catch (err) {
        console.log(err);
        toast.error(
          err?.data?.message ? err.data.message : "Failed to buy NFT"
        );
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
      setIsProcessing(false);
    }
  };

  const bidNft = async () => {
    if (active || mobileAccount == "true") {
      if (price < currentPrice || parseFloat(price) < currentPrice * 1.1) {
        toast.error("Bid amount must not less than minimum bid");
        return;
      }
      setIsProcessing(true);

      try {
        const userExist = await Get_Profile_By_AccountId(accounts, '');

        if (!userExist?.data?.nickName) {
          toast.error("Please update your profile first.");
          setIsProcessing(false);
          return;
        }
        const { token_id, paymentType } = item;
        let res;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );

          res = await contract.methods
            .createBid(
              item.token_address,
              token_id,
              parseUnits(price.toString())
            )
            .send({
              from: accounts,
              value: parseUnits(price.toString()),
            });
        } else {
          const contract = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );

          res = await contract.methods
            .createBid(
              item.token_address,
              token_id,
              parseUnits(price.toString())
            )
            .send({
              from: accounts,
              value: parseUnits(price.toString()),
            });
        }

        if (res) {
          let auction_info;
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const contracts = new web3.eth.Contract(
              reserveAuctionAbi.abi,
              reserveAuction
            );
            auction_info = await contracts.methods
              .auctions(item.token_address, token_id)
              .call();
          } else {
            const contracts = new web3.eth.Contract(
              reserveAuctionAbi.abi,
              reserveAuction
            );
            auction_info = await contracts.methods
              .auctions(item.token_address, token_id)
              .call();
          }

          setAuctionInfo(auction_info);

          dispatchNftItem({
            ...item,
            price: parseFloat(price),
            saleType: "Auction",
            time:
              (parseInt(auction_info.duration) +
                parseInt(auction_info.firstBidTime)) *
              1000,
          });
          setAuctionInfo(null);
          setIsAccept(false);
          toast.success("You have placed bid this auction");
          setIsBid(false);
          setIsProcessing(false);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to bid auction");
        setIsBid(false);
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
    }
  };

  const startAuction = async () => {

    if (active || mobileAccount == "true") {
      setIsProcessing(true);
      try {
        const { token_id, tokenURI, paymentType } = item;
        const auction_length = parseInt(auctionLength) * 3600;

        let curatorFeePercent = 20;
        let nftAddress;
        if (item.token_address != newContract) {
          nftAddress = item.token_address;
        } else {
          nftAddress = newContract;
        }

        let curator;
        let approve;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const reserveContractInstance = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );
          curator = await reserveContractInstance.methods
            .brokerAddress()
            .call();
          const contractInstanceNFT = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            nftAddress
          );
          approve = await contractInstanceNFT.methods
            .approve(reserveAuction, token_id)
            .send({ from: accounts });
        } else {


          curator = await reserveContractInstance.methods
            .brokerAddress()
            .call();
          const contractInstanceNFT = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            nftAddress
          );
          approve = await contractInstanceNFT.methods
            .approve(reserveAuction, token_id)
            .send({ from: accounts });
        }
        if (approve) {
          let res;
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const reserveContractInstance = new web3.eth.Contract(
              reserveAuctionAbi.abi,
              reserveAuction
            );
            res = await reserveContractInstance.methods
              .createAuction(
                item.token_address,
                token_id,
                auction_length,
                parseUnits(newPrice.toString()),
                accounts
              )
              .send({ from: accounts });
          } else {
            res = await reserveContractInstance.methods
              .createAuction(
                item.token_address,
                token_id,
                auction_length,
                parseUnits(newPrice.toString()),
                accounts
              )
              .send({ from: accounts });
          }

          if (res) {
            let nftId = 0;
            const events = res?.events;
            if (events) {
              nftId = parseInt(events.AuctionCreated.returnValues.tokenId);
              dispatchNftItem({
                ...item,
                isSale: true,
                saleType: "Auction",
                auctionLength: auction_length,
                auctionCreator: accounts,
                token_id: parseInt(nftId),
                time: 0,
                price: parseFloat(newPrice),
              });
              setShowUpdate(false);
              setIsProcessing(false);
              setIsAccept(false);
              toast.success("You create an auction");
              history.push("/explore");
            }
          }
        }
      } catch (err) {
        toast.error("Failed to create auction");
        showUpdates()
        setShowUpdate(false);
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first");
      setIsProcessing(false);
    }
  };

  const cancelAuction = async () => {
    if (active || mobileAccount == "true") {
      setIsProcessing(true);
      try {
        const contract = new web3.eth.Contract(
          reserveAuctionAbi.abi,
          reserveAuction
        );
        let nftAddress;
        if (item.token_address != newContract) {
          nftAddress = item.token_address;
        } else {
          nftAddress = newContract;
        }
        const { token_id } = item;
        let res;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const contractProvider = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );
          res = await contractProvider.methods
            .cancelAuction(nftAddress, token_id)
            .send({ from: accounts });
        } else {
          res = await contract.methods
            .cancelAuction(nftAddress, token_id)
            .send({ from: accounts });
        }
        if (res) {
          dispatchNftItem({
            ...item,
            saleType: "Fixed",
            time: 0,
            auctionCreator: null,
            isSale: false,
          });
          setIsSale(false);
          setAuctionInfo(null);
          getItem()
          toast.success("Auction is canceled");
          setIsProcessing(false);
          setIsAccept(false);
        }
      } catch (err) {
        toast.error("Failed to cancel auction");
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first");
    }
  };

  const endAuction = async () => {
    if (active || mobileAccount == "true") {
      setIsProcessing(true);
      try {
        let nftAddress;
        if (item.token_address != newContract) {
          nftAddress = item.token_address;
        } else {
          nftAddress = newContract;
        }
        const { token_id } = item;
        let isApproved;
        let res;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );
          const nftContract = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            nftAddress
          );
          isApproved = await nftContract.methods
            .isApprovedForAll(accounts, reserveAuction)
            .call();
          res = await contract.methods
            .endAuction(nftAddress, token_id)
            .send({ from: accounts });
          if (!isApproved) {
            const approve = await nftContract.methods.setApprovalForAll(
              reserveAuction,
              true
            );
          }
        } else {
          const contract = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );
          const nftContract = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            nftAddress
          );
          isApproved = await nftContract.methods
            .isApprovedForAll(accounts, reserveAuction)
            .call();
          res = await contract.methods
            .endAuction(nftAddress, token_id)
            .send({ from: accounts });
          if (!isApproved) {
            const approve = await nftContract.methods.setApprovalForAll(
              reserveAuction,
              true
            );
          }
        }

        if (res) {
          let nftId = 0;
          const events = res?.events;
          if (events) {
            nftId = parseInt(events.AuctionEnded.returnValues.token_id);
            let auction_info;
            if (mobileAccount == "true") {
              const web3 = new Web3(provider);
              const reserveContractInstance = new web3.eth.Contract(
                reserveAuctionAbi.abi,
                reserveAuction
              );
              auction_info = await reserveContractInstance.methods
                .auctions(item.token_address, parseInt(nftId))
                .call();
            } else {
              auction_info = await reserveContractInstance.methods
                .auctions(item.token_address, parseInt(nftId))
                .call();
            }
            setAuctionInfo(auction_info);
            dispatchNftItem({
              ...item,
              saleType: "Fixed",
              time: 0,
              auctionLength: null,
              auctionCreator: null,
              isSale: false,
              auctionInfo: null,
              owner_of: item.auctionInfo,
            });
            setIsSale(false);
            setAuctionInfo(null);
            setIsAccept(false);
            getItem()
            toast.success("Auction is completed");
            setIsProcessing(false);
          }
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to complete auction");
        setIsProcessing(false);
      }
    } else {
      toast.error("Please connect your wallet first.");
    }
  };

  useEffect(() => {
    updatePrice(item.paymentType);
  }, [item.paymentType]);

  const updatePrice = (_newPaymentType) => {
    const token = _newPaymentType === "BNB" ? "binancecoin" : "flokinomics";
    axios
      .get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`
      )
      .then((res) => {
        if (res.status === 200) {
          const cur_rate = res.data[token]?.usd;
          if (cur_rate) setRate(cur_rate);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getItem(id);
  }, [active, id]);

  const hasDecimal = (num) => {
    return !!(num % 1);
  };
  useEffect(() => {
    let ethprice = null;
    if (hasDecimal(item?.price)) {
      ethprice = item?.price;
    } else {
      ethprice = item?.price && web3.utils.fromWei(item?.price?.toString(), "ether");
    }
    if (auctionInfo && parseFloat(auctionInfo?.amount) > 0) {
      setCurrentPrice(ethprice);
    } else setCurrentPrice(ethprice);
  }, [item?.amount, auctionInfo]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    return (
      <div
        style={{
          textAlign: "center",
          color: "white",
          marginTop: 10,
          fontSize: 18,
        }}
      >
        {days} Days {hours}:{minutes}:{seconds}
      </div>
    );
  };

  return isLoading ? (
    <LoaderNew />
  ) : (
    <main className="main">
      <div className="hero_common creator_hero_main mt-3">
        <div className="hero_border pb-5">
          <div className="container">
            {/* <div className="row mt-5">
              <div className="col-lg-6 col-md-6 col-6">
                <div className="main__title main__title--page mt-0">
                  <h1 className="ml-0 collect_detail_username">{item.name}</h1>

                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-6 mob_right_btn">
                <div disabled={true}>
                  <div className="col-lg-6 col-md-6 col-6">
                  </div>
                  <p className="sign__text mb-0 d-flex justify-content-end mt-md-2 mt-0">
                    <span className="mt-0 pr-3">For sale:</span>

                    <Switch
                      onChange={showUpdates}
                      checked={isSale}
                      disabled={
                        item?.owner_of?.toLowerCase() !== accounts?.toLowerCase() || item.time > 0
                      }
                      height={26}
                    />
                  </p>
                </div>
              </div>
            </div> */}

            <div className="row detail_nft_card">
              <div className="col-12 col-md-5 cardAssetPreview">
                <MoralisAssetItem data={item} />

              </div>

              {/* <!-- sidebar --> */}
              <div className="col-12 col-md-7 bleuFrosted cardAssetDetails">
                <div className="asset__info">
                  <div className="asset__wrap">
                    {/* <div className="row"> */}
                      <div className="main__title main__title--page mt-0">
                        <h1 className="ml-0 collect_detail_username">{item.name}</h1>
                          <p className="create_title">
                          Created by <span> 051_Hart </span>
                          </p>
                      </div>
                      <div className="asset__desc mt-4 asset_height_detail">
                        <span className="cardAssetDetailsLabel">Description</span>
                        <p>{item.description}</p>
                      </div>
                      {/* <div className="col-md-6 col-sm-6 col-12">
                        {saleType == "Fixed" ? (
                          <div className="asset__timer">
                            {item.saleType !== "Fixed" &&
                              (item.time > 0 ? (
                                <>
                                  <span>
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M18.3,8.59l.91-.9a1,1,0,0,0-1.42-1.42l-.9.91a8,8,0,0,0-9.79,0l-.91-.92A1,1,0,0,0,4.77,7.69l.92.91A7.92,7.92,0,0,0,4,13.5,8,8,0,1,0,18.3,8.59ZM12,19.5a6,6,0,1,1,6-6A6,6,0,0,1,12,19.5Zm-2-15h4a1,1,0,0,0,0-2H10a1,1,0,0,0,0,2Zm3,6a1,1,0,0,0-2,0v1.89a1.5,1.5,0,1,0,2,0Z" />
                                    </svg>{" "}
                                    Auction ends in
                                  </span>
                                  <div className="card__clock">
                                    <Countdown
                                      date={Number(item.time)}
                                      renderer={renderer}
                                    />
                                  </div>
                                </>
                              ) : (
                                <div className="sign__group">
                                </div>
                              ))}
                          </div>
                        ) : null}
                      </div>

                      <div className="col-md-6 col-sm-6 col-12 text-md-center">
                        <div className="asset__price">
                          {item.isSale ? (
                            <span>
                              <img src={Bid} className="mr-1" alt="Image" />{" "}
                              {item.saleType === "Fixed"
                                ? "Price"
                                : "Minimum bid"}
                            </span>
                          ) : (
                            <h4>Not Listed For Sale</h4>
                          )}
                          {item.isSale && (
                            <p className="bid_amount">
                              <span className="bnb_price">
                                {parseFloat(currentPrice)} {item.paymentType}{" "}
                              </span>
                              <span className="usd_price">
                                {" "}
                                (${(parseFloat(currentPrice) * rate).toFixed(
                                  4
                                )}{" "}
                                USD)
                              </span>
                            </p>
                          )}
                          {item.isSale && (
                            <div className="pie-chart">
                              <div className="relative">
                                <ApexCharts
                                  options={chartOption}
                                  series={[
                                    (item.royalties) / 100,
                                    item.paymentType === "BNB" ? 5 : 3,
                                    100 -
                                    (item.royalties) / 100 -
                                    (item.paymentType === "BNB" ? 5 : 3),
                                  ]}
                                  type="pie"
                                  width={380}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div> */}
                    {/* </div> */}

                    {/* <div className="row">
                      <div className="col-md-12 col-12">
                        {isSale &&
                          !(
                            accounts?.toLowerCase() == item.owner_of?.toLowerCase()
                          ) &&
                          (isActive == "true" || mobileAccount == "true") &&
                          isAdmin == "false" && (
                            <>
                              <div className="sign__group filter__checkboxes mb-1 mt-3">
                                <input
                                  id="private"
                                  type="checkbox"
                                  name="private"
                                  checked={isAccept}
                                  onChange={() => {
                                    setIsAccept(!isAccept);
                                  }}
                                />
                                <label
                                  className="sign__label"
                                  htmlFor="private"
                                >
                                  I agree to the
                                  <a
                                    href="assets/terms/Terms and Conditions for Purchasers.pdf"
                                    target="_blank"
                                    className="ml-1 linkTerms"
                                  >
                                    Terms and conditions
                                  </a>
                                </label>
                              </div>
                              {isAccept && (
                                <div className="asset__btns">
                                  {item.saleType === "Fixed" &&
                                    item.owner_of?.toLowerCase() != accounts?.toLowerCase() ? (
                                    <button
                                      className="asset__btn asset__btn asset__btn--clr mx-auto"
                                      onClick={async () => {
                                        if (
                                          item.token_address?.toLowerCase() !==
                                          newContract?.toLowerCase()
                                        ) {
                                          buyCollectionNft();
                                        } else {
                                          buyNft();
                                        }
                                      }}
                                    >
                                      {isProcessing ? "Waiting..." : "Buy"}
                                    </button>
                                  ) : auctionInfo?.bidder ==
                                    "0x0000000000000000000000000000000000000000" ? (
                                    <button
                                      disabled={false}
                                      className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0"
                                      onClick={() => {
                                        setIsBid(true);
                                      }}
                                    >
                                      Place a bid
                                    </button>
                                  ) : item.time >=
                                    parseInt(new Date().getTime()) ? (
                                    <>
                                      {!(
                                        auctionInfo &&
                                        auctionInfo?.owner_of?.toLowerCase() === accounts?.toLowerCase()
                                      ) && (
                                          <button
                                            disabled={
                                              isProcessing ||
                                              item.time <
                                              parseInt(new Date().getTime()) ||
                                              (auctionInfo &&
                                                auctionInfo?.owner_of?.toLowerCase() ===
                                                accounts.toLowerCase()) ||
                                              (auctionInfo &&
                                                auctionInfo?.bidder?.toLowerCase() === accounts?.toLowerCase())
                                            }
                                            className={(auctionInfo &&
                                              auctionInfo?.bidder?.toLowerCase() === accounts?.toLowerCase()) ? "asset__btn asset__btn--full asset__btn--clr open-modal mr-0" : "asset__btn asset__btn--full asset__btn--clr open-modal mr-0 createbtn"}
                                            onClick={() => {
                                              setPrice(0)
                                              setEnablePlaceBid(false)
                                              setIsBid(true);
                                            }}
                                          >
                                            Place a bid
                                          </button>
                                        )}

                                      {((auctionInfo &&
                                        auctionInfo?.owner_of?.toLowerCase() === accounts?.toLowerCase()) ||
                                        (auctionInfo &&
                                          auctionInfo?.bidder?.toLowerCase() === accounts?.toLowerCase())) &&
                                        item.time <
                                        parseInt(new Date().getTime()) && (
                                          <button
                                            disabled={isProcessing}
                                            className="asset__btn asset__btn--full asset__btn--clr"
                                            onClick={endAuction}
                                          >
                                            {isProcessing
                                              ? "Waiting..."
                                              : "Claim NFT"}
                                          </button>
                                        )}
                                    </>
                                  ) : auctionInfo?.bidder?.toLowerCase() ==
                                    accounts?.toLowerCase() ? (
                                    <button
                                      disabled={isProcessing}
                                      className="asset__btn asset__btn--full asset__btn--clr"
                                      onClick={endAuction}
                                    >
                                      {isProcessing
                                        ? "Waiting..."
                                        : "End Auction"}
                                    </button>
                                  ) : (
                                    <button
                                      disabled={true}
                                      className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0"
                                    >
                                      {isProcessing
                                        ? "Waiting..."
                                        : "Auction Completed"}
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}

                        {isSale &&
                          item.saleType == "Auction" &&
                          (accounts?.toLowerCase() == item.owner_of?.toLowerCase() || isAdmin == "true") && (
                            <>
                              <div className="sign__group filter__checkboxes mb-1 mt-3">
                                <input
                                  id="private"
                                  type="checkbox"
                                  name="private"
                                  checked={isAccept}
                                  onChange={() => {
                                    setIsAccept(!isAccept);
                                  }}
                                />
                                <label
                                  className="sign__label"
                                  htmlFor="private"
                                >
                                  I agree to the
                                  <a
                                    href="assets/terms/Terms and Conditions for Purchasers.pdf"
                                    target="_blank"
                                    className="ml-1 linkTerms"
                                  >
                                    Terms and conditions
                                  </a>
                                </label>
                              </div>
                              {isAccept && (
                                <div className="asset__btns">
                                  {auctionInfo?.bidder ==
                                    "0x0000000000000000000000000000000000000000" ? (
                                    <>
                                      {auctionInfo &&
                                        auctionInfo?.owner_of?.toLowerCase() === accounts?.toLowerCase() &&
                                        auctionInfo &&
                                        parseInt(auctionInfo?.amount) === 0 ? (
                                        <button
                                          disabled={isProcessing}
                                          className="asset__btn asset__btn--full asset__btn--clr"
                                          onClick={cancelAuction}
                                        >
                                          {isProcessing
                                            ? "Waiting..."
                                            : "Cancel Auction"}
                                        </button>
                                      ) : item.time == 0 &&
                                        item.owner_of?.toLowerCase() == accounts?.toLowerCase() ? (
                                        <button
                                          disabled={true}
                                          className="asset__btn asset__btn--full asset__btn--clr"
                                          onClick={endAuction}
                                        >
                                          {isProcessing
                                            ? "Waiting..."
                                            : "End Auction"}
                                        </button>
                                      ) : item.time == 0 &&
                                        isAdmin == "true" ? (
                                        <button
                                          disabled={true}
                                          className="asset__btn asset__btn--full asset__btn--clr"
                                          onClick={cancelAuction}
                                        >
                                          {isProcessing
                                            ? "Waiting..."
                                            : "Cancel Auction"}
                                        </button>
                                      ) : null}
                                    </>
                                  ) : item.time <
                                    parseInt(new Date().getTime()) ? (
                                    <button
                                      disabled={isProcessing}
                                      className="asset__btn asset__btn--full asset__btn--clr"
                                      onClick={endAuction}
                                    >
                                      {isProcessing
                                        ? "Waiting..."
                                        : "End Auction"}
                                    </button>
                                  ) : (
                                    <button
                                      disabled={true}
                                      className="asset__btn asset__btn--full asset__btn--clr"
                                    >
                                      Auction is started
                                    </button>
                                  )}
                                </div>
                              )}
                            </>
                          )}
                      </div>
                    </div> */}
                  </div>

                  {/* <div className="border_card">
                    <MoralisItem data={item} />
                  </div> */}

                  <div className="border_card">
                    <div className="itemActivity">
                      <Tabs
                        historyData={item?.historyDetails}
                        bidsData={item?.historyDetails}
                        item={item}
                        docId={id}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* <!-- end sidebar --> */}
            </div>
          </div>
        </div>
        {showUpdate && (
          <div className="mfp-wrap">
            <div className="mfp-container">
              <div className="mfp-backdrop" onClick={showUpdates}></div>
              <div className="zoom-anim-dialog mfp-preloader modal modal--form not_sale_popup">
                <button className="modal__close" onClick={showUpdates}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                  </svg>
                </button>
                <h4 className="sign__title">List For Sale</h4>
                <div className="sign__group sign__group--row">
                  <label className="sign__label" htmlFor="saleType">
                    Sale Type:
                  </label>
                  {item.token_id == 0 ?
                    (<select
                      id="saleType"
                      name="saleType"
                      className="sign__select "
                      value={saleType}
                      onChange={(e) => setSaleType(e.target.value)}
                    >
                      <option value="Fixed">Fixed Price</option>
                    </select>
                    ) :
                    (<select
                      id="saleType"
                      name="saleType"
                      className="sign__select height-sm mt-0 mb-4"
                      value={saleType}
                      onChange={(e) => {
                        setNewPrice(item?.amount);
                        setSaleType(e.target.value);
                      }}
                    >
                      <option value="Fixed">Fixed</option>
                      <option value="Auction">Auction</option>
                    </select>
                    )}
                  {saleType === "Auction" && (
                    <div className="sign__group">
                      <label className="sign__label" htmlFor="length">
                        Auction Length
                      </label>
                      <select
                        id="length"
                        name="length"
                        className="sign__select"
                        value={auctionLength}
                        onChange={(e) => setAuctionLength(e.target.value)}
                      >
                        <option value="12">12 hours</option>
                        <option value="24">24 hours</option>
                        <option value="48">2 days</option>
                        <option value="72">3 days</option>
                        <option value="168">7 days</option>
                      </select>
                    </div>
                  )}
                  <label className="sign__label" htmlFor="updatePrice">
                    {saleType === "Fixed" ? "Update" : "First"} Price:
                  </label>
                  <input
                    id="updatePrice"
                    type="number"
                    name="updatePrice"
                    className="sign__input height-sm"
                    placeholder="Type update price."
                    value={newPrice || 0}
                    onChange={(e) => {
                      setNewPrice(e.target.value);
                    }}
                  />
                </div>
                <button
                  className="sale_btn highlightHover"
                  onClick={() => {
                    updateSale(false);
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Waiting..." : "List for sale"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isBid && (
          <div className="mfp-wrap">
            <div className="mfp-container">
              <div
                className="mfp-backdrop"
                onClick={() => {
                  setIsBid(false);
                }}
              ></div>
              <div className="zoom-anim-dialog mfp-preloader modal modal--form">
                <button
                  className="modal__close"
                  onClick={() => {
                    setIsBid(false);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                  </svg>
                </button>
                <h4 className="sign__title">Place a bid</h4>
                <div className="sign__group sign__group--row">
                  <label className="sign__label" htmlFor="placebid">
                    Your bid
                  </label>
                  <input
                    id="placebid"
                    type="number"
                    value={price}
                    maxLength={5}
                    placeholder={`Place your highest bid in ${item.paymentType}.`}
                    className="sign__input"
                    onChange={(e) => {
                      if (e.target.value > item.amount) {
                        setEnablePlaceBid(true);
                      } else {
                        setEnablePlaceBid(false);
                      }
                      setPrice(e.target.value);
                    }}
                  />
                  <span className="sign__text sign__text--small">
                    Price in USD : {price * rate}
                  </span>
                  <span className="sign__text sign__text--small">
                    Minimum bid in BNB : {currentPrice}
                  </span>
                </div>
                <button
                  className={enablePlaceBid ? "sale_btn" : "sign__btn"}
                  onClick={bidNft}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Waiting..." : "Place bid"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MoralisNFTDetail;

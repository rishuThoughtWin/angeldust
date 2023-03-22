import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AssetItem from "components/AssetItem";
import AssetAuthor from "components/AssetAuthor";
import { Link, useHistory, useParams } from "react-router-dom";
import ApexCharts from "react-apexcharts";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import Market_INFO from "artifacts/contracts/Marketplace.sol/FlokinomicsNFTMarketplace.json";
import reserveAuctionAbi from "../../services/smart-contract/reserveAuction.json";
import FixedSaleMarketPlaceAbi from "../../services/smart-contract/FixedSaleMarketPlace.json";
import Bid from "../../assets/img/icons/bid.png";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { AWS_IMAGE_PATH, NFT_MARKET_ADDRESS } from "../../constants";
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

function Item() {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isAdmin = localStorage.getItem("owner");
  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const newContract = process.env.REACT_APP_Angeldust_NFT;
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const FixedSaleMarketPlace = process.env.REACT_APP_FIXED_MARKETPLACE;
  const blacklistAddress = process.env.REACT_APP_BLACK_LIST_MANAGER;
  const blackListContract = new web3.eth.Contract(
    BlackListAbi.abi,
    blacklistAddress
  );
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
  const { id, collectionAddress } = useParams();
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
    time: 0,
    isSale: false,
    owner: null,
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
  const [newPrice, setNewPrice] = useState(item.price);
  const [saleType, setSaleType] = useState(item.saleType);
  const [bidderAmount, setBidderAmount] = useState(0);
  const [enablePlaceBid, setEnablePlaceBid] = useState(false);
  const [collectionName, setCollectionName] = useState(null);
  const [collectionID, setCollectionID] = useState(null);
  const [provider, setProvider] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [collectionOnSale, setCollectionOnSale] = useState()
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
      setNewPrice(payload?.price);
      setSaleType("Fixed");
    }
    catch (err) {
      console.log(err)
    }
  };

  const getItem = async (item_id) => {
    const res = await getSingleNFTApi(collectionAddress, id);
    let nft_item = res?.data?.data;
    const collectionRes = await getCollectionByIdApi(collectionAddress);
    const collectionInfo = collectionRes?.data?.data[0];
    if (collectionInfo) {
      setCollectionOnSale(nft_item?.collectionOnSale)
      setCollectionID(collectionInfo?._id);
      setCollectionName(collectionInfo?.name);
      setIsLoading(false);
    }
    setIsLoading(false);
    let nftInfo = { data: {} };
    try {
      // nftInfo = await Axios.get(nft_item.tokenURI);
      if (nft_item?.awsImage) {
        const awsImage = nft_item?.awsImage?.webp['400X400']
        nftInfo = `${AWS_IMAGE_PATH}${awsImage}`
        const image = { image: nftInfo }
        dispatchNftItem({ id, ...user, ...nft_item, ...image });
      }
      else if (nft_item?.image) {
        dispatchNftItem({ id, ...user, ...nft_item })
      }
      else {
        nftInfo = await Axios.get(nft_item.tokenURI)
        let imgurl = null
        if (!nftInfo?.data?.image?.includes("bleufi.mypinata.cloud")) {
          if (nftInfo?.data?.image?.includes("ipfs://")) {
            imgurl = nftInfo?.data?.image?.replace("ipfs://", 'https://bleufi.mypinata.cloud/ipfs/')
          } else {
            imgurl = nftInfo?.data?.image
          }
        } else {
          imgurl = nftInfo.data.image
        }
        dispatchNftItem({ id, ...user, ...nft_item, image: imgurl });
      }
    } catch (err) {
      console.log(err);
    }

    setIsSale(nft_item?.isSale);
    let auction_info;
    try {
      auction_info = await reserveContractInstance.methods
        .auctions(nft_item.collectionAddress, parseInt(nft_item.tokenId))
        .call();
    } catch (err) {
      console.log(err);
    }
    setAuctionInfo(auction_info);
    if (auction_info?.amount == "0x0000000000000000000000000000000000000000") {
      setBidderAmount(web3.utils.fromWei(auction_info?.amount.toString(), "ether"))
    }
    if (nft_item?.auctionDuration > 6048) setAuctionLength(nft_item?.auctionDuration / 3600);
    else setAuctionLength(nft_item?.auctionDuration / 36);
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
      if (item.collectionAddress != newContract) {
        nftAddress = item.collectionAddress;
      } else {
        nftAddress = newContract;
      }
      let contract;
      let nftContract;
      if (mobileAccount == "true") {
        const web3 = new Web3(provider);
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
        if (item.tokenId == 0) {
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
                item.tokenURI,
                item.royalties
              )
              .call();
            const encodedhash = await contractInstance.methods
              .getEthSignedMessageHash(hash)
              .call();
            signature = await web3.eth.personal.sign(hash, accounts);
          } else {
            const hash = await contractInstance.methods
              .getMessageHash(
                item.nonce,
                parseUnits(newPrice.toString()),
                item.tokenURI,
                item.royalties
              )
              .call();
            const encodedhash = await contractInstance.methods
              .getEthSignedMessageHash(hash)
              .call();
            signature = await web3.eth.personal.sign(hash, accounts);
          }
          if (signature) {
            const updateReq = {
              isSale: false,
              price: parseFloat(newPrice.toString()),
              signature: signature
            };
            await Update_NFTApi(bearerTokenId, updateReq, id);
            setShowUpdate(false);
            setIsProcessing(false);
            dispatchNftItem({
              ...item,
              isSale: false,
              time: 0,
              saleType: "Fixed",
            });
            setIsSale(false);

            toast.success("Delisted from marketplace successfully");
            setShowUpdate(false);
            setIsProcessing(false);
          }
        }
        if (item.tokenId !== 0 && !item.isFirstSale) {
          if (item?.saleType === "Auction") {
            setIsSale(false);
            setShowUpdate(false);
            setIsProcessing(false);
            toast.error("You can't delisted from marketplace");
            setIsSale((prev) => !prev);
          } else {
            if (mobileAccount == "true") {
              const res = await contract.methods
                .putOffSale(nftAddress, item.tokenId)
                .send({ from: accounts });
              if (res) {
                dispatchNftItem({
                  ...item,
                  price: 0,
                  saleType: "Fixed",
                  isSale: false,
                  time: 0,
                });
                setIsSale(false);
                setIsProcessing(false);

                toast.success("Delisted from marketplace successfully");
                setShowUpdate(false);
                setIsProcessing(false);
              }
            }
            else {
              const res = await contract.methods
                .putOffSale(nftAddress, item.tokenId)
                .send({ from: accounts });
              if (res) {
                dispatchNftItem({
                  ...item,
                  price: 0,
                  saleType: "Fixed",

                  isSale: false,
                  time: 0,
                });
                setIsSale(false);
                setIsProcessing(false);

                toast.success("Delisted from marketplace successfully");
                setShowUpdate(false);
                setIsProcessing(false);
              }
            }
          }
        }
      } else {
        if (newPrice <= 0) {
          toast.error("Price should not be zero.");
          setIsProcessing(false);
          return;
        }

        if (saleType === "Auction") {
          await startAuction();
        } else {
          if (item.isFirstSale == false) {
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
                  item.tokenId,
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
                  nftAddress,
                  item.tokenId,
                  accounts,
                  parseUnits(newPrice.toString())
                )
                .send({ from: accounts });
            }
            if (res) {
              dispatchNftItem({
                ...item,
                price: parseUnits(newPrice.toString()),
                saleType: "Fixed",
                isSale: true,
                time: 0,
              });
              setIsSale(true);

              toast.success("Listed on marketplace successfully");
              setShowUpdate(false);
              setIsProcessing(false);
            }
          } else {
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
                  item.tokenURI,
                  item.royalties
                )
                .call();
              const encodedhash = await contractInstance.methods
                .getEthSignedMessageHash(hash)
                .call();
              signature = await web3.eth.personal.sign(hash, accounts);
            } else {
              const hash = await contractInstance.methods
                .getMessageHash(
                  item.nonce,
                  parseUnits(newPrice.toString()),
                  item.tokenURI,
                  item.royalties
                )
                .call();
              const encodedhash = await contractInstance.methods
                .getEthSignedMessageHash(hash)
                .call();
              signature = await web3.eth.personal.sign(hash, accounts);
            }
            const updateReq = {
              isSale: true,
              price: parseFloat(newPrice.toString()),
              signature: signature,
            };
            const ress = await Update_NFTApi(bearerTokenId, updateReq, id);
            dispatchNftItem({
              ...item,
              price: parseUnits(newPrice.toString()),
              saleType: "Fixed",
              signature: signature,
              isSale: true,
              time: 0,
            });
            setIsSale(true);

            toast.success("Listed on marketplace successfully");
            setShowUpdate(false);
            setIsProcessing(false);
          }
        }
      }
    } catch (err) {
      console.log(err)
      setIsSale((prev) => !prev);
      setShowUpdate(false);
      toast.error("Fail to update ");
      setIsProcessing(false);
    }
  };

  const showUpdates = async () => {
    setNewPrice(null)
    setAuctionLength("12");

    if ((collectionOnSale == false) && !isSale) {
      toast.error("This Collection is not on Sale");
      return
    }
    if ((collectionOnSale == true) && isSale) {
      return
    }
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

        const { id, collectionAddress } = item;
        let isMinted = null
        if (collectionAddress?.toLowerCase() == newContract?.toLowerCase()) {
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const abi = buyNFTabi.abi;
            const buContract = new web3.eth.Contract(abi, collectionAddress);
            isMinted = await buContract.methods.mintedNonce(item.nonce).call();
          } else {
            const abi = buyNFTabi.abi;
            const web3 = new Web3(window.ethereum);
            const buContract = new web3.eth.Contract(abi, collectionAddress);
            isMinted = await buContract.methods.mintedNonce(item.nonce).call();
          }
          if (item.isFirstSale == true && !isMinted) {
            let resFirstSale;
            if (mobileAccount == "true") {
              const web3 = new Web3(provider);
              const abi = buyNFTabi.abi;
              const buContract = new web3.eth.Contract(abi, collectionAddress);
              const voucher = [
                item.nonce,
                parseUnits(currentPrice.toString()),
                item.tokenURI,
                item.signature,
                item.royalties,
              ];
              resFirstSale = await buContract.methods
                .LazyMint(item.creator, voucher)
                .send({ from: accounts, value: parseUnits(currentPrice.toString()) });
            } else {
              const abi = buyNFTabi.abi;
              const web3 = new Web3(window.ethereum);
              const buContract = new web3.eth.Contract(abi, collectionAddress);
              const voucher = [
                item.nonce,
                parseUnits(currentPrice.toString()),
                item.tokenURI,
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
                  price: parseUnits(newPrice.toString()),
                  tokenId: nftId,
                  isFirstSale: false,
                  collectionAddress: item.collectionAddress
                };
                await Update_NFTApi(bearerTokenId, updateReq, id);
                dispatchNftItem({
                  ...item,
                  tokenId: parseInt(nftId),
                  isSale: false,
                  isFirstSale: false,
                  owner: accounts,
                  time: 0,
                  saleType: "Fixed",
                });
                setIsSale(false);
              }
              setIsProcessing(false);
              setIsAccept(false);

              toast.success("You bought a NFT successfully");
              history.push(`/item/${collectionAddress}/${id}`);
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
                .buy(collectionAddress, item.tokenId)
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
                .buy(collectionAddress, item.tokenId)
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
                price: parseUnits(newPrice.toString()),
                tokenId: nftId,
                collectionAddress: item.collectionAddress
              };

              await Update_NFTApi(bearerTokenId, updateReq, id);
              dispatchNftItem({
                ...item,
                tokenId: parseInt(nftId),
                isSale: false,
                isFirstSale: false,
                owner: accounts,
                time: 0,
                saleType: "Fixed",
              });
              setIsSale(false);
            }
            setIsProcessing(false);
            setIsAccept(false);

            toast.success("You bought a NFT successfully");
            history.push(`/item/${collectionAddress}/${id}`);
          }
        }
        else {
          let resultFixSale = null
          if (mobileAccount == "true") {
            const web3 = new Web3(provider);
            const contract = new web3.eth.Contract(
              FixedSaleMarketPlaceAbi.abi,
              FixedSaleMarketPlace
            );

            resultFixSale = await contract.methods
              .buy(collectionAddress, item.tokenId)
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
              .buy(collectionAddress, item.tokenId)
              .send({
                from: accounts,
                value: parseUnits(currentPrice.toString()),
              });
          }
          dispatchNftItem({
            ...item,
            isSale: false,
            isFirstSale: false,
            owner: accounts,
            time: 0,
            saleType: "Fixed",
          });
          setIsSale(false);
          setIsProcessing(false);
          setIsAccept(false);

          toast.success("You bought a NFT successfully");
          history.push(`/item/${collectionAddress}/${id}`);
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

        const { tokenId, tokenURI, price, id } = item;

        let res;

        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const collectionContractInstance = new web3.eth.Contract(
            abiFileCollections,
            item.collectionAddress
          );

          res = await collectionContractInstance.methods
            .mint(tokenId)
            .send({ from: accounts, value: parseUnits(currentPrice) });
        } else {
          const collectionContractInstance = new web3.eth.Contract(
            abiFileCollections,
            item.collectionAddress
          );

          res = await collectionContractInstance.methods
            .mint(tokenId)
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
              item.collectionAddress
            );
            uri = await collectionContractInstance.methods
              .tokenURI(nftId)
              .call();
          } else {
            const collectionContractInstance = new web3.eth.Contract(
              abiFileCollections,
              item.collectionAddress
            );
            uri = await collectionContractInstance.methods
              .tokenURI(nftId)
              .call();
          }

        }

        const old_owner = item.owner;
        dispatchNftItem({
          ...item,
          tokenId: parseInt(nftId),
          isSale: false,
          isFirstSale: false,
          owner: accounts,
          time: 0,
          saleType: "Fixed",
        });
        setIsSale(false);
        setIsProcessing(false);
        setIsAccept(false);

        toast.success("You bought a NFT successfully");
        history.push(`/item/${collectionAddress}/${id}`);

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
          // await creatProfile(accounts);
          toast.error("Please update your profile first.");
          setIsProcessing(false);
          return;
        }
        const { tokenId, paymentType } = item;
        let res;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const contract = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );

          res = await contract.methods
            .createBid(
              item.collectionAddress,
              tokenId,
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
              item.collectionAddress,
              tokenId,
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
              .auctions(item.collectionAddress, tokenId)
              .call();
          } else {
            const contracts = new web3.eth.Contract(
              reserveAuctionAbi.abi,
              reserveAuction
            );
            auction_info = await contracts.methods
              .auctions(item.collectionAddress, tokenId)
              .call();
          }

          setAuctionInfo(auction_info);

          dispatchNftItem({
            ...item,
            price: parseFloat(price),
            // owner: accounts,
            saleType: "Auction",
            time:
              (parseInt(auction_info.duration) +
                parseInt(auction_info.firstBidTime)) *
              1000,
          });
          setIsAccept(false);
          toast.success("You have placed bid this auction");

          //getHistory(id);
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
        const { tokenId, tokenURI, paymentType } = item;
        let auction_length = null
        if (auctionLength == "1") auction_length = parseInt(auctionLength) * 36;
        else auction_length = parseInt(auctionLength) * 3600;

        let nftAddress;
        if (item.collectionAddress != newContract) {
          nftAddress = item.collectionAddress;
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
            .approve(reserveAuction, tokenId)
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
            .approve(reserveAuction, tokenId)
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
                nftAddress,
                tokenId,
                auction_length,
                parseUnits(newPrice.toString()),
                accounts
              )
              .send({ from: accounts });
          } else {
            res = await reserveContractInstance.methods
              .createAuction(
                nftAddress,
                tokenId,
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
                tokenId: parseInt(nftId),
                time: 0,
                price: parseUnits(newPrice.toString()),
              });

              //getHistory(id);
              setShowUpdate(false);
              setIsProcessing(false);
              setIsAccept(false);
              toast.success("You create an auction");
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
        if (item.collectionAddress != newContract) {
          nftAddress = item.collectionAddress;
        } else {
          nftAddress = newContract;
        }
        const { tokenId } = item;
        let res;
        if (mobileAccount == "true") {
          const web3 = new Web3(provider);
          const contractProvider = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction
          );
          res = await contractProvider.methods
            .cancelAuction(nftAddress, tokenId)
            .send({ from: accounts });
        } else {
          res = await contract.methods
            .cancelAuction(nftAddress, tokenId)
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
        if (item.collectionAddress != newContract) {
          nftAddress = item.collectionAddress;
        } else {
          nftAddress = newContract;
        }
        const { tokenId } = item;

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
            .endAuction(nftAddress, tokenId)
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
            .endAuction(nftAddress, tokenId)
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
            nftId = parseInt(events.AuctionEnded.returnValues.tokenId);
            let auction_info;
            if (mobileAccount == "true") {
              const web3 = new Web3(provider);
              const reserveContractInstance = new web3.eth.Contract(
                reserveAuctionAbi.abi,
                reserveAuction
              );
              auction_info = await reserveContractInstance.methods
                .auctions(item.collectionAddress, parseInt(nftId))
                .call();
            } else {
              auction_info = await reserveContractInstance.methods
                .auctions(item.collectionAddress, parseInt(nftId))
                .call();
            }
            setAuctionInfo(auction_info);
            setBidderAmount(web3.utils.fromWei(auction_info?.amount.toString(), "ether"))
            dispatchNftItem({
              ...item,
              saleType: "Fixed",
              time: 0,
              auctionLength: null,
              auctionCreator: null,
              isSale: false,
              auctionInfo: null,
              owner: item.auctionInfo,
            });
            setIsSale(false);


            //getHistory(id);
            setAuctionInfo(null);
            setIsAccept(false);
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
    //getHistory(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, id]);

  const hasDecimal = (num) => {
    return !!(num % 1);
  };

  const convertExponentialToDecimal = (exponentialNumber) => {
    // sanity check - is it exponential number
    const str = exponentialNumber.toString();
    if (str.indexOf("e") !== -1) {
      const exponent = parseInt(str.split("-")[1], 10);

      const result = exponentialNumber.toFixed(exponent);
      return result;
    } else {
      return exponentialNumber;
    }
  };

  useEffect(() => {
    let ethprice = null;
    if (hasDecimal(item?.price)) {
      ethprice = convertExponentialToDecimal(item?.price)
      convertExponentialToDecimal(item?.price)
    } else {
      if (item.price >= 1 && item.price < 100000) {
        ethprice = item.price
      }
      else {
        if (item.price) {
          ethprice = web3.utils.fromWei(item.price.toString(), "ether");
        }
      }
    }
    if (auctionInfo && parseFloat(auctionInfo?.amount) > 0) {
      setCurrentPrice(ethprice);
    } else setCurrentPrice(ethprice);
  }, [item.price, auctionInfo]);

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

  const msToTime = (duration) => {
    let milliseconds = parseInt((duration % 1000));
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours.toString().padStart(2, '0');
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');
    milliseconds = milliseconds.toString().padStart(3, '0');

    return {
      hours,
      minutes,
      seconds,
      milliseconds
    };
  }

  return isLoading ? (
    <LoaderNew />
  ) : (
    <>
      {
        isProcessing && <LoaderNew />
      }

      <main className="main">
        <div className="hero_common creator_hero_main mt-3">
          <div className="hero_border pb-5">
            <div className="container">
              {/* <div className="row mt-5">
                <div className="col-lg-6 col-md-6 col-6">
                  <div className="main__title main__title--page mt-0">
                    <h1 className="ml-0 collect_detail_username">{item.name}</h1>
                    <Link
                      className={`${collectionName ? "asset__author--verified" : ""
                        }`}
                      to={`/creator/${collectionID}/collection/${collectionAddress}`}
                    >
                      {collectionName}
                    </Link>

                  </div>
                </div>
                <div className="col-lg-6 col-md-6 col-6 mob_right_btn mob_space_left1">
                  <div disabled={true}>
                    <p className="sign__text mb-0 d-flex justify-content-end mt-md-2 mt-0">
                      <span className="mt-0 pr-3">For sale:</span>

                      <Switch
                        onChange={showUpdates}
                        checked={isSale}
                        disabled={
                          item?.owner?.toLowerCase() !== accounts?.toLowerCase() || item.time > 0
                        }
                        height={26}
                      />
                    </p>
                  </div>
                </div>
              </div> */}

              <div className="row detail_nft_card">
                {/* <!-- content --> */}
                <div className="col-12 col-md-5 cardAssetPreview">
                  <AssetItem data={item} />
                </div>
                {/* <!-- end content --> */}

                {/* <!-- sidebar --> */}
                <div className="col-12 col-md-7 bleuFrosted cardAssetDetails">
                  <div className="asset__info">
                    <div className="asset__wrap">

                      <div className="main__title main__title--page mt-0">
                        <div className="row">
                        <h1 className="col-lg-6 col-md-6 col-6 ml-0 collect_detail_username">{item.name}</h1>
                        <div className="col-lg-6 col-md-6 col-6 mob_right_btn mob_space_left1">
                            <div disabled={true}>
                            <p className="sign__text mb-0 d-flex justify-content-end mt-md-2 mt-0">
                              <span className="mt-0 pr-3">For sale:</span>

                              <Switch
                                onChange={showUpdates}
                                checked={isSale}
                                disabled={
                                  item?.owner?.toLowerCase() !== accounts?.toLowerCase() || item.time > 0
                                }
                                height={26}
                              />
                            </p>
                          </div>
                        </div>
                        </div>

                        <Link
                          className={`${collectionName ? "asset__author--verified" : ""
                            }`}
                          to={`/creator/${collectionID}/collection/${collectionAddress}`}
                        >
                          {collectionName}
                        </Link>
                        <p className="create_title">
                          Created by <span> 051_Hart </span>
                          </p>
                      </div>
                      <div className="asset__desc mt-4 asset_height_detail">
                        <span className="cardAssetDetailsLabel">Description</span>
                        <p>{item.description}</p>
                      </div>

                      <div className="row">
                        <div className="col-md-6 col-sm-6 col-12">
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
                                      <msToTime duration ={item.time}/>
                                    </div>
                                  </>
                                ) : (
                                  <div className="sign__group">
                                    <label
                                      className="sign__label"
                                      htmlFor="length"
                                    >
                                      Auction Length
                                    </label>
                                    <select
                                      id="length"
                                      name="length"
                                      className="sign__select"
                                      value={auctionLength}
                                      disabled
                                      onChange={(e) =>
                                        setAuctionLength(e.target.value)
                                      }
                                    >
                                       <option value="1">15 minutes</option>
                                      <option value="12">12 hours</option>
                                      <option value="24">24 hours</option>
                                      <option value="48">2 days</option>
                                      <option value="72">3 days</option>
                                      <option value="168">7 days</option>
                                    </select>
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
                                  {(currentPrice)} {item.paymentType}{" "}
                                </span>
                                <span className="usd_price">
                                  {" "}
                                  (${((currentPrice) * rate).toFixed(
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
                        </div>
                      </div>

                       <div className="row">
                        <div className="col-md-12 col-12">

                          {isSale &&
                            !(
                              accounts?.toLowerCase() == item.owner?.toLowerCase()
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
                                      style={{ marginLeft: '0px' }}
                                    >
                                      Terms and conditions
                                    </a>
                                  </label>
                                </div>
                                {isAccept && (
                                  <div className="asset__btns">
                                    {item.saleType === "Fixed" &&
                                      item.owner?.toLowerCase() != account?.toLowerCase() ? (
                                      <button
                                        className="asset__btn asset__btn asset__btn--clr mx-auto createbtn"
                                        onClick={async () => {
                                          if (
                                            item.collectionAddress?.toLowerCase() !==
                                            newContract?.toLowerCase() && item.isFirstSale
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
                                        className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0 createbtn"
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
                                          auctionInfo?.owner?.toLowerCase() === accounts?.toLowerCase()
                                        ) && (
                                            <button
                                              disabled={
                                                isProcessing ||
                                                item.time <
                                                parseInt(new Date().getTime()) ||
                                                (auctionInfo &&
                                                  auctionInfo?.owner?.toLowerCase() ===
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
                                          auctionInfo?.owner?.toLowerCase() === accounts?.toLowerCase()) ||
                                          (auctionInfo &&
                                            auctionInfo?.bidder?.toLowerCase() === accounts?.toLowerCase())) &&
                                          item.time <
                                          parseInt(new Date().getTime()) && (
                                            <button
                                              disabled={isProcessing}
                                              className="asset__btn asset__btn--full asset__btn--clr createbtn"
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
                                        className="asset__btn asset__btn--full asset__btn--clr createbtn"
                                        onClick={endAuction}
                                      >
                                        {isProcessing
                                          ? "Waiting..."
                                          : "Claim NFT"}
                                      </button>
                                    ) : (
                                      <button
                                        disabled={true}
                                        className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0 "
                                      >
                                        {isProcessing
                                          ? "Waiting..."
                                          : "Auction Ended, Pending For Claim"}
                                      </button>
                                    )}
                                  </div>
                                )}
                              </>
                            )}

                          {isSale &&
                            (item.saleType == "Auction") && accounts && (isActive == "true" || mobileAccount == "true") &&
                            (accounts?.toLowerCase() == item.owner?.toLowerCase() || isAdmin == "true") && (
                              <>
                                {isSale}
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
                                          auctionInfo?.owner?.toLowerCase() === accounts?.toLowerCase() &&
                                          auctionInfo &&
                                          parseInt(auctionInfo?.amount) === 0 ? (
                                          <button
                                            disabled
                                            className="asset__btn asset__btn--full asset__btn--clr createbtn"
                                            onClick={cancelAuction}
                                          >
                                            {isProcessing
                                              ? "Waiting..."
                                              : "Auction Not Start"}
                                          </button>
                                        ) : item.time == 0 &&
                                          item.owner?.toLowerCase() == accounts?.toLowerCase() ? (
                                          <button
                                            disabled={true}
                                            className="asset__btn asset__btn--full asset__btn--clr createbtn"
                                            onClick={endAuction}
                                          >
                                            {isProcessing
                                              ? "Waiting..."
                                              : "End Auction"}
                                          </button>
                                        ) : item.time == 0 &&
                                          isAdmin == "true" ? (
                                          <button
                                            disabled={isProcessing}
                                            className="asset__btn asset__btn--full asset__btn--clr createbtn"
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
                                        className="asset__btn asset__btn--full asset__btn--clr createbtn"
                                        onClick={endAuction}
                                      >
                                        {isProcessing
                                          ? "Waiting..."
                                          : "Claim NFT"}
                                      </button>
                                    ) : (
                                      <button
                                        disabled={true}
                                        className="asset__btn asset__btn--full asset__btn--clr createbtn"
                                      >
                                        Auction is started
                                      </button>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                        </div>
                      </div>
                    </div>

                    <div className="border_card">
                      <AssetAuthor data={item} />
                    </div>

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
                    {item.tokenId == 0 ?
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
                          setNewPrice(item.price);
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
                          {/* <option value="1">15 minutes</option> */}
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
                      type="text"
                      maxLength={8}
                      name="updatePrice"
                      className="sign__input height-sm"
                      placeholder="Type update price."
                      value={newPrice > 1000 ? 0 : newPrice || 0}
                      onChange={(e) => {
                        setNewPrice(e.target.value);
                      }}
                    />
                  </div>
                  <button
                    className="btn-glow btn-hover-shine mt-3 highlightHover"
                    onClick={() => {
                      updateSale(false);
                    }}
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Waiting..." : "List for sales"}
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
                      type="text"
                      value={price}
                      maxLength={8}
                      placeholder={`Place your highest bid in ${item.paymentType}.`}
                      className="sign__input"
                      onChange={(e) => {

                        if (e.target.value > currentPrice) {
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
                    className={enablePlaceBid ? "sale_btn createbtn" : "sign__btn"}
                    onClick={enablePlaceBid ? bidNft : null}
                    disabled={isProcessing || enablePlaceBid === false}
                  >
                    {isProcessing ? "Waiting..." : "Place bid"}
                  </button>

                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default Item;



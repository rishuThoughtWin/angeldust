import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import { Contract } from "@ethersproject/contracts";
import { isAddress } from "@ethersproject/address";
import { NFT_MARKET_ADDRESS, DefaultAvatar } from "../../../constants";
import Market_INFO from "artifacts/contracts/Marketplace.sol/FlokinomicsNFTMarketplace.json";

import { toast } from "react-toastify";

import SweetAlert from "sweetalert-react";
import "sweetalert/dist/sweetalert.css";
import { parseUnits } from "@ethersproject/units";
import moment from "moment";
import Web3 from "web3";
import BluefiAbi from "../../../services/smart-contract/AngeldustNFT";
import './Tabs.css'

function Tabs(props) {
  const { account, library } = useWeb3React();
  const { historyData, bidsData, item, docId } = props;
  // 41cw3RkOgYfjx40A
  // eslint-disable-next-line no-unused-vars
  const [toAddress, setToAddress] = useState("");
  const [isShow, setIsShow] = useState(false);
  const [isTransferring, setIsTransfer] = useState(false);
  const [isBurning, setIsBurning] = useState(false);
  const history = useHistory();
  const getStr = (type) => {
    if (type === 0) return "Created ";
    if (type === 1) return "Buy ";
    if (type === 2) return "Bid placed ";
    if (type === 3) return "Auction created ";
    if (type === 4) return "NFT Claim ";
    if (type === 5) return "Auction canceled ";
    if (type === 6) return "Fixed Sale ";
    if (type === 7) return "Off Sale ";
  };
  const burnNFT = () => {
    setIsShow(true);
  };
  const onConfirmBurn = async () => {
    const { tokenId } = item;

    const contract = new Contract(
      NFT_MARKET_ADDRESS,
      Market_INFO.abi,
      library.getSigner()
    );
    setIsShow(false);
    setIsBurning(true);
    const res = await contract.burn(tokenId);

  };
  const sendNFT = async () => {
    const { tokenId, collectionAddress } = item;

    if (toAddress === "" || !isAddress(toAddress)) {
      toast.error("Please provide a valid address.");
      return;
    }

    if (tokenId === "") {
      toast.error("Invalid token ID.");
      return;
    }
    setIsTransfer(true);
    try {

      const bluefiContract = process.env.REACT_APP_Angeldust_NFT;
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      const reserveContractInstance = new web3.eth.Contract(
        BluefiAbi.abi,
        bluefiContract
      );

      const res = await reserveContractInstance.methods
        .transferFrom(account, toAddress, tokenId)
        .send({ from: account });
      if (res) {
        toast.success("The NFT has been transferred successfuly.");
        history.push("/explore");
      } else {
        toast.error("Failed to send transfer");
        setIsTransfer(false);
      }
    } catch (e) {
      setIsTransfer(false);
      console.log(e);
    }
  };


  const getTime = (time) => {
    const timespace = parseInt((moment().valueOf() - new Date(time)) / 60000);
    const timeAgo =
      timespace < 1
        ? "less than a minute"
        : timespace < 60
          ? `${timespace} min ago`
          : timespace < 24 * 60
            ? `${parseInt(timespace / 60)} hrs ago`
            : moment(time).format("YYYY/MM/DD");

    return timeAgo;
  };

  const getBidTime = (time) => {
    const timespace = parseInt((moment().valueOf() - new Date(time)) / 60000);
    const timeAgo =
      timespace < 1
        ? "less than a minute"
        : timespace < 60
          ? `${timespace} min ago`
          : timespace < 24 * 60
            ? `${parseInt(timespace / 60)} hrs ago`
            : moment(time).format("YYYY/MM/DD");

    return timeAgo;
  };

  const hasDecimal = (num) => {
    return !!(num % 1);
  };

  const getPrice = (price) => {
    const web3 = new Web3(Web3.givenProvider || window.etherum);
    let ethprice = null;
    if (hasDecimal(price)) {
      ethprice = price;
    } else {
      if (price >= 1 && price < 1000000) {
        ethprice = price
      }
      else {
        if (price) {
          ethprice = web3.utils.fromWei(price.toString(), "ether");

        }
      }
    }
    return ethprice;
  };

  return (
    <>
      <ul className="nav nav-tabs asset__tabs" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            data-toggle="tab"
            href="#tab-1"
            role="tab"
            aria-controls="tab-1"
            aria-selected="true"
          >
            History
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
            Bids
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
            Actions
          </a>
        </li>
      </ul>

      <div className="tab-content">
        <div className="tab-pane fade show active" id="tab-1" role="tabpanel">
          <div className="asset__actions fancy-scrollbar">
            {historyData?.map((data, index) => (
              <div
                className={`asset__action ${data.verified === true
                  ? "asset__action--verified"
                  : "asset__action--verified"
                  }`}
                key={`history-${index}`}
              >
                <img
                  src={
                    data?.userDetails?.avatar
                      ? data?.userDetails?.avatar
                      : "assets/img/avatars/avatar.jpg"
                  }
                  alt=""
                />
                <p>
                  {getStr(data?.actionType)} for{" "}
                  <b>
                    {getPrice(data?.price)} {item.paymentType}
                  </b>{" "}
                  {getTime(data?.createdAt)} <br />
                  by <span> {data?.userDetails?.nickName} </span>
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="tab-pane fade" id="tab-2" role="tabpanel">
          <div className="asset__actions fancy-scrollbar">
            {bidsData?.filter((e) => Number(e.actionType) == 2)?.map((data, index) => (
              <div
                className={`asset__action ${data.verified === true
                  ? "asset__action--verified"
                  : "asset__action"
                  }`}
                key={`bid-${index}`}
              >
                <img src={
                  data?.userDetails?.avatar
                    ? data?.userDetails?.avatar
                    : "assets/img/avatars/avatar.jpg"
                } alt="" />
                <p>
                  {getStr(data?.actionType)} for{" "}
                  <b>
                    {getPrice(data?.price)} {item.paymentType}
                  </b>{" "}
                  {getBidTime(data?.createdAt)} <br />
                  by <span> {data?.userDetails?.nickName} </span>
                </p>
              </div>
            ))}
            <div className="asset__actions d-flex justify-center bids mx-auto items-center">
              {!(bidsData && (bidsData[0]?.actionType == 2)) ?
                "No bid yet."
                :
                null
              }
            </div>
          </div>
        </div>


        <div className="tab-pane fade" id="tab-3" role="tabpanel">
          {(item.owner?.toLowerCase() === account?.toLowerCase() && item.saleType === "Fixed") ? (
            <div className="fancy-scrollbar">
              {item.tokenId != 0 && !item.isFirstSale && !item.isSale
                ?
                <>
                  <div className="asset__action row">
                    <p className="asset__text col-4 pr-0">Transfer To:</p>
                    <input
                      id="toAddress"
                      type="text"
                      name="toAddress"
                      className="sign__input col-8 height-sm"
                      placeholder="ex: 0x600bE5FcB9338BC3938e4790EFBeAaa4F77D6893."
                      value={toAddress || ""}
                      onChange={(e) => {
                        setToAddress(e.target.value);
                      }}
                    />
                  </div>
                  <div className="d-flex justify-center">
                    <button
                      className="asset__btn asset__btn--clr height-sm createbtn"
                      onClick={sendNFT}
                    >
                      {isTransferring ? "TRANSFERRING..." : "TRANSFER NFT"}
                    </button>
                  </div>
                </>
                :
                null}
              {!item.isSale ?
                <>
                
                </>
                :
                null}
            </div>
          ) : (
            <div className="asset__actions asset__action ">
              <p className="mx-auto d-flex justify-center">
                {item.owner?.toLowerCase() !== account?.toLowerCase()
                  ? "You are not owner."
                  : "You cannot take any actions with this Auctioning NFT."}
              </p>
            </div>
          )}
        </div>
      </div>
      <SweetAlert
        show={isShow}
        title="Are you sure?"
        text="Do you want to delete it permanantly?"
        showCancelButton
        onConfirm={onConfirmBurn}
        onCancel={() => {
          setIsShow(false);
        }}
      />
    </>
  );
}
export default Tabs;


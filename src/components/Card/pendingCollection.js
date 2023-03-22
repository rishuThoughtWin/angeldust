import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import { Get_Profile_By_AccountId, approveLaunchpadCollection } from "apis";
import { useDisconnect } from "hooks/useDisconnect";
import { RPC_URLS } from "pages/Header/connectors";
import Image from "components/Image";
import Img_bleu_bg_main from "../../assets/img/cover/bleu_bg_main.svg";
import "./style.css";

function PendingCard(props) {
  const {
    id,
    type,
    image,
    isSale,
    currency,
    collectionName,
    owner,
    creator,
    price,
    mintCost,
    likes,
    paymentType,
    collectionAddress,
    auctionCreator,
    approve,
    imageCover,
    maxSupply,
    isMoralisesDataStatus,
    isMoralisesCollection,
  } = props.data;
  const dispatch = useDispatch();
  const tokenIdBearer = useSelector((state) => state?.tokenData?.token);
  const { account } = useWeb3React();

  const mobileAccount = localStorage.getItem("mobileAccount");
  const [accounts, setAccount] = useState(account);
  const { disconnectWalletConnect } = useDisconnect();
  const history = useHistory();
  const [ownerAvatar, setOwnerAvatar] = useState(
    "assets/img/avatars/avatar.jpg"
  );
  const isAdmin = localStorage.getItem("owner");
  const [nickName, setNickName] = useState("@unkown");
  const [follow, setFollow] = useState(likes);

  const getAvatar = async () => {
    const url = await Get_Profile_By_AccountId(owner, "");
    if (url) {
      setOwnerAvatar(url?.data?.avatar);
      setNickName(url?.data?.nickName);
    }
  };
  useEffect(async () => {
    if (mobileAccount == "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      if(account) setAccount(account)
      if(isAdmin=='true' && isAdmin) {let ac =  await web3.eth.requestAccounts(); setAccount(ac[0])}
    }
    if (owner) {
      getAvatar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [owner]);
  useEffect(() => {
    setFollow(props.data.likes);
  }, [props.data]);

  const handleFunc = async () => {
    //const isApproved = true;
    if (!tokenIdBearer) {
      return await disconnectWalletConnect();
    }

    const req = {
      collectionId: id,
      approved: true,
    };
    if (accounts) {
      const result = await approveLaunchpadCollection(tokenIdBearer, req);
      if (result?.data?.success.code === 200) {
        toast.success(result?.data?.success?.message);
        props.reload();
      } else {
        toast.error("Something went wrong.");
      }
    } else {
      history.push(`/`);
    }
    // }
  };
  return (
    <div className="nftCard bleuFrosted">
      <div className="nftCardImageWrapper">
        <Link to={`/collection/${id}/${collectionAddress}/test`}>
          <Image
            style={{ height: "", width: "250px" }}
            className="nftCardImage1"
            placeholderImg={Img_bleu_bg_main}
            src={imageCover}
          />
        </Link>
        {type === "image" ? (
          <Link to={`/collection/${id}/${collectionAddress}/test`}>
            <Image
              style={{ height: "", width: "250px" }}
              className="nftCardImage1"
              placeholderImg={Img_bleu_bg_main}
              src={imageCover}
            />
          </Link>
        ) : type === "audio" ? (
          <img src="/assets/img/posts/1.jpg" className="nftCardImage1" />
        ) : null}
      </div>
      <div className="nftCardContent approve_card">
        <div className="nftCardTitle mb-0 productTitle">
          {collectionName ? collectionName : "Test"}
        </div>
        <div className="row m-0 rowusernamebtncontainer">
          <div
            className="col-12 mb-2 productTitle1"
            onClick={() =>
              history.push(
                `/creator/${owner}/collection/${collectionAddress}?tab=items`
              )
            }
          >
            {!nickName ? "Test-user" : nickName}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 col-6">
            <div className=" mb-2 productTitle productTotal1">
              Total NFTs: {maxSupply}
            </div>
          </div>

          <div className="col-md-6 col-6">
            <div className="nftCardPillPriceWrapper ">
              <div className="text-right">
                {/*<img
                      src="https://i.ibb.co/qMsBFtL/Binance-Logo.png"
                      className="nftCardPillCurrencyImage mr-2"
                    />*/}
                <p className="productTitle">
                  {mintCost ? mintCost : 0} {currency}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {isMoralisesCollection && isMoralisesDataStatus === "completed" ? (
              <button
                className="pendingbtnnew highlightHover"
                onClick={handleFunc}
              >
                Ready to approve
              </button>
            ) : isMoralisesCollection &&
              isMoralisesDataStatus === "in-progress" ? (
              <button className="pendingbtnnew disabledClass">
                In progress
              </button>
            ) : isMoralisesCollection && isMoralisesDataStatus === "pending" ? (
              <button className="pendingbtnnew disabledClass">Pending</button>
            ) : (
              <button
                className="pendingbtnnew highlightHover"
                onClick={handleFunc}
              >
                Ready to approve
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingCard;

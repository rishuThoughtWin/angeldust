import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { toast } from "react-toastify";
import insta from "assets/img/social-icon/instagram.png";
import twitter1 from "assets/img/social-icon/twitter.png";
import telegram1 from "assets/img/social-icon/telegram.png";
import { addFollowApi, unFollowApi } from "apis";
import { useSelector } from "react-redux";
import { RPC_URLS } from "../../pages/Header/connectors";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDisconnect } from "hooks/useDisconnect";
import { Get_Profile_By_AccountId } from "apis";
import { followAPI } from "apis";
import Copy from "../../assets/img/icons/copy.png";

function AuthorMeta(props) {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const isAdmin = localStorage.getItem("owner");
  const isUser = localStorage.getItem("isActive");
  const loginUserId = useSelector((state) => state?.user?._id);
  const state = useSelector((state) => state);
  const tokenId = useSelector((state) => state?.tokenData?.token);
  const _id = props?.data?._id;
  //const loginUserId = "62306f2907df0b69ceb0b019";
  const avatar = props.data?.avatar || "assets/img/avatars/avatar.jpg";
  const firstName = props.data?.firstName || "User";
  const lastName = props.data?.lastName || "";
  const nickName = props.data?.nickName || "user";
  const bio = props.data?.bio || "";
  const followers = props.data?.followers || "";
  const twitter = props.data?.twitter || "";
  const telegram = props.data?.telegram || "";
  const instagram = props.data?.instagram || "";
  const is_followed = props.data?.is_followed || "";
  const follower_count = props.data?.follower_count || "";

  const { onClick } = props;
  const userId = props.data?.account;
  const { account } = useWeb3React();
  const { disconnectWalletConnect } = useDisconnect();
  const [likes, setLikes] = useState(follower_count);
  const [isFollowed, setIsFollowed] = useState(null);
  const [accounts, setAccount] = useState(account);
  const [provider, setProvider] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(async () => {

    if (mobileAccount == "true") {
      const providers = new WalletConnectProvider({
        rpc: RPC_URLS,
      });

      //  Enable session (triggers QR Code modal)
      await providers.enable();
      setProvider(providers);
      setAccount(providers.accounts[0]);
    } else {
      setAccount(account);
    }

    setLikes(follower_count);
    const followData = followers ? followers.filter((x) => x?.toLowerCase() === accounts?.toLowerCase()) : [];
    setIsFollowed(is_followed);
  }, [follower_count]);

  const followUser = async () => {
    // if(isUser!='true' || isAdmin != 'true' || mobileAccount != 'true') return toast.error("Please connect your wallet first.");
    setIsFollowing(true)
    if (userId?.toLocaleLowerCase() === accounts?.toLocaleLowerCase()) {
      setIsFollowing(false)
      toast.error("You can't follow yourself.");
    }
    // else if(isUser=='true' || isAdmin == 'true' || mobileAccount == 'true') return toast.error("Please connect your wallet first.");
     else {
      try {
        if (isFollowed) {
          // const data = await unFollowApi(tokenId, _id, accounts);
          const userInfo = await Get_Profile_By_AccountId(accounts,tokenId);
          const userExist = userInfo ? userInfo?.data : {};
          if (!userExist?.nickName) {
            // await creatProfile(accounts);
            setIsFollowing(false)
            toast.error(`Please update your profile first.`)
            return
          }
          const data = await followAPI(tokenId, _id, userInfo?.data?._id)
          if (data?.data?.status === 200) {
            toast.success(`You unfollow ${nickName}`);
            setIsFollowed(false);
            
            props.getData();
          } else if (data?.response?.data?.error) {
            setIsFollowing(false)
            toast.error("Please connect your wallet first.");
          } else {
            setIsFollowing(false)
            toast.error("Internal server error");
          }
        } else {
          // const data = await addFollowApi(tokenId, _id, accounts);
          const userInfo = await Get_Profile_By_AccountId(accounts,tokenId);
          const userExist = userInfo ? userInfo?.data : {};
          if(userExist?.nickName == undefined) {
            setIsFollowing(false)
            toast.error("Please connect your wallet first.");
            return
          }
          if (!userExist?.nickName) {
            // await creatProfile(accounts);
            setIsFollowing(false)
            toast.error(`Please update your profile first.`)
            return
          }
          const data = await followAPI(tokenId, _id, userInfo?.data?._id)
          if (data?.data?.status === 200) {
            toast.success(`You follow ${nickName}`);
            setIsFollowed(true);
            setIsFollowing(false)
            props.getData();
          } else if (data?.response?.data?.error) {
            setIsFollowing(false)
            toast.error("Please connect your wallet first.");
          } else {
            setIsFollowing(false)
            toast.error("Internal server error");
          }
        }
      } catch (err) {
        setIsFollowing(false)
        toast.error("Error in following");
      }
    }
  };

  return (
    <div className="author__meta">
      <div className="row">
        <div className="col-12">
          <div
            className={`author__avatar ${nickName ? "author__avatar--verified" : ""
              }`}
          >
            <img src={avatar || ""} alt="" onClick={onClick} />
          </div>
          <div className="content_author">
            <h1 className="author__name">
              {firstName} {lastName}
            </h1>
            <h2 className="author__nickname">@{nickName}</h2>
            <div className="author__code inputBg">
              <input
                type="text"
                value={userId || ""}
                id="author-code"
                readOnly
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(userId);
                }}
              >
                <span>Copied</span>
                <img src={Copy} className="copy_icon" alt="Image" />
                {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M18,19H6a3,3,0,0,1-3-3V8A1,1,0,0,0,1,8v8a5,5,0,0,0,5,5H18a1,1,0,0,0,0-2Zm5-9.06a1.31,1.31,0,0,0-.06-.27l0-.09a1.07,1.07,0,0,0-.19-.28h0l-6-6h0a1.07,1.07,0,0,0-.28-.19l-.09,0L16.06,3H8A3,3,0,0,0,5,6v8a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V10S23,10,23,9.94ZM17,6.41,19.59,9H18a1,1,0,0,1-1-1ZM21,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V6A1,1,0,0,1,8,5h7V8a3,3,0,0,0,3,3h3Z" />
                </svg> */}
              </button>
            </div>
          </div>
          <a href={window.location.href} className="author__link">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21.41,8.64s0,0,0-.05a10,10,0,0,0-18.78,0s0,0,0,.05a9.86,9.86,0,0,0,0,6.72s0,0,0,.05a10,10,0,0,0,18.78,0s0,0,0-.05a9.86,9.86,0,0,0,0-6.72ZM4.26,14a7.82,7.82,0,0,1,0-4H6.12a16.73,16.73,0,0,0,0,4Zm.82,2h1.4a12.15,12.15,0,0,0,1,2.57A8,8,0,0,1,5.08,16Zm1.4-8H5.08A8,8,0,0,1,7.45,5.43,12.15,12.15,0,0,0,6.48,8ZM11,19.7A6.34,6.34,0,0,1,8.57,16H11ZM11,14H8.14a14.36,14.36,0,0,1,0-4H11Zm0-6H8.57A6.34,6.34,0,0,1,11,4.3Zm7.92,0h-1.4a12.15,12.15,0,0,0-1-2.57A8,8,0,0,1,18.92,8ZM13,4.3A6.34,6.34,0,0,1,15.43,8H13Zm0,15.4V16h2.43A6.34,6.34,0,0,1,13,19.7ZM15.86,14H13V10h2.86a14.36,14.36,0,0,1,0,4Zm.69,4.57a12.15,12.15,0,0,0,1-2.57h1.4A8,8,0,0,1,16.55,18.57ZM19.74,14H17.88A16.16,16.16,0,0,0,18,12a16.28,16.28,0,0,0-.12-2h1.86a7.82,7.82,0,0,1,0,4Z" />
                </svg>{" "}
              </div>
              <div>
                {window.location.href.split("?")[0]}
            </div>
          </a>
          <p className="author__text pt-3">{bio}</p>
        </div>
      </div>
    </div>
  );
}
export default AuthorMeta;

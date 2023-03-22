import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import "./style.css";
import { toast } from "react-toastify";
import { addFollowApi, unFollowApi } from "apis";
import { useSelector } from "react-redux";
import { RPC_URLS } from "../../pages/Header/connectors";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useDisconnect } from "hooks/useDisconnect";
import { followAPI } from "apis";
import { Get_Profile_By_AccountId } from "apis";

function Author(props) {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const tokenId = useSelector((state) => state?.tokenData?.token);
  const isAdmin = localStorage.getItem("owner");
  const isUser = localStorage.getItem("isActive");
  const { account } = useWeb3React();
  const [isFollowing, setIsFollowing] = useState(false)
  const [accounts, setAccount] = useState(account);
  const [provider, setProvider] = useState(null);

  const { disconnectWalletConnect } = useDisconnect();

  const id = props.data.account;
  const {
    _id,
    imageCover,
    avatar,
    firstName,
    lastName,
    nickName,
    follower_count,
    bio,
    followers,
    isBlackList,
    is_followed
  } = props.data;

  const [likes, setLikes] = useState(follower_count ? follower_count : 0);
  const [isFollowed, setIsFollowed] = useState(null);
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

    const followData = followers ? followers.filter((x) => x?.toLowerCase() === accounts?.toLowerCase()) : [];
    setIsFollowed(is_followed);
    setLikes(follower_count);
  }, [follower_count, account]);

  const followUser = async () => {
    setIsFollowing(true)
    if (isUser === "true" || mobileAccount == "true") {
      if (
        id?.toLowerCase() === accounts?.toLowerCase() ||
        _id?.toLowerCase() === accounts?.toLowerCase()
      ) {
        setIsFollowing(false)
        toast.error("You can't follow yourself.");
      } else {
        try {
          if (!tokenId) {
            return await disconnectWalletConnect();
          }
          if (isFollowed) {
            try {
              // const data = await unFollowApi(tokenId, _id, accounts);
              const userInfo = await Get_Profile_By_AccountId(accounts, tokenId);
              const userExist = userInfo ? userInfo?.data : {};
              if (!userExist?.nickName) {
                // await creatProfile(accounts);
                setIsFollowing(false)
                toast.error(`Please update your profile first.`)
                return
              }
              const data = await followAPI(tokenId, _id, userInfo?.data?._id)
              if (data.status === 200) {
                toast.success(`You unfollow ${nickName ? nickName : 'Angeldust'}`);
                setIsFollowed(false);
                // const removeFollow = likes.filter((x) => x !== accounts);
                const removeFollow = likes - 1
                setLikes(removeFollow);
                setIsFollowing(false)
                // props.getCreators();
              } else {
                setIsFollowing(false)
                toast.error(`something went wrong please try again later.`);
              }
            } catch (error) { }
          } else {
            try {
              // const data = await addFollowApi(tokenId, _id, accounts);
              const userInfo = await Get_Profile_By_AccountId(accounts, tokenId);
              const userExist = userInfo ? userInfo?.data : {};
              if (!userExist?.nickName) {
                // await creatProfile(accounts);
                setIsFollowing(false)
                toast.error(`Please update your profile first.`)
                return
              }
              const data = await followAPI(tokenId, _id, userInfo?.data?._id)
              if (data.status === 200) {
                toast.success(`You follow ${nickName ? nickName : 'Angeldust'}`);
                setIsFollowed(true);
                const newLike = likes + 1;
                // newLike.push(accounts);
                setLikes(newLike);
                setIsFollowing(false)
                // props.getCreators();
              } else {
                setIsFollowing(false)
                toast.error("Please connect your wallet first.");
              }
            } catch (error) { }
          }
        } catch (err) {
          setIsFollowing(false)
          toast.error("Error in following");
        }
      }
    } else {
      setIsFollowing(false)
      toast.error("Please connect your wallet first");
    }
  };
  const shorten = (str, len) => {
    if (typeof str === "string") {
      const arr = str.split(" ");
      let res = "";
      for (let i = 0; i < arr.length; i++) {
        if (res.length + arr[i].length + 1 < len) {
          res += arr[i] + " ";
        } else {
          res += "...";
          return res;
        }
      }
      return res;
    } else return "";
  };

  const changed = (event) => {
    props.onDeleteNFTHandler(id);
    props.setBlackListUserListIds(_id);
  };

  const pageredirection = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return (
    <div className="author explore-page creator_page_div">
      <div className="custom-control custom-checkbox">
        {isBlackList ? null : props.deleteEnable ? (
          <input
            type="checkbox"
            className="custom-control-input mr-2"
            id="customCheck1"
            onChange={changed}
          />
        ) : null}
        <label className="custom-control-label m-0" for="customCheck1"></label>
        {isBlackList && isAdmin == "true" ? (
          <h3 style={{ color: "red" }}>BlackListed</h3>
        ) : null}
      </div>
      {(isUser=='true' || isAdmin == 'true' || mobileAccount == 'true') && accounts && id.toLocaleLowerCase()==accounts.toLocaleLowerCase()
              ?
              <Link
        to={`/creator/${accounts}?tab=profile`}
        className="author__cover author__cover--bg authorImageWrapper"
        data-bg={imageCover}
      >
        <img
          src={imageCover ? imageCover : "/assets/img/bg/bg.png"}
          className="imageBanner"
          alt=""
          onClick={pageredirection}
        />
      </Link>
      :
      <Link
        to={`/creator-public/${id}`}
        className="author__cover author__cover--bg authorImageWrapper"
        data-bg={imageCover}
      >
        <img
          src={imageCover ? imageCover : "/assets/img/bg/bg.png"}
          className="imageBanner"
          alt=""
          onClick={pageredirection}
        />
      </Link>

      }

      <div className="author__meta bleuFrosted">
        <div className="img_feature">
          <div className="authorImage">
            {accounts && id.toLocaleLowerCase()==accounts.toLocaleLowerCase()
              ?
              <Link
              to={`/creator/${accounts}?tab=profile`}
              className="author__avatar author__avatar--verified"
            >
              <img src={avatar ? avatar : "assets/img/avatars/avatar.jpg"} alt="" />
            </Link>
            :
            <Link
              to={`/creator-public/${id}`}
              className="author__avatar author__avatar--verified"
            >
              <img src={avatar ? avatar : "assets/img/avatars/avatar.jpg"} alt="" />
            </Link>
            }
          </div>

          <div className="author_detail">
            <h3 className="author__name">
            {accounts && id.toLocaleLowerCase()==accounts.toLocaleLowerCase()
              ?
              <Link onClick={pageredirection} to={`/creator/${accounts}?tab=profile`}>
                {firstName ? firstName : 'Angeldust'}{" "}{lastName ? lastName : 'User'}
              </Link>
              :
              <Link onClick={pageredirection} to={`/creator-public/${id}`}>
                {firstName ? firstName : 'Angeldust'}{" "}{lastName ? lastName : 'User'}
              </Link>
              }
            </h3>
            <h3 className="author__nickname">
              {accounts && id.toLocaleLowerCase()==accounts.toLocaleLowerCase()
                ?
                <Link onClick={pageredirection} to={`/creator/${accounts}?tab=profile`}>
                {nickName}
              </Link>
              :
              <Link onClick={pageredirection} to={`/creator-public/${id}`}>
                {nickName}
              </Link>
              }

            </h3>
          </div>
        </div>

        <p className="author__text">{shorten(bio, 80)}</p>

        <div className="row">
          <div className="col-lg-6 col-md-5 col-6">
            <button
              className={isFollowing ? "btn-glow btn-grey btn-hover-shine btn_creator_follow highlightHover" : "btn-glow btn-hover-shine btn_creator_follow highlightHover"}
              type="button"
              onClick={followUser}
              disabled={isFollowing}
            >
              {isFollowed ? "Unfollow" : "Follow"}
            </button>
          </div>

          <div className="col-lg-6 col-md-7 col-6">
            <div className="author__wrap creator_author_wrap">
              <div className="author__followers btn-glow-outline">
                <p> <span> {likes} </span> Followers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Author;

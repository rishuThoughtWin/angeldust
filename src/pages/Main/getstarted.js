import React, { useEffect, useState } from "react";
import wallet from "assets/img/wallet.png";
import create from "assets/img/create.png";
import addTo from "assets/img/addTo.png";
import BFW from "assets/img/whale.png";
import Aos from "aos";
import "aos/dist/aos.css";
import { Link, useHistory } from "react-router-dom";
import Sell1 from "../../assets/img/sell/1.png";
import Sell2 from "../../assets/img/sell/2.png";
import Sell3 from "../../assets/img/sell/3.png";
import Sell4 from "../../assets/img/sell/4.png";
import Drop1 from "../../assets/img/drop/1.png";
import Drop2 from "../../assets/img/drop/2.png";
import Drop3 from "../../assets/img/drop/3.png";
import Drop4 from "../../assets/img/drop/4.png";
import Verify from "../../assets/img/icons/verify.png";
import {
  getTopCreators,
  getTopBuyers,
  getTopSallers,
  getLatestCreator,
} from "apis";
import { DefaultAvatar } from "../../constants";
import { getLatestCollection } from "apis";
import { useSelector } from "react-redux";

function GetStarted() {
  const [topCollection, setTopCollection] = useState(null);
  const [topBuyers, setTopBuyers] = useState(null);
  const [topSallers, setTopSallers] = useState(null);
  const loginNetwork = useSelector((state) => state?.loginNetwork?.value);
  const history = useHistory();

  useEffect(() => {
    getTopLaunchPadCreators();
    getTopLaunchPadPadBuyers();
    getTopLaunchPadSellers();
  }, [loginNetwork]);

  useEffect(() => {
    Aos.init({
      duration: 2000,
    });
  });

  const networkId = localStorage.getItem("networkId");
  const networkName = localStorage.getItem("networkName");
  let req = null;
  if (networkId && networkName) {
    req = {
      networkId: networkId,
      networkName: networkName,
    };
  } else {
    req = {
      networkId: "97",
      networkName: "Binance",
    };
  }

  const getTopLaunchPadCreators = async () => {
    const res = await getLatestCollection(req);
    if (res) {
      setTopCollection(res?.data?.success?.data);
    }
  };

  const getTopLaunchPadPadBuyers = async () => {
    const res = await getTopBuyers();
    if (res) {
      setTopBuyers(res?.data?.success?.data);
    }
  };

  const getTopLaunchPadSellers = async () => {
    const res = await getTopSallers();
    if (res) {
      setTopSallers(res?.data?.success?.data);
    }
  };

  return (
    <div>
      {/* Sellers and Buyers */}
      <div className="sell_buy_div pt-md-5 pb-md-5 pt-3">
        <div className="container">
          <div className="row justify-content-center">
            <div className="topSellersCol col-lg-6 col-md-6 col-sm-12 col-12 col-xl-4">
              <div className="sell_buy_content">
                <div className="topSellersHeadline text-center mb-4">Latest Collections</div>
                {topCollection &&
                  topCollection.map((item, index) => {
                    return (
                      <div className="drop_div">
                        <a onClick={()=>history.push(`/collection/${item?.id}/${item?.collectionAddress}/test`)}>
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-2 col-3">
                              <div className="drop_img">
                                <img
                                  src={
                                    item?.imageCover
                                      ? item?.imageCover
                                      : DefaultAvatar
                                  }
                                  alt="Top Collection"
                                />
                                <span>{index + 1}</span>
                              </div>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9 col-9 pl-md-3">
                              <div className="drop_content">
                                <h5 className="mt-2 mb-1">
                                  {item?.collectionName}
                                </h5>
                                <p className="mb-0">
                                  {item?.mintCost} {item?.currency}
                                </p>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="topSellersCol col-lg-6 col-md-6 col-sm-12 col-12 col-xl-4">
              <div className="sell_buy_content">
                <div className="topSellersHeadline text-center mb-4">Top Sellers</div>
                {topSallers &&
                  topSallers.map((item, index) => {
                    return (
                      <div className="drop_div">
                        <Link to={`/creator-public/${item.account}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-2 col-3">
                              <div className="drop_img">
                                <img
                                  src={
                                    item?.avatar ? item?.avatar : DefaultAvatar
                                  }
                                  alt="topSellers"
                                />
                                <span>{index + 1}</span>
                              </div>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9 col-9 pl-md-3">
                              <div className="drop_content">
                                <h5 className="mt-2 mb-1">
                                  {item?.firstName} {item?.lastName}
                                </h5>
                                <p className="mb-0"></p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="topSellersCol col-lg-6 col-md-6 col-sm-12 col-12 col-xl-4">
              <div className="sell_buy_content">
                <div className="topSellersHeadline text-center mb-4">Top Buyers</div>
                {topBuyers &&
                  topBuyers.map((item, index) => {
                    return (
                      <div className="drop_div">
                        <Link to={`/creator-public/${item.account}`}>
                          <div className="row">
                            <div className="col-lg-3 col-md-3 col-sm-2 col-3">
                              <div className="drop_img">
                                <img
                                  src={
                                    item?.avatar ? item?.avatar : DefaultAvatar
                                  }
                                  alt="topBuyers"
                                />
                                <span>{index + 1}</span>
                              </div>
                            </div>
                            <div className="col-lg-9 col-md-9 col-sm-9 col-9 pl-md-3">
                              <div className="drop_content">
                                <h5 className="mt-2 mb-1">
                                  {item?.firstName} {item?.lastName}
                                </h5>
                                <p className="mb-0"></p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sell NFT */}
      <div className="sell_nft_div pt-md-5 pb-md-5 pb-0 pt-3">
        <div className="container">
          <h2 className="same_heading mb-5 pb-2">Create and Sell Your NFTs</h2>

          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="sell_content">
                <div className="sell_img">
                  <img src={Sell1} alt="Image" />
                </div>
                <h5>Go step 1</h5>
                <h3>Create and Sell</h3>
                <p className="mb-0">
                  Once you've set up your wallet of choice, connect it to
                  Angeldust by clicking the wallet icon in the top right corner.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12">
              <div className="sell_content">
                <div className="sell_img">
                  <img src={Sell2} alt="Image" />
                </div>
                <h5>Go step 2</h5>
                <h3>Create and Sell</h3>
                <p className="mb-0">
                  Click My Collections and set up your collection. Add social
                  links, a description, profile & banner images, and set a
                  secondary sales fee.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-md-0 mb-sm-0">
              <div className="sell_content">
                <div className="sell_img">
                  <img src={Sell3} alt="Image" />
                </div>
                <h5>Go step 3</h5>
                <h3>Create and Sell</h3>
                <p className="mb-0">
                  Upload your work (image, video, audio, or 3D art), add a title
                  and description, and customize your NFTs with properties,
                  stats, and unlockable content.
                </p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6 col-sm-6 col-12 mb-md-0 mb-sm-0">
              <div className="sell_content">
                <div className="sell_img">
                  <img src={Sell4} alt="Image" />
                </div>
                <h5>Go step 4</h5>
                <h3>Create and Sell</h3>
                <p className="mb-0">
                  Choose between auctions, fixed-price listings, and
                  declining-price listings. You choose how you want to sell your
                  NFTs, and we help you sell them!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container d-none">
        <div className="row">
          <div className="col-md-12 text-center mt-5 mb-4">
            <Link to="/creators" className="buy-btn-explore">
              Creators
            </Link>
          </div>
        </div>
        <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 text-center w-100 mb-3 border_both_head2">
          create and sell your nfts
        </p>
        <div className="createsell_content">
          <div className="row">
            <div className="col-lg-4 col-md-5 col-12">
              <div className="createsell_content_box">
                <span>1</span>
                <h3>set up your wallet</h3>
                <p>
                  Once you've set up your wallet of choice, connect it to
                  Angeldust by clicking the wallet icon in the top right corner.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-2 col-12"></div>

            <div className="col-lg-4 col-md-5 col-12">
              <div className="createsell_content_box">
                <span>2</span>
                <h3>create your collection</h3>
                <p>
                  Click My Collections and set up your collection. Add social
                  links, a description, profile & banner images, and set a
                  secondary sales fee.
                </p>
              </div>
            </div>
          </div>
          <div className="createsell_img d-md-block d-none">
            <img src={BFW} alt="Image" />
          </div>

          <div className="row">
            <div className="col-lg-4 col-md-5 col-12">
              <div className="createsell_content_box">
                <span>3</span>
                <h3>
                  add your <br /> nfts
                </h3>
                <p>
                  Upload your work (image, video, audio, or 3D art), add a title
                  and description, and customize your NFTs with properties,
                  stats, and unlockable content.
                </p>
              </div>
            </div>

            <div className="col-lg-4 col-md-2 col-12"></div>

            <div className="col-lg-4 col-md-5 col-12">
              <div className="createsell_content_box">
                <span>4</span>
                <h3>
                  list them for <br /> sale
                </h3>
                <p>
                  Choose between auctions, fixed-price listings, and
                  declining-price listings. You choose how you want to sell your
                  NFTs, and we help you sell them!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* old get started */}
      <div className="row row--grid mb-50 d-none">
        {/* <!-- title --> */}
        <div className="col-12">
          <p className="nft-text-center nft-font-36 text-white nft-mt-60 nft-mb-60 mt-150 mb-75">
            How to Get Started
          </p>
        </div>
        {/* <!-- end title --> */}

        <div
          className="col-12 col-md-6 col-lg-4 "
          data-aos-delay="100"
          data-aos="fade-right"
        >
          {" "}
          {/* data-aos="fade-down" */}
          <div className="feature bleuFrosted p-4">
            <div className="headTag">
              <span className="feature__icon">
                <img src={wallet} alt="no wallet" />
              </span>
              <h3 className="feature__title">Connect Wallet</h3>
            </div>
            <p className="feature__text">
              Welcome to Angeldust. Getting started on our NFT Marketplace is
              pretty simple. Just connect your wallet on the BSC Network by
              clicking on "Connect Wallet".
            </p>
          </div>
        </div>

        <div
          className="col-12 col-md-6 col-lg-4 "
          data-aos-delay="500"
          data-aos="fade-right"
        >
          <div className="feature bleuFrosted p-4 getStartedPanelMargin100">
            <div className="headTag">
              <span className="feature__icon feature__icon--green">
                <img src={create} alt="no wallet" />
              </span>
              <h3 className="feature__title">Create Profile</h3>
            </div>
            <p className="feature__text">
              Once you're connected you can set up your profile. Tell us a bit
              about you and link your socials. Upload an avatar and banner image
              to showcase your work. Next step is creating your first NFT.
            </p>
          </div>
        </div>

        <div
          className="col-12 col-md-6 col-lg-4 "
          data-aos-delay="900"
          data-aos="fade-right"
        >
          <div className="feature bleuFrosted p-4 getStartedPanelMargin200">
            <div className="headTag">
              <span className="feature__icon feature__icon--purple">
                <img src={addTo} alt="no wallet" />
              </span>
              <h3 className="feature__title">Create NFT</h3>
            </div>
            <p className="feature__text">
              You decide what you want to upload. Angeldust supports images,
              audio and video. You can be as creative as you want to. Mining is
              free of charge so start creating your NFTs now and list them with
              one click.+
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;

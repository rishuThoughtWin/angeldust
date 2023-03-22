import React from "react";
import { Link } from "react-router-dom";
import BFW from 'assets/img/ad_bsc_abstractElement.svg';
import chain1 from 'assets/img/Chain 1.png';
import chain2 from 'assets/img/Chain 2.png';
import chain3 from 'assets/img/Chain 3.png';
import chain4 from 'assets/img/Chain 4.png';


function Banner() {
    return (
       <div className="heroBanner">



            <div className="top_banner_div mt-5 mb-5">
                <div className="container">
                    <div className="">
            
                        <div className="top_banner_content">
                        <div className="right_content d-md-none d-block">
                                <div className="banner_img">
                                    <img src={BFW} alt="Image" />
                                </div>
                            </div>

                            <div className="left_content mt-md-0 mt-5">
                                <p className="mb-0">
                                    Create, Explore & Collect digital NFTs, as well <br /> as connecting artists and
                                    collectors
                                </p>

                                <h1 className="mt-4 mb-4">
                                    The <span> #1 </span> Community <br />
                                    Focused <span> NFT </span> Marketplace
                                </h1>

                                <Link onClick={()=>window.open('https://bsctestnet-frontend.bleufi.com/explore')} className="btn explore_btn">
                                    Explore
                                </Link>

                            </div>

                                <div className="banner_img bannerImageRight">
                                    <img src={BFW} alt="Image" />
                                </div>
                        </div>


                    </div>
                </div>
            </div>



        </div>
    );
}

export default Banner;

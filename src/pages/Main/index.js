import React, { useEffect, useState } from "react";
import "intersection-observer";

import Sidebar from "../../components/Sidebar/sidebar";
import Banner from "./banner";
import Featured from "./featured";
import LiveAuction from "./liveauction";
import TopSeller from "./topseller";
// import TopBuyer from "./topbuyer";
import GetStarted from "./getstarted";
import "styles/main.css";

function Main() {
  const style = {};
  const options = {
    rootMargin: "100px",
    threshold: 1.0,
  };
  
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  
  return (
    <main className="main">
      <div class=" justify-content-center">


{/* 
        <div class="sidebarCol">
          <Sidebar />
        </div> */}

        <div class="contentCol">
          <Banner />

          <div className="container">
            <LiveAuction />
            <TopSeller />
          </div>
          <GetStarted />

          <div className="container">
            <Featured />
          </div>
        </div>
      </div>


    </main>
  );
}

export default Main;

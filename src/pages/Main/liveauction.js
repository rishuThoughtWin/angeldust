import { getAllCollectionHeaderData } from "apis";
import React, { useEffect, useState } from "react";

function LiveAuction() {
  const [price, setPrice] = useState(true);
  const [collectionData, setCollectionData] = useState({});

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = "./purecounter.js";
    document.getElementById("pureArea").appendChild(script);
    getAllCollectionHeader()
  }, []);

  const getAllCollectionHeader = async()=>{
    const res = await getAllCollectionHeaderData()
    if(res){
      setCollectionData(res?.data?.success?.data)
      setPrice(res?.data?.success?.data?.volumeTraded)
    }
  }

  return (
    <>
      <div id="pureArea"></div>
      <div className="counter_div">
        <p className="statsArea row">
          <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 padding-left-mob">
            <div className="counter_content bg_skyblue">
              <h4 className="mb-3">
                {collectionData?.items}
              </h4>
              <p className="mb-0">
                Items
              </p>
            </div>

          </div>
          <div className="col-6 col-sm-6 col-md-4 col-lg-4 col-xl-4 padding-left-mob">
            <div className="counter_content bg_purple">
              <h4 className="mb-3">
                 {collectionData?.volumeTraded ? collectionData?.volumeTraded?.toFixed(3) : 0}
              </h4>
              <p className="mb-0">
                total volume
              </p>
            </div>
         
          </div>
        </p>
      </div>
    </>
  );
}

export default LiveAuction;

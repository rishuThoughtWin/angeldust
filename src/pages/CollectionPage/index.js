import React, {useEffect, useState} from "react";
import 'styles/explore.css'
import './styles.css'
import CollectionCard from 'components/Card/collectionCard';
import LoaderNew from "components/Loader-New";
import {getAllCollectionsApi} from 'apis';

function Collectionpage() {
  const [nftCollection, setNFTCollection] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 20;

  useEffect(() => {
    getMyAllCollection(true);
  }, []);

  useEffect(() => {
    if (pageNo > 1)
      getMyAllCollection(false);
  }, [pageNo]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const getMyAllCollection = async (isNew = false,value) => {

    const page = isNew ? 1 : pageNo;
    const approve = true
    const account = ''
    const res = await getAllCollectionsApi(page, limitPerPage,value,account,approve);
    const data = res?.data?.data;

    setNFTCollection(isNew ? data : [...nftCollection, ...data]);
    setIsLoading(false);
    setTotalPage(res?.data?.totalPages);
    setCurrentPage(Number(res?.data?.currentPage));
  };
  
  const handleShowMoreImages = () => {
    setPageNo(pageNo + 1);
  };

  return (
    isLoading ? <LoaderNew />
      :
      <main className="main contentCol">
        <div className="hero_common">
          <div className="p-0 hero_border">
            <div className="row explorerPanel m-0" style={{ display: "flex", justifyContent: "center" }}>

              <div className="col-12 col-xl-10 col-lg-9 col-md-12 my-4 explorerRight collectionitemall">
                <div className="text-center market_head_top mt-3 mb-5">
                  <h1>Explore Marketplace Collections</h1>
                </div>
                <div className="row row--grid mt-20">
                  {
                    nftCollection && nftCollection.length === 0
                      ?
                      <h3 style={{color:"white"}}>No records found....</h3>
                      :
                      <>
                        {nftCollection?.map((card, index) => (
                          <div
                            className="col-6 col-md-4 col-lg-4 col-xl-3 mb-4 collectionitemfix"
                            key={`card-collection-${index}`}
                          >
                            <CollectionCard
                              data={card}
                              id={card.id}
                            />
                          </div>
                        ))}
                      </>
                  }
                  <div className="col-12">
                    {nftCollection && nftCollection.length > 0 && totalPage > currentPage &&
                      <button
                        className="main__load"
                        type="button"
                        onClick={handleShowMoreImages}
                        variant="contained"
                      >
                        Load more
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}

export default Collectionpage;
import React from "react";

import PendingCard from "../pendingCollection";
import Loader from "../../Loader";

export const CardBox = (props) => {
  const {
    getAllCollection,
    collection,
    handleFunc,
    handleShowMoreItemImages,
    totalPages,
    currentPage,
    play,
  } = props;

  return (
    <div className="col-md-10 center-height1 approve_content_mob mobpaddissue pb-5">
      <div id="tab-collection1" role="tabpanel" className="width_dash">
        {collection?.length > 0 ? (
          <div className="row row--grid mt-20">
            {collection?.map((card, index) => (
              <div className="col-6 col-md-4 col-lg-3">
                <div key={`card-collection-${index}`}>
                  <PendingCard
                    data={card}
                    handleFunc={handleFunc}
                    id={card.id}
                    reload={() => getAllCollection(true)}
                    key={card._id}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-20" style={{ textAlign: "center" }}>
            <h1 className="text-center pl-md-5 no-data-found">
              No Collection Found
            </h1>
          </div>
        )}

        {collection && collection?.length > 0 && totalPages > currentPage && (
          <div className="row row--grid">
            <div className="col-12">
              <div className="main-load-dashboard">
                {play ? (
                  <Loader isLoading={true} />
                ) : (
                  <button
                    className="main__load"
                    type="button"
                    onClick={() => {
                      handleShowMoreItemImages();
                    }}
                  >
                    Load more
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

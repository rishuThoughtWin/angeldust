import React, { useEffect } from "react";

function Token(props) {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="main contentCol">
      <div className="container">
        <div className="row row--grid">
          {/* breadcrumb */}
          <div className="col-12">
            <ul className="breadcrumb">
              <li className="breadcrumb__item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb__item breadcrumb__item--active">
                Token
              </li>
            </ul>
          </div>
          {/* end breadcrumb */}

          {/* title */}
          <div className="col-12 col-xl-11">
            <div className="main__title main__title--page">
              <h1>Angeldust – NFT Marketplace</h1>

              <p>
                Many desktop publishing packages and <a href="/">web page</a>{" "}
                editors now use Lorem Ipsum as their default model text, and a
                search for 'lorem ipsum' will uncover many web sites still in
                their infancy. Various versions have evolved over the years,
                sometimes by accident, sometimes on purpose (injected humour and
                the like).
              </p>

              <p>
                All the Lorem Ipsum generators on the <b>Internet</b> tend to
                repeat predefined chunks as necessary, making this the first
                true generator on the Internet. It uses a dictionary of over 200
                Latin words, combined with a handful of model sentence
                structures, to generate Lorem Ipsum which looks reasonable. The
                generated Lorem Ipsum is therefore always free from repetition,
                injected humour, or non-characteristic words etc.
              </p>
            </div>
          </div>
          {/* end title */}
        </div>

        <div className="row row--grid">
          <div className="col-12 col-lg-4">
            <div className="step">
              <span className="step__number">01</span>
              <h3 className="step__title">Set up your wallet</h3>
              <p className="step__text">
                It to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="step">
              <span className="step__number">02</span>
              <h3 className="step__title">Create your collection</h3>
              <p className="step__text">
                All the Lorem Ipsum generators on the Internet tend to repeat
                predefined chunks as necessary, making this the first
              </p>
            </div>
          </div>

          <div className="col-12 col-lg-4">
            <div className="step">
              <span className="step__number">03</span>
              <h3 className="step__title">Add your NFTs</h3>
              <p className="step__text">
                It to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="main__video-bg" data-bg="img/bg/bg2.png">
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-8 col-xl-8">
              <div className="main__title">
                <h2>Why choose us?</h2>

                <p>
                  All the Lorem Ipsum generators on the <b>Internet</b> tend to
                  repeat predefined chunks as necessary, making this the first
                  true generator on the Internet. It uses a dictionary of over
                  200 Latin words, combined with a handful of model sentence
                  structures, to generate Lorem Ipsum which looks reasonable.
                </p>

                <p>
                  Many desktop publishing packages and <a href="/">web page</a>{" "}
                  editors now use Lorem Ipsum as their default model text, and a
                  search for 'lorem ipsum' will uncover many web sites still in
                  their infancy.
                </p>

                <a
                  href="https://vimeo.com/45830194"
                  className="main__video open-video"
                >
                  Watch video
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row row--grid">
          {/* title */}
          <div className="col-12 col-xl-8">
            <div className="main__title">
              <h2>How you can get </h2>

              <p>
                Many desktop publishing packages and <a href="/">web page</a>{" "}
                editors now use Lorem Ipsum as their default model text, and a
                search for 'lorem ipsum' will uncover many web sites still in
                their infancy. Various versions have evolved over the years,
                sometimes by accident, sometimes on purpose (injected humour and
                the like).
              </p>
            </div>
          </div>
          {/* end title */}
        </div>

        <div className="row row--grid">
          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon feature__icon--blue">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M10,13H4a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V14A1,1,0,0,0,10,13ZM9,19H5V15H9ZM20,3H14a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,20,3ZM19,9H15V5h4Zm1,7H18V14a1,1,0,0,0-2,0v2H14a1,1,0,0,0,0,2h2v2a1,1,0,0,0,2,0V18h2a1,1,0,0,0,0-2ZM10,3H4A1,1,0,0,0,3,4v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V4A1,1,0,0,0,10,3ZM9,9H5V5H9Z" />
                </svg>
              </span>
              <h3 className="feature__title">Create and sell</h3>
              <p className="feature__text">
                It to make a type specimen book. It has survived not only five
                centuries, but also the leap into electronic typesetting,
                remaining
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon feature__icon--red">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M2.5,10.56l9,5.2a1,1,0,0,0,1,0l9-5.2a1,1,0,0,0,0-1.73l-9-5.2a1,1,0,0,0-1,0l-9,5.2a1,1,0,0,0,0,1.73ZM12,5.65l7,4-7,4.05L5,9.69Zm8.5,7.79L12,18.35,3.5,13.44a1,1,0,0,0-1.37.36,1,1,0,0,0,.37,1.37l9,5.2a1,1,0,0,0,1,0l9-5.2a1,1,0,0,0,.37-1.37A1,1,0,0,0,20.5,13.44Z" />
                </svg>
              </span>
              <h3 className="feature__title">Collect NFTs</h3>
              <p className="feature__text">
                If you are going to use a passage of Lorem Ipsum, you need to be
                sure there isn't anything embarrassing hidden in the middle of
                text
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon feature__icon--purple">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20.49,7.52a.19.19,0,0,1,0-.08.17.17,0,0,1,0-.07l0-.09-.06-.15,0,0h0l0,0,0,0a.48.48,0,0,0-.09-.11l-.09-.08h0l-.05,0,0,0L16.26,4.45h0l-3.72-2.3A.85.85,0,0,0,12.25,2h-.08a.82.82,0,0,0-.27,0h-.1a1.13,1.13,0,0,0-.33.13L4,6.78l-.09.07-.09.08L3.72,7l-.05.06,0,0-.06.15,0,.09v.06a.69.69,0,0,0,0,.2v8.73a1,1,0,0,0,.47.85l7.5,4.64h0l0,0,.15.06.08,0a.86.86,0,0,0,.52,0l.08,0,.15-.06,0,0h0L20,17.21a1,1,0,0,0,.47-.85V7.63S20.49,7.56,20.49,7.52ZM12,4.17l1.78,1.1L8.19,8.73,6.4,7.63Zm-1,15L5.5,15.81V9.42l5.5,3.4Zm1-8.11L10.09,9.91l5.59-3.47L17.6,7.63Zm6.5,4.72L13,19.2V12.82l5.5-3.4Z" />
                </svg>
              </span>
              <h3 className="feature__title">
                Get airdrop <br />
                as user
              </h3>
              <p className="feature__text">
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon feature__icon--green">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M20.47,7.37s0,0,0-.08l-.06-.15a.71.71,0,0,0-.07-.09.94.94,0,0,0-.09-.12l-.09-.07L20,6.78l-7.5-4.63a1,1,0,0,0-1.06,0L4,6.78l-.09.08-.09.07a.94.94,0,0,0-.09.12.71.71,0,0,0-.07.09l-.06.15s0,0,0,.08a1.15,1.15,0,0,0,0,.26v8.74a1,1,0,0,0,.47.85l7.5,4.63h0a.47.47,0,0,0,.15.06s.05,0,.08,0a.86.86,0,0,0,.52,0s.05,0,.08,0a.47.47,0,0,0,.15-.06h0L20,17.22a1,1,0,0,0,.47-.85V7.63A1.15,1.15,0,0,0,20.47,7.37ZM11,19.21l-5.5-3.4V9.43L11,12.82Zm1-8.12L6.4,7.63,12,4.18l5.6,3.45Zm6.5,4.72L13,19.21V12.82l5.5-3.39Z" />
                </svg>
              </span>
              <h3 className="feature__title">
                Get airdrop <br />
                as KCS holder
              </h3>
              <p className="feature__text">
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M7,6H6V3A1,1,0,0,0,4,3V6H3A1,1,0,0,0,3,8H7A1,1,0,0,0,7,6ZM5,10a1,1,0,0,0-1,1V21a1,1,0,0,0,2,0V11A1,1,0,0,0,5,10Zm7,8a1,1,0,0,0-1,1v2a1,1,0,0,0,2,0V19A1,1,0,0,0,12,18Zm9-8H20V3a1,1,0,0,0-2,0v7H17a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Zm-2,4a1,1,0,0,0-1,1v6a1,1,0,0,0,2,0V15A1,1,0,0,0,19,14Zm-5,0H13V3a1,1,0,0,0-2,0V14H10a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Z" />
                </svg>
              </span>
              <h3 className="feature__title">Hustle in DAO</h3>
              <p className="feature__text">
                It has survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21.3,10.08A3,3,0,0,0,19,9H14.44L15,7.57A4.13,4.13,0,0,0,11.11,2a1,1,0,0,0-.91.59L7.35,9H5a3,3,0,0,0-3,3v7a3,3,0,0,0,3,3H17.73a3,3,0,0,0,2.95-2.46l1.27-7A3,3,0,0,0,21.3,10.08ZM7,20H5a1,1,0,0,1-1-1V12a1,1,0,0,1,1-1H7Zm13-7.82-1.27,7a1,1,0,0,1-1,.82H9V10.21l2.72-6.12A2.11,2.11,0,0,1,13.1,6.87L12.57,8.3A2,2,0,0,0,14.44,11H19a1,1,0,0,1,.77.36A1,1,0,0,1,20,12.18Z" />
                </svg>
              </span>
              <h3 className="feature__title">Vote for platform upgrades</h3>
              <p className="feature__text">
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature">
              <span className="feature__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68a1,1,0,0,0,.4,1,1,1,0,0,0,1.05.07L12,18.76l5.1,2.68a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.89l.72,4.19-3.76-2a1,1,0,0,0-.94,0l-3.76,2,.72-4.19a1,1,0,0,0-.29-.89l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                </svg>
              </span>
              <h3 className="feature__title">Choose featured artworks</h3>
              <p className="feature__text">
                Various versions have evolved over the years, sometimes by
                accident, sometimes on purpose
              </p>
            </div>
          </div>

          <div className="col-12 col-md-6 col-lg-4 col-xl-3">
            <div className="feature feature--last">
              <span className="feature__icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M21.92,11.6C19.9,6.91,16.1,4,12,4S4.1,6.91,2.08,11.6a1,1,0,0,0,0,.8C4.1,17.09,7.9,20,12,20s7.9-2.91,9.92-7.6A1,1,0,0,0,21.92,11.6ZM12,18c-3.17,0-6.17-2.29-7.9-6C5.83,8.29,8.83,6,12,6s6.17,2.29,7.9,6C18.17,15.71,15.17,18,12,18ZM12,8a4,4,0,1,0,4,4A4,4,0,0,0,12,8Zm0,6a2,2,0,1,1,2-2A2,2,0,0,1,12,14Z" />
                </svg>
              </span>
              <h3 className="feature__title">
                Participate <br />
                in moderation
              </h3>
              <p className="feature__text">
                If you are going to use a passage of Lorem Ipsum, you need to be
                sure there isn't anything embarrassing
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Token;

import React from "react";
import { Link } from "react-router-dom";
import logo from 'assets/img/ad_logo.png';

import Twitter from 'assets/img/social/twitter.png';
import Telegram from 'assets/img/social/telegram.png';
import Instagram from 'assets/img/social/instagram.png';
import Audit1 from 'assets/img/audit1.png';
import Audit2 from 'assets/img/audit2.png';

import "styles/footer.css";

function Routes() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-12  col-md-6 offset-lg-3">
            <div className="foot_left_space">
              <div className="footer__logospace">
                <img src={logo} alt="Image" />

                <p className="footer__tagline mt-3 mb-3 pb-5 d-lg-block d-md-none d-none">
                  Angel Dust Marketplace is a next generation <br /> marketplace where artists and collectors
                  can <br /> create, sell and collect digital items secured with <br /> blockchain.
                </p>

                <p className="footer__tagline mt-3 mb-3 pb-0 d-lg-none d-md-block d-block">
                  Angel Dust Marketplace is a next generation marketplace where artists and collectors can
                  create, sell and collect digital items secured with blockchain.
                </p>
              </div>
            </div>

            {/* <div className="footer__lang text-center text-md-left">
              <a
                className="footer__lang-btn"
                href="/"
                role="button"
                id="dropdownLang"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <img src="assets/img/flags/uk.svg" alt="" />
                <span>English</span>
              </a>

              <ul
                className="dropdown-menu footer__lang-dropdown"
                aria-labelledby="dropdownLang"
              >
                <li>
                  <a href="/">
                    <img src="assets/img/flags/spain.svg" alt="" />
                    <span>Spanish</span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <img src="assets/img/flags/russia.svg" alt="" />
                    <span>Russian</span>
                  </a>
                </li>
                <li>
                  <a href="/">
                    <img src="assets/img/flags/china.svg" alt="" />
                    <span>Chinese</span>
                  </a>
                </li>
              </ul>
            </div> */}
          </div>

          <div className="col-12  col-md-3">
            <div className="row">
              <div className="col-12">
                <h6 className="footer__title">Angel Dust</h6>
                <div className="footer__nav w-100">
                  <Link onClick={()=>window.open('https://bsctestnet-frontend.bleufi.com/explore')} className="footerLink w-100">
                    Explore
                  </Link>
                  {/* <Link to="#" className="footerLink w-100">
                    How it works
                  </Link> */}
                  <Link to="/creators" className="footerLink">
                    Creators
                  </Link>

                  <div className="footer__social">
                    <div className="footerLink">
                      <a
                          href="https://twitter.com/AngelDustHQ"
                          target="_blank"
                          rel="noreferrer"
                      >
                        <img src={Twitter} alt="Twitter" />
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" />
                  </svg> */}
                      </a>

                      {/* <a
                  href="#"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src={Linkdien} alt="Linkdien" />
                </a> */}

                      <a href="https://t.me/AngelDustHQ" target="_blank" rel="noreferrer">
                        <img src={Telegram} className="telegram" alt="telegram" />
                        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-2.98846.01069.00848.00683-.059s4.885-4.44751,5.084-4.637c.20147-.189.135-.23.135-.23.01147-.23053-.36152,0-.36152,0L8.16632,13.299l-2.69549-.918s-.414-.1485-.453-.475c-.041-.324.46649-.5.46649-.5l10.717-4.25751s.881-.39252.881.25751Z" />
                  </svg> */}
                      </a>

                      <a
                          href="https://www.instagram.com/angeldusthq/"
                          target="_blank"
                          rel="noreferrer"
                      >
                        <img src={Instagram} alt="Instagram" />
                      </a>


                      {/* <svg
                      viewBox="0 0 800 800"
                      xmlns="http://www.w3.org/2000/svg"
                      width="2500"
                      height="2500"
                    >
                      <circle cx="400" cy="400" fill="#ff4500" r="400" />
                      <path
                        d="M666.8 400c.08 5.48-.6 10.95-2.04 16.24s-3.62 10.36-6.48 15.04c-2.85 4.68-6.35 8.94-10.39 12.65s-8.58 6.83-13.49 9.27c.11 1.46.2 2.93.25 4.4a107.268 107.268 0 0 1 0 8.8c-.05 1.47-.14 2.94-.25 4.4 0 89.6-104.4 162.4-233.2 162.4S168 560.4 168 470.8c-.11-1.46-.2-2.93-.25-4.4a107.268 107.268 0 0 1 0-8.8c.05-1.47.14-2.94.25-4.4a58.438 58.438 0 0 1-31.85-37.28 58.41 58.41 0 0 1 7.8-48.42 58.354 58.354 0 0 1 41.93-25.4 58.4 58.4 0 0 1 46.52 15.5 286.795 286.795 0 0 1 35.89-20.71c12.45-6.02 25.32-11.14 38.51-15.3s26.67-7.35 40.32-9.56 27.45-3.42 41.28-3.63L418 169.6c.33-1.61.98-3.13 1.91-4.49.92-1.35 2.11-2.51 3.48-3.4 1.38-.89 2.92-1.5 4.54-1.8 1.61-.29 3.27-.26 4.87.09l98 19.6c9.89-16.99 30.65-24.27 48.98-17.19s28.81 26.43 24.71 45.65c-4.09 19.22-21.55 32.62-41.17 31.61-19.63-1.01-35.62-16.13-37.72-35.67L440 186l-26 124.8c13.66.29 27.29 1.57 40.77 3.82a284.358 284.358 0 0 1 77.8 24.86A284.412 284.412 0 0 1 568 360a58.345 58.345 0 0 1 29.4-15.21 58.361 58.361 0 0 1 32.95 3.21 58.384 58.384 0 0 1 25.91 20.61A58.384 58.384 0 0 1 666.8 400zm-396.96 55.31c2.02 4.85 4.96 9.26 8.68 12.97 3.71 3.72 8.12 6.66 12.97 8.68A40.049 40.049 0 0 0 306.8 480c16.18 0 30.76-9.75 36.96-24.69 6.19-14.95 2.76-32.15-8.68-43.59s-28.64-14.87-43.59-8.68c-14.94 6.2-24.69 20.78-24.69 36.96 0 5.25 1.03 10.45 3.04 15.31zm229.1 96.02c2.05-2 3.22-4.73 3.26-7.59.04-2.87-1.07-5.63-3.07-7.68s-4.73-3.22-7.59-3.26c-2.87-.04-5.63 1.07-7.94 2.8a131.06 131.06 0 0 1-19.04 11.35 131.53 131.53 0 0 1-20.68 7.99c-7.1 2.07-14.37 3.54-21.72 4.39-7.36.85-14.77 1.07-22.16.67-7.38.33-14.78.03-22.11-.89a129.01 129.01 0 0 1-21.64-4.6c-7.08-2.14-13.95-4.88-20.56-8.18s-12.93-7.16-18.89-11.53c-2.07-1.7-4.7-2.57-7.38-2.44s-5.21 1.26-7.11 3.15c-1.89 1.9-3.02 4.43-3.15 7.11s.74 5.31 2.44 7.38c7.03 5.3 14.5 9.98 22.33 14s16 7.35 24.4 9.97 17.01 4.51 25.74 5.66c8.73 1.14 17.54 1.53 26.33 1.17 8.79.36 17.6-.03 26.33-1.17A153.961 153.961 0 0 0 476.87 564c7.83-4.02 15.3-8.7 22.33-14zm-7.34-68.13c5.42.06 10.8-.99 15.81-3.07 5.01-2.09 9.54-5.17 13.32-9.06s6.72-8.51 8.66-13.58A39.882 39.882 0 0 0 532 441.6c0-16.18-9.75-30.76-24.69-36.96-14.95-6.19-32.15-2.76-43.59 8.68s-14.87 28.64-8.68 43.59c6.2 14.94 20.78 24.69 36.96 24.69z"
                        fill="#fff"
                      />
                    </svg> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-6">
                <h6 className="footer__title">Community</h6>
                <div className="footer__nav">
                  <div className="footer__nav w-100">
                    <Link to="#" className="footerLink w-100">
                      $BLEU Token
                    </Link>
                    <Link to="#" className="footerLink">
                      Discussion
                    </Link>
                    <Link to="#" className="footerLink">
                      Docs
                    </Link>
                    <Link to="#" className="footerLink">
                      Contact
                    </Link>
                    <a
                      href="/assets/terms/Website_General_Terms_of_Use_Flokinomics.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="footerLink d-none"
                    >
                      Website General Terms of Use
                    </a>
                    <a
                      href="/assets/terms/Website_Privacy_Policy_Flokinomics.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="footerLink d-none"
                    >
                      Privacy Policy
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>


        </div>
      </div>

      <div className="footer__content">
        <div className="container">
          <div className="row">
            <div className="col-md-6 col-12">
              <small className="footer__copyright text-center text-md-left d-inline-block">
                © 2022 Angel Dust All rights reserved.{" "}
              </small>

              {/* <ul className="d-inline-block condition_list">
                <li>
                  <Link to="/assets/terms/Website_General_Terms_of_Use_Flokinomics.pdf" className="footerLink" target="_blank"
                    rel="noreferrer">
                    Terms
                  </Link>
                </li>

                <li>
                  <Link
                    to="/assets/terms/Website_Privacy_Policy_Flokinomics.pdf"
                    className="footerLink"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Privacy
                  </Link>
                </li>
              </ul> */}
            </div>

            <div className="col-md-6 col-12 d-none">
              <p className="audit_foot">Audited By: <img src={Audit1} className="ml-2" alt="Image" /> <img src={Audit2} className="ml-2" alt="Image" /> </p>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Routes;

import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { RPC_URLS, walletconnect } from "../Header/connectors";
import { useDispatch, useSelector } from "react-redux";

import "./walletconnect.css"

const Walletconnect = (props) => {
    const connectorsByName = {
        walletConnect: walletconnect,
      };
      const dispatch = useDispatch();
      const context = useWeb3React();
      const {
        connector,
        error,
      } = context;
    const [activatingConnector, setActivatingConnector] = useState();
    return (
                <div className="mfp-wrap">
                  <div className="mfp-container">
                    <div
                      className="mfp-backdrop"
                      onClick={() => {
                        props.setEnableConnectWalletModal(false);
                      }}
                    ></div>
                    <div className="zoom-anim-dialog mfp-preloader modal modal--form">
                      <button
                        className="modal__close"
                        onClick={() => {
                          dispatch({ type: "SET_LOGIN_MODAL", payload: { value: false } });
                          props.setEnableConnectWalletModal(false);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path d="M13.41,12l4.3-4.29a1,1,0,1,0-1.42-1.42L12,10.59,7.71,6.29A1,1,0,0,0,6.29,7.71L10.59,12l-4.3,4.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l4.29,4.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42Z" />
                        </svg>
                      </button>


                        <div>
                      <h4 className="sign__title">Connect Your Wallet</h4>
                      <div className="sign__group sign__group--row">
                        <label
                          className="sign__label"
                          htmlFor="placebid"
                          style={{ color: "black" }}
                        >
                          Connect with one of our available wallet providers or create
                          a new one.
                        </label>
                      </div>
                            <button className="sale_btn" onClick={()=>props.connectMetaMast(true,props.selectChainId)}>
                                <img
                                    src={
                                        "https://d1gqvtt7oelrdv.cloudfront.net/assets/images/metamask.svg"
                                    }
                                    width={30}
                                    height={30}
                                    style={{ marginRight: "15px" }}
                                    alt=""
                                />
                                MetaMask
                            </button>
                            <button className="sale_btn">
                                <img
                                    src={
                                        "https://trustwallet.com/assets/images/media/assets/TWT.svg"
                                    }
                                    width={30}
                                    height={30}
                                    style={{ marginRight: "10px" }}
                                    alt=""
                                />

                        {Object.keys(connectorsByName).map((name) => {
                          const currentConnector = connectorsByName[name];
                          const activating = currentConnector === activatingConnector;
                          const connected = currentConnector === connector;
                          const disabled =
                            !!activatingConnector ||
                            connected ||
                            !!error;

                          return (
                            <button
                              style={{ fontWeight: "bold", color: "white" }}
                              disabled={disabled}
                              key={name}
                              onClick={()=>props.connectTrustWallet(props.selectChainId)}
                            >
                              WalletConnect
                            </button>
                          );
                        })}
                      </button>
                        </div>
                    </div>
                  </div>
                </div>
    );
}

export default Walletconnect;

import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { URI_AVAILABLE } from "@web3-react/walletconnect-connector";
import Switch from "react-switch";
import { Link, useHistory, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Web3 from "web3";
import Sidebar from "../../components/Sidebar/sidebar";
import { useEagerConnect } from "../../hooks/useEagerConnect";
import { DefaultETHNetwork, DefaultNetwork } from "../../constants/index";
import { setTheme } from "../../actions/themeAction";
import logo from "assets/img/ad_logo.png";
import Search from "assets/img/icons/search.png";
import { RPC_URLS, walletconnect } from "./connectors";
import ETH from "../../assets/img/icons/eth.png";
import BNB from "../../assets/img/icons/bnb.png";

import "styles/header.css";

import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  Get_Profile_By_AccountId,
  getNonceCode,
  verifySignatureApi,
} from "apis";
import LoaderNew from "components/Loader-New";
import Walletconnect from "pages/WalletConnect/WalletConnect";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [DefaultNetwork, 1, 56, DefaultNetwork],
});
function Header() {
  const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
  } = context;
  const { theme } = useSelector((state) => state.web3);
  const loginActive = useSelector((state) => state?.loginNetwork?.isActive);
  const loginModal = useSelector((state) => state?.loginModel?.value);
  const userDetails = useSelector((state) => state?.user);
  const [accounts, setAccounts] = useState(account);
  const [isLoadedMetaMask, setIsLoadedMetaMask] = useState(true);
  const networkId = localStorage.getItem("networkId");
  const [selectChainId, setSelectChainId] = useState(networkId == DefaultETHNetwork ? DefaultETHNetwork : DefaultNetwork);
  const [selectChainNetwork, setSelectChainIdNetwork] = useState(networkId == DefaultETHNetwork ? "Ethereum" : "BSC");
  const [networkLogo, setNetworkLogo] = useState(networkId == DefaultETHNetwork ? ETH : BNB);
  const history = useHistory();
  const mobileAccount = localStorage.getItem("mobileAccount");
  const [enableMobileAccount, setEnableMobileAccount] = useState(mobileAccount);
  const path = window?.location?.pathname;
  const [test, setTest] = useState(null);
  const [user, setUser] = useState({
    account: test,
    avatar: "assets/img/avatars/avatar.jpg",
    imageCover: "/assets/img/bg/bg.png",
    firstName: "",
    lastName: "",
    nickName: "",
    bio: "",
    twitter: "",
    telegram: "",
    instagram: "",
    subscribe: "",
    followers: [],
  });

  const [enableConnectWalletModal, setEnableConnectWalletModal] =
    useState(false);
  const [headerTop, setHeaderTop] = useState(false);
  const [mobileProvider, setMobileProvider] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", async () => {
        await localStorage.setItem("isActive", "false");
        history.push('/')
        dispatch({ type: "SET_LOGIN_NETWORK", payload: {value:selectChainId,isActive: 'false' } });
      });
      window.ethereum.on("accountsChanged", async () => {
        await localStorage.setItem("isActive", "false");
        history.push("/");
        dispatch({ type: "SET_LOGIN_NETWORK", payload: {value:selectChainId,isActive: 'false' } });
      });
    }
  });


  const connectWallet = async () => {
    setEnableConnectWalletModal(!enableConnectWalletModal);
  };

  const connectMetaMast = async (type = "CONNECT", id) => {
    try {
      setIsLoadedMetaMask(false);
      if (type === "DISCONNECT") {
        try {
          await localStorage.setItem("isActive", "false");
          setIsActive("false");
          dispatch({ type: "SET_TOKEN", payload: {} });
          dispatch({ type: "SET_ACTIVE", payload: { value: false } });
          dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: id, isActive: 'false' } });
          deactivate();
          localStorage.setItem("owner", false);
          setIsLoadedMetaMask(true);
          history.push("/");
          return;
          // history.push("/");
          // window.location.reload();
        } catch (e) {
          setIsLoadedMetaMask(true);
          console.log(e);
        }
      }

      setMobileProvider(false);
      if (!Web3.givenProvider && !window.ethereum) {
        setIsLoadedMetaMask(true);
        return window.open("https://metamask.app.link/dapp/mainnet-frontend.angeldust.id/");
      }
      const web3 = await new Web3(Web3.givenProvider || window.ethereum);
      const chainID = await web3.eth.net.getId();

      if (chainID === id) {
        const account1 = await web3.eth.requestAccounts();
        if (!account1.length > 0) {
          await window.ethereum
            .request({
              method: "wallet_requestPermissions",
              params: [
                {
                  eth_accounts: {},
                },
              ],
            })
            .then(() =>
              window.ethereum.request({ method: "eth_requestAccounts" })
            );
        }
        setSelectChainId(chainID)
        setSelectChainIdNetwork(selectChainNetwork)
        setNetworkLogo(networkLogo)
        localStorage.setItem("networkId", selectChainId)
      } else {
        const chainId = id;
        if (window.ethereum.networkVersion !== chainId) {
          try {
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [{ chainId: web3.utils.toHex(chainId) }],
            });
            connectMetaMast(true, id);
          } catch (err) {
            setIsLoadedMetaMask(true);
            // This error code indicates that the chain has not been added to MetaMask.
            if (err.code === 4902 || err.code === -32603) {
              if (id == 568) {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainName: `Doge Smart Chain ${chainId === 568 ? "Testnet" : "Mainnet"
                        }`,
                      chainId: web3.utils.toHex(chainId),
                      nativeCurrency: {
                        name: "wDoge",
                        decimals: 18,
                        symbol: "wDoge",
                      },
                      rpcUrls: ['https://rpc-testnet.dogechain.dog'],
                      blockExplorerUrls: [
                        `https://${chainId === 568 ? "explorer-testnet" : ""}.dogechain.dog/`,
                      ],
                    },
                  ],
                });
              }
              else {
                await window.ethereum.request({
                  method: "wallet_addEthereumChain",
                  params: [
                    {
                      chainName: `Binance Smart Chain ${chainId === 97 ? "Testnet" : "Mainnet"
                        }`,
                      chainId: web3.utils.toHex(chainId),
                      nativeCurrency: {
                        name: "BNB",
                        decimals: 18,
                        symbol: "BNB",
                      },
                      rpcUrls: [RPC_URLS[chainId]],
                      blockExplorerUrls: [
                        `https://${chainId === 97 ? "testnet" : ""}.bscscan.com/`,
                      ],
                    },
                  ],
                });
              }
              connectMetaMast(true, id);
            }
          }
        }
      }
      if (window.ethereum && chainID == id) {
        setEnableConnectWalletModal(false);
        let newAccount;
        if (!account) {
          newAccount = await web3.eth.requestAccounts();
          newAccount = newAccount[0];
        } else {
          newAccount = account;
        }
        const reqNonce = {
          account_address: newAccount,
        };
        const nonceData = await getNonceCode(reqNonce);
        const nonceId = nonceData?.data?.nonce;
        if (nonceId) {
          const signature = await web3.eth.personal.sign(nonceId, newAccount);
          const verifyReq = {
            nonce: nonceId,
            signature: signature,
          };
          const verifyData = await verifySignatureApi(verifyReq);
          if (verifyData?.status === 200) {
            if (verifyData?.data?.data?.user?.isAdmin) {
              await localStorage.setItem("owner", true);
            } else {
              await localStorage.setItem("owner", false);
            }
            if (id == DefaultNetwork) {
              setSelectChainId(DefaultNetwork); setSelectChainIdNetwork('BSC'); setNetworkLogo(BNB); localStorage.setItem("networkName", "Binance"); localStorage.setItem("networkId", DefaultNetwork); localStorage.setItem("currency", 'BNB');
            }
            else {
              setSelectChainId(DefaultETHNetwork); setSelectChainIdNetwork('Ethereum'); setNetworkLogo(ETH); localStorage.setItem("networkName", "Ethereum"); localStorage.setItem("networkId", DefaultETHNetwork); localStorage.setItem("currency", 'ETH');
            }
            dispatch({ type: "SET_TOKEN", payload: verifyData?.data?.data });
            dispatch({ type: "SET_ACTIVE", payload: { value: true } });
            dispatch({ type: "SET_LOGIN_MODAL", payload: { value: false } });
            dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: id, isActive: 'true' } });
            await activate(injectedConnector, (err) => console.log(err));
            setIsLoadedMetaMask(true);
            localStorage.setItem("isActive", "true");
            setIsActive("true");
            localStorage.setItem("wallet_address", newAccount);
            const web3 = new Web3(Web3.givenProvider || window.etherum);
            let currentAccount = await web3.eth.requestAccounts();
            currentAccount = currentAccount[0];
            setAccounts(currentAccount)
            setTest(currentAccount)
            const userData = await Get_Profile_By_AccountId(currentAccount, "");
            const userInfo = userData ? userData?.data : {};
            if (userInfo) {
              dispatch({ type: "SET_PROFILE", userInfo });
              setUser(userInfo);
            }
          } else {
            setIsLoadedMetaMask(true);
            dispatch({ type: "SET_TOKEN", payload: {} });
          }
        }
      }
    } catch (err) {
      setIsLoadedMetaMask(true);
      console.log("meta mask error", err);
    }
    // window.location.reload();
  };

  const disconnectWalletConnect = async () => {
    setIsLoadedMetaMask(false);
    const provider = new WalletConnectProvider({
      rpc: RPC_URLS,
      chainId: selectChainId
    });
    dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: selectChainId, isActive: 'false' } });
    dispatch({ type: "SET_TOKEN", payload: {} });
    await provider.close();
    setIsLoadedMetaMask(true);
    setEnableMobileAccount("false");
    localStorage.setItem("mobileAccount", "false");
    history.push("/");
  };

  const connectTrustWallet = async (id) => {
    try {
      setIsLoadedMetaMask(false);
      // let isIOS = /iPad|iPhone|iPod/.test(navigator?.platform);
      // if (isIOS) {
      //   alert(
      //     "If you want to use wallet connect in iphone device, Please choose MetaMask."
      //   );
      // }
      const provider = new WalletConnectProvider({
        rpc : RPC_URLS,
        chainId : selectChainId
      });
      setIsLoadedMetaMask(true);
      await provider.enable();
      setIsLoadedMetaMask(false);
      setEnableConnectWalletModal(false);
      const web3 = new Web3(provider);
      const newAccount = provider.accounts[0];

      if (newAccount) {
        setAccounts(newAccount);
        setMobileProvider(true);
      }
      if (newAccount) {
        const userData = await Get_Profile_By_AccountId(newAccount, "");
        const userInfo = userData ? userData?.data : {};
        if (userInfo) {
          dispatch({ type: "SET_PROFILE", userInfo });
          setUser(userInfo);
          const reqNonce = {
            account_address: newAccount,
          };
          const nonceData = await getNonceCode(reqNonce);
          const nonceId = nonceData?.data?.nonce;

          if (nonceId) {
            const signature = await web3.eth.personal.sign(nonceId, newAccount);
            const verifyReq = {
              nonce: nonceId,
              signature: signature,
            };
            const verifyData = await verifySignatureApi(verifyReq);
            if (verifyData?.status === 200) {
              if (id == DefaultNetwork) {
                setSelectChainId(DefaultNetwork); setSelectChainIdNetwork('BSC'); setNetworkLogo(BNB); localStorage.setItem("networkName", "Binance"); localStorage.setItem("networkId", DefaultNetwork); localStorage.setItem("currency", 'BNB');
              }
              else {
                setSelectChainId(DefaultETHNetwork); setSelectChainIdNetwork('Ethereum'); setNetworkLogo(ETH); localStorage.setItem("networkName", "Ethereum"); localStorage.setItem("networkId", DefaultETHNetwork); localStorage.setItem("currency", 'ETH');
              }
              dispatch({ type: "SET_TOKEN", payload: verifyData?.data?.data });
              dispatch({ type: "SET_ACTIVE", payload: { value: true } });
              dispatch({ type: "SET_LOGIN_MODAL", payload: { value: false } });
              dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: id, isActive: 'true' } });
              localStorage.setItem("mobileAccount", "true");
              setEnableMobileAccount("true");
              setIsLoadedMetaMask(true);
              history.push("/");
              setTest(newAccount)
              const userData = await Get_Profile_By_AccountId(newAccount, "");
              const userInfo = userData ? userData?.data : {};
              if (userInfo) {
                dispatch({ type: "SET_PROFILE", userInfo });
                setUser(userInfo);
              }
              localStorage.setItem("wallet_address", newAccount);
            } else {
              dispatch({ type: "SET_TOKEN", payload: {} });
              setIsLoadedMetaMask(true);
            }
          }
        } else {
          const reqNonce = {
            account_address: newAccount,
          };
          const nonceData = await getNonceCode(reqNonce);
          const nonceId = nonceData?.data?.nonce;

          if (nonceId) {
            //Get signature
            const signature = await web3.eth.personal.sign(nonceId, newAccount);
            //verify signature
            const verifyReq = {
              nonce: nonceId,
              signature: signature,
            };
            const verifyData = await verifySignatureApi(verifyReq);
            if (verifyData?.status === 200) {
              dispatch({
                type: "SET_TOKEN",
                payload: verifyData?.data?.data,
              });
              //auth.signInAnonymously().catch(alert);
              setEnableMobileAccount("true");
              setIsLoadedMetaMask(true);
              localStorage.setItem("mobileAccount", "true");
              history.push("/");
              localStorage.setItem("wallet_address", newAccount);
            } else {
              dispatch({ type: "SET_TOKEN", payload: {} });
              setIsLoadedMetaMask(true);
            }
          }
        }
      }
    } catch (err) {
      setIsLoadedMetaMask(true);
      console.log(err);
    }
  };

  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScroll(window.scrollY > 0);
    });
  }, []);

  // eslint-disable-next-line
  useEffect(async () => {
    if (selectChainNetwork == 'BSC') localStorage.setItem("currency", 'BNB')
    dispatch({ type: "SET_LOGIN_MODAL", payload: { value: false } });
    if (test) {
      const userData = await Get_Profile_By_AccountId(test, "");
      const userInfo = userData ? userData?.data : {};
      if (userInfo) {
        setUser(userInfo);
      }
    }
  }, [test,userDetails]);

  const [isActive, setIsActive] = useState(localStorage.getItem('isActive'));

  const dispatchUser = async (user_id) => {
    if (user_id) {
      const userData = await Get_Profile_By_AccountId(user_id, "");
      const userInfo = userData ? userData?.data : {};
      if (userInfo) {
        dispatch({ type: "SET_PROFILE", payload: userInfo });
        // setUser(userInfo);
      } else if (active) {
        const isActive = localStorage.getItem("isActive");
        if (isActive === "true") {
          toast.info(
            "Please set up your profile before you use the marketplace"
          );
          // history.push("/");
        } else {
        }
      }
    }
  };

  const updateTheme = (changeTheme = "light") => {
    dispatch(setTheme(changeTheme));
  };

  // eslint-disable-next-line
  useEffect(async () => {
    if (loginActive == 'true') {
      const web3 = new Web3(Web3.givenProvider || window.etherum);
      const getAccount = await web3.eth.requestAccounts()
      setTest(getAccount[0]);
    }
    if (mobileAccount === "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
        chainId: selectChainId
      });

      //  Enable session (triggers QR Code modal)
      await provider.enable();
      setAccounts(provider.accounts[0]);
      setTest(provider.accounts[0])
      setMobileProvider(true);
      dispatchUser(provider.accounts[0]);
      const wallet_address = localStorage.getItem("wallet_address");
      if (
        wallet_address?.toLowerCase() != provider.accounts[0]?.toLowerCase()
      ) {
        await localStorage.setItem("isActive", "false");
        await localStorage.setItem("owner", false);
        setIsActive("false");
        // history.push("/");
      }
    } else {
      if (account) {
        dispatchUser(account);
        const wallet_address = localStorage.getItem("wallet_address");
        if (wallet_address?.toLowerCase() !== account?.toLowerCase()) {
          await localStorage.setItem("isActive", "false");
          await localStorage.setItem("owner", false);
          setIsActive("false");
          // history.push("/");
        }
        setAccounts(account);
      }
    }
    if (active) {
      setIsActive(await localStorage.getItem("isActive"));
    }
    // eslint-disable-next-line
  }, [account, active, connector]);

  const [menuActive, setMenuActive] = useState(false);
  const [unique, setUnique] = useState(false);

  useEffect(() => {
    if (
      window?.location?.pathname === "/create" ||
      window?.location?.pathname === "/createcollection"
    ) {
      setUnique(unique);
    } else {
      setUnique(!unique);
    }
  }, [window?.location?.pathname]);
  const handelMenuChanges = () => {
    setMenuActive(!menuActive);
  };

  const connectorsByName = {
    WalletConnect: walletconnect,
  };

  const triedEager = useEagerConnect();

  // fetch eth balance of the connected account
  const [ethBalance, setEthBalance] = useState();

  useEffect(() => {
    if (library && account) {
      let stale = false;

      library
        .getBalance(account)
        .then((balance) => {
          if (!stale) {
            setEthBalance(balance);
          }
        })
        .catch(() => {
          if (!stale) {
            setEthBalance(null);
          }
        });

      return () => {
        stale = true;
        setEthBalance(undefined);
      };
    }
  }, [library, account, chainId]);

  // log the walletconnect URI
  useEffect(() => {
    const logURI = (uri) => {
      console.log("WalletConnect URI", uri);
    };
    walletconnect.on(URI_AVAILABLE, logURI);

    return () => {
      walletconnect.off(URI_AVAILABLE, logURI);
    };
  }, []);

  const pagedirection = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  };

  return !isLoadedMetaMask ? (
    <LoaderNew />
  ) : (
    <div>
      <header
        onBlur={() => setMenuActive(false)}
        key={unique}
        className={
          scroll
            ? "header header_scroll"
            : headerTop
              ? "header headerTop"
              : "header"
        }
      >
        <div className="plr-3">
          <div class="nav_border">
            <div className="header__content">
              <div className="row justify-content-between">
                <div className="">
                  <Link to="/">
                  <div className="headerLogo"> </div>
                    </Link>

                </div>


                <div class="searchInput">
                  <form className="form-inline search_input d-md-inline-block">
                    <input className="form-control" type="search" placeholder="Search for collections & creators"/>
                    <button className="btn searchButton" type="submit">
                      <img src={Search} className="search_input" alt="Search"/>
                    </button>
                  </form>
                </div>
                <div className="">
                  <div
                    className={
                      menuActive
                        ? "header__menu header__menu-active"
                        : "header__menu"
                    }
                  >
                    <ul className="header__nav">
                      <li className="header__nav-item">
                        <Link
                            className="header__nav-link explore"
                            to="/explore"
                            role="button"
                            id="dropdownMenu"
                            aria-haspopup="true"
                            aria-expanded="false"
                            toggleClass="headerActive"
                            // onClick={() => setMenuActive(false)}
                            onClick={() => {
                              setMenuActive(false);
                              pagedirection();
                            }}
                        >
                          <span className="material-symbols-rounded sidebarItemIcon">grid_view</span>
                          <span>Marketplace</span>
                        </Link>
                      </li>

                      <li className="header__nav-item">
                        <Link
                            className="header__nav-link launchpad"
                            to="/launchpad"
                            role="button"
                            id="dropdownLaunchpad"
                            aria-haspopup="true"
                            aria-expanded="false"
                            toggleClass="headerActive"
                            onClick={() => {
                              setMenuActive(false);
                              pagedirection();
                            }}
                        >
                          <span className="material-symbols-rounded sidebarItemIcon">rocket</span>
                          <span>Launchpad</span>
                        </Link>
                      </li>
                      <li className="header__nav-item">
                        <Link
                          className="header__nav-link _home "
                          to="/about"
                          role="button"
                          id="dropdownMenuHome"
                          aria-haspopup="true"
                          aria-expanded="false"
                          toggleClass="headerActive"
                          onClick={() => {
                            setMenuActive(false);
                            if (selectChainNetwork == "BSC") window.open('https://bsctestnet-frontend.bleufi.com/')
                            else window.open('https://ethtestnet-frontend.bleufi.com/')
                            pagedirection();
                          }}
                        >
                          <span className="material-symbols-rounded sidebarItemIcon">confirmation_number</span>
                          <span>Raffles <small>(coming soon)</small></span>
                        </Link>
                      </li>


                      <li className="header__nav-item">
                          <Link
                            className="header__nav-link"
                            to="/collections"
                            role="button"
                            id="dropdownMenu"
                            aria-haspopup="true"
                            aria-expanded="false"
                            toggleClass="headerActive"
                            // onClick={() => setMenuActive(false)}
                            onClick={() => { setMenuActive(false); pagedirection() }}
                          >
                            <span className="material-symbols-rounded sidebarItemIcon">filter_none</span>
                            <span>Collections</span>
                          </Link>
                        </li>




                      <li className="header__nav-item">
                        <Link
                          to="/creators"
                          className="header__nav-link creators explore"
                          toggleClass="headerActive"
                          onClick={() => {
                            setMenuActive(false);
                            pagedirection();
                          }}
                        >
                          <span className="material-symbols-rounded sidebarItemIcon">groups</span>
                          <span>Creators</span>
                        </Link>
                      </li>



                      <li className="header__nav-item">
                          <Link
                            to="/create"
                            className="header__nav-link explore"
                            toggleClass="headerActive"
                            // onClick={() => setMenuActive(false)}
                            onClick={() => { setMenuActive(false); pagedirection() }}
                          >
                            <span className="material-symbols-rounded sidebarItemIcon">library_add</span>
                            <span>Create</span>
                          </Link>
                        </li>

                      <li className="header__nav-item " id="connectSmall">
                        {loginActive == "true" ? (
                          <Link
                            onClick={() => {
                              setMenuActive(false);
                              connectMetaMast("DISCONNECT", selectChainId);
                            }}
                            className="header__nav-link"
                          >
                            <h4 style={{ color: "red" }}>DISCONNECT</h4>
                          </Link>
                        ) : enableMobileAccount == "true" ? null : (
                          <Link
                            onClick={() => {
                              setMenuActive(false);
                              connectWallet("CONNECT", selectChainId);
                            }}
                            className="header__nav-link"
                          >
                            <h4 style={{ color: "green" }}>CONNECT</h4>
                          </Link>
                        )}

                        {enableMobileAccount === "true" && (
                          <Link
                            onClick={() => {
                              setMenuActive(false);
                              disconnectWalletConnect();
                            }}
                            className="header__nav-link"
                          >
                            <h4 style={{ color: "red" }}>DISCONNECT</h4>
                          </Link>
                        )}
                      </li>
                    </ul>
                  </div>

                  <div className="header__actions">

                  <div class="dropdown head_menu_drop mr-xl-3 d-md-inline-block">

                    <a class="btn dropdown-toggle chainSwapDropdown" href="javascript:;" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <img src={networkLogo} />
                      <span class="chainName"> {selectChainNetwork} </span>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                      <a class="dropdown-item" href="javascript:;" onClick={() => { if (loginActive == 'true') { if (selectChainId == DefaultETHNetwork) { connectMetaMast(true, DefaultNetwork); history.push('/') } } else { setSelectChainId(DefaultNetwork); setSelectChainIdNetwork('BSC'); setNetworkLogo(BNB); localStorage.setItem("networkName", "Binance"); localStorage.setItem("networkId", DefaultNetwork); dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: DefaultNetwork } }); localStorage.setItem("currency", 'BNB') } }}>
                        <div className="dropdown-item-content">
                          <img src={BNB} /> <span> BSC </span>
                        </div>
                      </a>
                      <a class="dropdown-item" href="javascript:;" onClick={() => { if (loginActive == 'true') { if (selectChainId == DefaultNetwork) { connectMetaMast(true, DefaultETHNetwork); history.push('/') } } else { setSelectChainId(DefaultETHNetwork); setSelectChainIdNetwork('Ethereum'); setNetworkLogo(ETH); localStorage.setItem("networkName", "Ethereum"); localStorage.setItem("networkId", DefaultETHNetwork); dispatch({ type: "SET_LOGIN_NETWORK", payload: { value: DefaultETHNetwork } }); localStorage.setItem("currency", 'ETH') } }}>
                        <div className="dropdown-item-content">
                          <img src={ETH} /> <span> Ethereum </span>
                        </div>
                      </a>

                    </div>
                    </div>

                    {loginActive == "true" || enableMobileAccount == "true" ? (
                        <div className="header__action header__action--profile">
                          <Link to={`/creator/${test}?tab=profile`}>
                          <div
                              className={`header__profile-btn ${user.nickName ? "header__profile-btn--verified" : ""
                              }`}
                              to={`/creator/${test}?tab=profile`}
                              role="button"
                              id="dropdownMenuProfile"
                          >

                            <img
                                src={
                                  user?.avatar || "assets/img/avatars/avatar.jpg"
                                }
                                alt=""
                                class="headerAvatar"
                                to={`/creator/${test}?tab=profile`}
                            />
                            <div>
                              <div
                                  to={`/creator/${test}?tab=profile`}>
                                <p class="m-0 p-0"> {user?.nickName
                                    ? user.firstName + " " + user.lastName
                                    : "AD User"}</p>

                                <span dir="rtl" class="headerAddress">0x6aF50e51e9197a6aD4cF0B65Ba211eA3322FF0Bf</span>
                              </div>

                            </div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                            >
                              <path d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"></path>
                            </svg>
                          </div>
                          </Link>
                        </div>

                    ) : (
                        <div
                            className="header__action header__action--signin"
                            id="createLarge"
                        ></div>
                    )}

                    <div
                      className="header__action header__action--signin"
                      id="connectLarge"
                    >
                      {(loginActive === "true" || loginActive === true) && (isActive=='true') ? (
                        <button
                          className="header__action-btn roundedHeaderButton headerConnectButton"
                          onClick={() => connectMetaMast("DISCONNECT",selectChainId)}
                          style={{ width: "" }}
                        >
                          DISCONNECT
                        </button>
                      ) : enableMobileAccount == "true" ? null : (
                        <button
                          className="header__action-btn roundedHeaderButton"
                          onClick={connectWallet}
                          style={{ width: "" }}
                        >
                          CONNECT
                        </button>
                      )}

                      {enableMobileAccount === "true" && (
                        <button
                          className="header__action-btn roundedHeaderButton"
                          onClick={disconnectWalletConnect}
                        >
                          DISCONNECT
                        </button>
                      )}
                    </div>
                    <Switch
                      className="header-theme-btn d-none"
                      checked={theme === "light"}
                      onChange={() =>
                        updateTheme(theme === "light" ? "dark" : "light")
                      }
                      height={26}
                    ></Switch>
                  </div>
                  <button
                    className="header__btn"
                    type="button"
                    onClick={handelMenuChanges}
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
            {(enableConnectWalletModal || loginModal) && (
              <Walletconnect
                selectChainId={selectChainId}
                setEnableConnectWalletModal={setEnableConnectWalletModal}
                connectTrustWallet={connectTrustWallet}
                connectMetaMast={connectMetaMast}
              />
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
export default withRouter(Header);

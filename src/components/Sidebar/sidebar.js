import React, {useEffect,useState} from "react";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { useWeb3React } from "@web3-react/core";
import "./style.css";
import { Link, useHistory, withRouter } from "react-router-dom";
import { RPC_URLS } from "pages/Header/connectors";
import { useSelector } from "react-redux";
import { DefaultNetwork } from "../../constants";
import Web3 from "web3";


function Sidebar() {
    const netWorkValue = useSelector((state) => state?.loginNetwork?.value);
    const loginActive = useSelector((state) => state?.loginNetwork?.isActive);
    const { account } = useWeb3React();
    const [accounts, setAccounts] = useState(account);
    const mobileAccount = localStorage.getItem("mobileAccount");

    useEffect(async () => {
        if (mobileAccount == "true") {
          const providers = new WalletConnectProvider({
            rpc: RPC_URLS,
          });
          await providers.enable();
          setAccounts(providers.accounts[0]);
        } else {
            if(loginActive=='true'){
                const web3 = new Web3(Web3.givenProvider || window.etherum);
                const getAccount = await web3.eth.requestAccounts()
                setAccounts(getAccount[0]);
              }
        }
      }, [account]);

    return (
        <div class="sidebarWrapper">
            <div class="sidebarBlur"></div>
            <div className="sidebarBackground"></div>



            <div class="sidebar">


                <Link
                    to="/"
                    >
                <div class="sidebarItem">
                    <span class="material-symbols-rounded sidebarItemIcon">grid_view</span>
                    <span>Marketplace  <small> (coming soon)</small></span>

                </div>
                </Link>


                <Link
                    to="/launchpad">
                <div className="sidebarItem">
                    <span className="material-symbols-rounded sidebarItemIcon">rocket</span>
                    <span>Launchpad</span>
                </div>
                </Link>


                <Link
                to="/about">
                    <div className="sidebarItem">
                        <span className="material-symbols-rounded sidebarItemIcon">confirmation_number</span>
                        <span>Raffles <small>(coming soon)</small></span>
                    </div>
                </Link>


                <Link
                    to="/">
                <div className="sidebarItem">
                    <span className="material-symbols-rounded sidebarItemIcon">show_chart</span>
                    <span>Stats <small>(coming soon)</small></span>
                </div>
                </Link>


                <Link
                    to="/creators">
                <div className="sidebarItem">
                    <span className="material-symbols-rounded sidebarItemIcon">groups</span>
                    <span>Creators</span>
                </div>
                </Link>


                {/* <Link
                    to="/collections">
                <div className="sidebarItem">
                    <span className="material-symbols-rounded sidebarItemIcon">filter_none</span>
                    <span>Collections</span>
                </div>
                </Link> */}


                <Link
                    to="/token">
                <div className="sidebarItem">
                    <span className="material-symbols-rounded sidebarItemIcon">monetization_on</span>
                    <span>AD Token</span>
                </div>
                </Link>

            {loginActive=='true' ?
                <>
                    <div class="sidebar-section">Your Account</div>
                <Link
                        to={`/creator/${accounts}?tab=profile`}>
                    <div className="sidebarItem">
                        <span className="material-symbols-rounded sidebarItemIcon">person</span>
                        <span>Profile</span>
                    </div>
                    </Link>


                    <Link
                        to={`/creator/${accounts}?tab=items`}>
                    <div className="sidebarItem">
                        <span className="material-symbols-rounded sidebarItemIcon">grid_on</span>
                        <span>My Items</span>
                    </div>
                    </Link>


                    <Link
                        to="/create">
                    <div className="sidebarItem">
                        <span className="material-symbols-rounded sidebarItemIcon">library_add</span>
                        <span>Create</span>
                    </div>
                    </Link>
                </>
                :null
                
                }
            </div>


        </div>

    )
}


export default Sidebar
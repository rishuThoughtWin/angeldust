import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import WalletConnectProvider from "@walletconnect/web3-provider";

// import "styles/create.css";
import "./CreateLaunchpadCollection.css";

import LoaderNew from "components/Loader-New";
import { RPC_URLS } from "../Header/connectors";
import { Button, LoaderIcon } from "../../components";
import { ImageIcon } from "components/Icons";
import { useHistory } from "react-router-dom";
import { BaseModal } from "components/Modal";

export function CreateLaunchpadCollection() {
  const mobileAccount = localStorage.getItem("mobileAccount");
  const history = useHistory();
  const isActive = localStorage.getItem("isActive");
  const { account } = useWeb3React();
  const [accounts, setAccount] = useState(account);
  const [isCreateProcess, setCreateProcess] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (mobileAccount === "true") {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      });
      await provider.enable();
      setAccount(provider.accounts[0]);
    } else {
      setAccount(account);
    }
  }, [account]);

  const handleChange = () => {
    return history.push("/launchCollection");
  };

  return (
    <>
      {isCreateProcess && <LoaderNew />}
      <main className="main contentCol" style={{ paddingTop: "150px" }}>
        <div className="container">
          <div>
            <h1 className="label_name mb-md-3 mb-3 text-center d-block">
              Create Collection
            </h1>
            <p className="collection_text mb-md-5 mb-5">
              Select New or Generate collection to launch your NFTs in 3 easy
              steps.
            </p>
            <div className="card_new_collection">
              <div>
                <div className="sub_heading">New Collection</div>
                <span className="material-symbols-rounded createCollectionIcon mtb-10">library_add</span>
                <div className="collection_text mb-10">
                  Already have your NFT assets? Upload and launch your NFT
                  collection.
                </div>
                <Button type="primary" onClick={handleChange}>
                  New Collection
                </Button>
              </div>
             
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

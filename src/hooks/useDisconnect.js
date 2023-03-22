import React from 'react';
import { useDispatch } from 'react-redux';
import WalletConnectProvider from "@walletconnect/web3-provider";
import { RPC_URLS } from '../pages/Header/connectors';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { toast } from 'react-toastify';

export const useDisconnect = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const context = useWeb3React();

    const mobileAccount = localStorage.getItem("mobileAccount");

    const {
        deactivate
    } = context;
    const disconnectWalletConnect = async () => {
        
        if (mobileAccount === "true") {
            const provider = new WalletConnectProvider({
                rpc: RPC_URLS,
            });
            //  Enable session (triggers QR Code modal)
            dispatch({ type: "SET_TOKEN", payload: {} });
            await provider.close();
            localStorage.setItem("mobileAccount", "false");
            toast.error("Please connect your wallet.")
            history.push("/");
        }
        else {
            try {
                localStorage.setItem("isActive", "false");
                dispatch({ type: "SET_TOKEN", payload: {} });
                deactivate();
                toast.error("Please connect your wallet.")
                localStorage.setItem("owner", false);
                history.push("/");
            } catch (e) {
                console.log(e);
            }
        }
    };



    return { disconnectWalletConnect };
}


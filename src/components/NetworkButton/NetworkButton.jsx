import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { uniqueId } from "lodash";

import ETH from "../../assets/img/icons/eth.png";
import BNB from "../../assets/img/icons/bnb.png";

import { DefaultETHNetwork, DefaultNetwork } from "constants/index";

import "./network.button.css";
import { DownarrowIcon } from "components/Icons";

const clickClass =
  "9ab7283a5e02fc4621fe88d20a1d31ec66d75720c593277966057c6493b1b9f7";

export const NetworkButton = () => {
  const { library, chainId, account } = useWeb3React();
  const [open, setOpen] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState({});

  const [uniqueClickClass, setUniqueClickClass] = useState(
    uniqueId(clickClass)
  );

  // eslint-disable-next-line
  const [options, setOptions] = useState([
    {
      icon: ETH,
      label: "Ethereum",
      disabled: false,
      chainID: DefaultETHNetwork,
    },
    { icon: BNB, label: "Binance", disabled: false, chainID: DefaultNetwork },
  ]);

  const handleDropDownButton = () => {
    setOpen(!open);
  };

  const handleClickEvent = (event) => {
    if (
      event.target &&
      event.target instanceof HTMLElement &&
      !event.target.className.includes(uniqueClickClass)
    ) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClickEvent);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const defaultNetwork = chainId
      ? options.find((x) => x.chainID === chainId)
      : options[0];
    setSelectedNetwork(defaultNetwork);
    // eslint-disable-next-line
  }, [chainId]);

  const toHex = (num) => {
    const val = Number(num);
    return "0x" + val.toString(16);
  };

  const switchNetwork = async (networkObj) => {
    try {
      setSelectedNetwork(networkObj);
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(networkObj?.chainID) }],
      });
      setOpen(false);
      window.location.replace("/");
    } catch (switchError) {
      setOpen(false);
    }
  };

  return (
    <div className="col network_dropdown">
      <button
        className={`uniqueClick dropdown_button ${uniqueClickClass}`}
        onClick={handleDropDownButton}
      >
        <div className={`uniqueClick network_btn  ${uniqueClickClass}`}>
          <p>
            <img
              src={selectedNetwork?.icon}
              alt={selectedNetwork?.label}
              className={`uniqueClick ${uniqueClickClass} `}
            />
          </p>
          <p className={`uniqueClick ${uniqueClickClass} network_label`}>
            {selectedNetwork?.label}
          </p>
        </div>
        <DownarrowIcon
          className={`uniqueClick ${uniqueClickClass}`}
          height={6}
        />
      </button>
      {open && (
        <div className="col relative">
          <div className="absolute_div">
            <div className={`col option_container ${uniqueClickClass}`}>
              {options.map((item) => (
                <button
                  key={item.label}
                  className="option_button"
                  onClick={() => switchNetwork(item)}
                >
                  <div className="network_option">
                    <p>
                      <img src={item.icon} alt={item.label} />
                    </p>
                  </div>
                  <p className="network_label"> {item.label} </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
    //     <div>
    //       <div class="dropdown head_menu_drop mr-xl-3 d-md-inline-block">
    //         <a
    //           class="btn dropdown-toggle"
    //           href="javascript"
    //           role="button"
    //           id="dropdownMenuLink"
    //           data-toggle="dropdown"
    //           aria-haspopup="true"
    //           aria-expanded="false"
    //         >
    //           <img src={selectedNetwork?.icon} alt={selectedNetwork?.label} />
    //           <span> {selectedNetwork?.label} </span>
    //         </a>
    //         <button class="dropdown-menu" aria-labelledby="dropdownMenuLink">
    //           {options.map((item) => (
    //             <>
    //               <button
    //                 class="dropdown-item"
    //                 key={item.label}
    //                 onClick={() => switchNetwork(item)}
    //               >
    //                 <img src={item.icon} alt={item.label} />
    //                 <span> {item.label} </span>
    //               </button>
    //             </>
    //           ))}
    //         </button>
    //       </div>
    //     </div>
  );
};

import {InjectedConnector} from "@web3-react/injected-connector";
import {NetworkConnector} from "@web3-react/network-connector";
import {WalletConnectConnector} from "@web3-react/walletconnect-connector";


const POLLING_INTERVAL = 12000;
export const RPC_URLS = {
  1 : "https://mainnet.infura.io/v3/bfd85273741444f4bcf93f880b9b79e0",
  5 : "https://goerli.optimism.io/",
  56 : 'https://bsc-dataseed1.binance.org',
  97 : 'https://data-seed-prebsc-1-s1.binance.org:8545/'
};

export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42]
});

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[56] },
  defaultChainId: 1,
  pollingInterval: POLLING_INTERVAL
});

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[56] },
  bridge: "https://bridge.walletconnect.org",
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
});





import TOKEN_INFO from "paymentTokenABIs/ERC20.json";
import loader_image from "../assets/img/placeholder.gif"
export const NFT_ADDRESS = "0x1F784Db3394B21ACD9b450Dae6401Ba37aC7d2fc"; // "0xA96E7654330f2C8cF1acD07d3600BAeD6Bf7a417";
export const NFT_MARKET_ADDRESS = "0x813Ba81A693a14884Cb585510B91DB729E6fb52a"; // "0x433403C379b041cC622db6E0d37aa2eFD89a5456";
export const CONTRACT_ADDRESS = "0x813Ba81A693a14884Cb585510B91DB729E6fb52a";
export const NFT_CONTRACT_ADDRESS =
  "0x1F784Db3394B21ACD9b450Dae6401Ba37aC7d2fc";

export const NFTStorageKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDg3NjM4NzFFNkYxNkQxODE5NzUzNGMzMUE2YzEyNjEyNTVkQkUwNUMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTYzOTYzOTUyMTI3NiwibmFtZSI6ImZsb2tpbiJ9.Mt7xfQf1-R1K5RXzEUzlb234guu4suLIhWxlgPS5TCI";
export const Networks = {
  BSC: 56,
  BSCTestnet: 97,
};
export const PaymentList = [
  { name: "BNB", value: "BNB" },
  { name: "Angeldust", value: "Angeldust" },
];
export const DefaultNetwork = 97;
export const DefaultETHNetwork = 5;
export const DefaultDOGENetwork = 568;
export const DefaultAvatar = "/assets/img/avatars/avatar.jpg";
export const DefaultCoverImage = "/assets/img/bg/bg.png";
export const DefaultNickName = "user";
export const MAX_LIMIT_FOR_BNB = 200;
export const MAX_LIMIT_FOR_TOKEN = 1000000000;

export const PAYMENT_TOKEN = {
  Angeldust: {
    tokenAddress: "0x97ea5efdcb5961a99ba5c96123042507c0210ec1",
    abi: TOKEN_INFO,
  },
  BNB: {
    tokenAddress: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    abi: TOKEN_INFO,
  },
};

export const ChainID = {
  56: "bsc",
  97: "bsc testnet"
}

export const AUCTION = 'Auction';
export const FIXED = 'Fixed';
export const IN_VALID_ADDRESS = "0x0000000000000000000000000000000000000000";

export const AWS_IMAGE_PATH = "https://d2iniwvjmiq0k0.cloudfront.net/";
export const DEFAULT_TOKEN_URI = "https://thumbs.dreamstime.com/b/no-image-available-icon-flat-vector-no-image-available-icon-flat-vector-illustration-132482953.jpg"
export const LOADER_IMAGE = loader_image;
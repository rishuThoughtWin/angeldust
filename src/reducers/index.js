import {combineReducers} from "redux";
import {SET_PROFILE} from "../actions/userAction";
import {SET_ADMIN} from "../actions/adminAction";
import {DefaultNetwork} from "../constants/index";

const initialState = {
  web3: null,
  chainId: DefaultNetwork,
  userAccount: null,
  tokenBalane: 0,
  bnbBalance: 0,
  theme: "light",
};
const initialUserData = {
  avatar: "assets/img/avatars/avatar.jpg",
  imageCover: "/assets/img/bg/bg.png",
  firstName: "User",
  lastName: "",
  nickName: "user",
  account: null,
  bio: "",
  twitter: "",
  telegram: "",
  instagram: "",
  subscribe: "",
  followers: [],
};
const initialAdmin = {
  admin: "false",
  
};
const initialPrice = {
  bnb: 0,
  kcs: 0,
};
const initialNfts = {
  items: [],
  selected: null,
};

function web3(state = initialState, action) {
  switch (action.type) {
    case "SET_WEB3_DATA":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_CHAIN_ID":
      return {
        ...state,
        chainId: action.payload,
      };
    case "UPDATE_USER_ADDRESS":
      return {
        ...state,
        userAccount: action.payload,
      };
    case "UPDATE_THEME":
      return {
        ...state,
        theme: action.payload,
      };
    default:
      return state;
  }
}
function user(state = initialUserData, action) {
  switch (action.type) {
    case SET_PROFILE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
function price(state = initialPrice, action) {
  switch (action.type) {
    case "UPDATE_PRICE":
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
function nfts(state = initialNfts, action) {
  switch (action.type) {
    case "SET_SELECTED":
      return {
        ...state,
        selected: action.payload,
      };
    case "SET_ITEMS":
      return {
        ...state,
        items: action.payload,
      };
    default:
      return state;
  }
}
function admin(state = initialAdmin, action) {
  switch (action.type) {
    case SET_ADMIN:
      return {
        ...action.payload,
      };
    default:
      return state;

  }
}

function tokenData(state = {}, action) {
  switch (action.type) {
    case "SET_TOKEN":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
function loginModel(state = {value:false}, action) {
  switch (action.type) {
    case "SET_LOGIN_MODAL":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
function activeUser(state = {value:false}, action) {
  switch (action.type) {
    case "SET_ACTIVE":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
function loginNetwork(state = {value:DefaultNetwork,isActive:localStorage.getItem("isActive")}, action) {
  switch (action.type) {
    case "SET_LOGIN_NETWORK":
      return {
        ...action.payload,
      };
    default:
      return state;
  }
}
const rootReducer = combineReducers({
  web3,
  user,
  price,
  nfts,
  admin,
  tokenData,
  loginModel,
  activeUser,
  loginNetwork
});

export default rootReducer;

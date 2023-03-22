import axios from "axios";
import { config } from "chai";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;
const ADMIN_URL = process.env.REACT_APP_API_BASE_ADMIN_URL;
// ----------------Home Page Apis --------------
export const getTopCollectionsApi = async () => {
  try {
    //const res = getToken(store().store.getState());
    const data = await axios.get(`${BASE_URL}getTopCollections`);
    return data;
  } catch (error) {
    return error;
  }
};

export const getPopularCreatorsApi = async (tokenId) => {
  try {
    let config = null;
    if (tokenId) {
      config = {
        headers: { Authorization: `Bearer ${tokenId}` },
      };
    }
    const data = await axios.get(`${BASE_URL}getTopCreator`, config);
    return data;
  } catch (error) {
    return error;
  }
};

// ----------------Explore Page apis --------------

export const getAllNFTSApi = async (req) => {
  try {
    const {
      page = 1,
      limit,
      category,
      status,
      payment,
      search,
      sort = "-createdAt",
      collectionID,
      owner,
      isSale,
    } = req;
    let categoryFilter = "";
    let statusFilter = "";
    let paymentFilter = "";
    let searchFilter = "";
    let collectionIdFilter = "";
    let ownerFilter = "";
    let isSaleFilter = "";
    if (category) {
      categoryFilter = `&category=${category}`;
    }
    if (status) {
      statusFilter = `&saleType=${status}`;
    }
    if (payment) {
      paymentFilter = `&paymentType=${payment}`;
    }
    if (search) {
      searchFilter = `&search=${search}`;
    }
    if (collectionID) {
      collectionIdFilter = `&collectionAddress=${collectionID}`;
    }
    if (owner) {
      ownerFilter = `&owner=${owner}`;
    }
    if (isSale) {
      isSaleFilter = `&isSale=true`;
    }
    const data = await axios.get(
      `${BASE_URL}getNftList?page=${page}&limit=${limit}${categoryFilter}${statusFilter}${paymentFilter}${isSaleFilter}${ownerFilter}${searchFilter}${collectionIdFilter}&sort=${sort}`
    );
    return data;
  } catch (error) {
    return error;
  }
};

//-------------- Blackliseted api -----------

export const getBlackListedNFTSApi = async (req, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const data = await axios.get(`${BASE_URL}getBlockedListedNfts`, config);
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllExternalNFTSApi = async (req) => {
  try {
    const data = await axios.post(`${BASE_URL}fetchOtherNfts`, req);
    return data;
  } catch (error) {
    return error;
  }
};

export const uploadFileToPinata = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const result = await axios.post(`${BASE_URL}uploadFile`, body, config);
    return result;
  } catch (error) {}
};

export const uploadJSONToPinata = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(`${BASE_URL}uploadJosn`, body, config);
    return result;
  } catch (error) {}
};

export const uploadPinHash = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(`${BASE_URL}pinHash`, body, config);
    return result;
  } catch (error) {}
};

export const uploadMultiJsonData = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(
      `${BASE_URL}uploadMultiJsonData`,
      body,
      config
    );
    return result;
  } catch (error) {}
};

export const getSingleNFTApi = async (collectionId, Id) => {
  try {
    const data = await axios.get(`${BASE_URL}getNft/${collectionId}/${Id}`);
    return data;
  } catch (error) {
    return error;
  }
};

export const Update_NFTApi = async (token, body, nftId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.patch(
      `${BASE_URL}updatedNfts/${nftId}`,
      body,
      config
    );
    return result.data;
  } catch (error) {}
};

export const PutOffSale_Api = async (token, nftId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.post(
      `${BASE_URL}updatedNftPutOffSale`,
      { nftId: nftId },
      config
    );
    return result.data;
  } catch (error) {}
};
// ----------------Collections Page apis --------------

export const getAllCollectionsApi = async (
  page = 1,
  limit = 10,
  search,
  account,
  approve
) => {
  try {
    let searchFilter = "";
    let accountFilter = "";
    let approveFilter = "";
    if (search) {
      searchFilter = `&search=${search}`;
    }
    if (account) {
      accountFilter = `&owner=${account}`;
    }
    if (approve) {
      approveFilter = `&approve=${approve}`;
    }
    let data = null;
    if (approve) {
      data = await axios.get(
        `${BASE_URL}getCollections?page=${page}&limit=${limit}${searchFilter}${approveFilter}`
      );
    } else {
      data = await axios.get(
        `${BASE_URL}getCollections?page=${page}&limit=${limit}${accountFilter}${searchFilter}`
      );
    }
    return data;
  } catch (error) {
    return error;
  }
};
export const getAllAdminCollectionsApi = async (token, page = 1, limit = 1) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.get(
      `${ADMIN_URL}getCollectionList?page=${page}&limit=${limit}&approve=false`,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const adminApprove = async (token, data) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.put(
      `${ADMIN_URL}approveCollections`,
      data,
      config
    );
    return result.data;
  } catch (err) {
    console.log("AdminApprove_ERROR", err.message);
    return err;
  }
};

export const confirmBlackList = async (token, body) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.patch(`${ADMIN_URL}blockUser`, body, config);
    return result.data;
  } catch (err) {
    console.log("CONFIRM_BLACKLIST_ERROR", err.message);
    return err;
  }
};

export const deleteNft = async (token, body) => {
  // const body = {
  //     isActive: false,
  // };
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const result = await axios.patch(
      `${ADMIN_URL}deactivateNfts`,
      body,
      config
    );
    return result.data;
  } catch (err) {
    console.log("DELETE_NFT_ERROR", err.message);
    return err;
  }
};

export const deleteLazyMintNft = async (token, body) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  try {
    const result = await axios.post(
      `${ADMIN_URL}updateNftStatus`,
      body,
      config
    );
    return result.data;
  } catch (err) {
    console.log("DELETE_NFT_ERROR", err.message);
    return err;
  }
};

export const getCollectionStasticsApi = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(
      `${BASE_URL}getCollectionsHeadersValue`,
      body,
      config
    );
    return result;
  } catch (error) {}
};

export const getCollectionByIdApi = async (Id) => {
  try {
    const data = await axios.get(
      `${BASE_URL}getCollections?collectionAddress=${Id}`
    );
    return data;
  } catch (error) {
    return error;
  }
};

// ----------------Creators Page apis --------------

export const getAllCreatorsApi = async (req) => {
  try {
    const { page = 1, limit, search, sort = 1 } = req;
    let searchFilter = "";
    if (search) {
      searchFilter = `&search=${search}`;
    }
    const data = await axios.get(
      `${BASE_URL}getCreator?page=${page}&limit=${limit}${searchFilter}&sort=${sort}`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllCreatorsApiV2 = async (req) => {
  try {
    const body = {
      page: req.page,
      limit: req.limit,
      search: req.search,
      sort: req.sort,
    };
    let config = null;
    if (req.token) {
      config = {
        headers: { Authorization: `Bearer ${req.token}` },
      };
    } else {
    }

    const result = await axios.post(`${BASE_URL}getCreator/v2`, body, config);
    return result;
  } catch (error) {
    return error;
  }
};

export const getCreatorByIdApi = async () => {
  try {
    const data = await axios.get(BASE_URL + "");
    return data;
  } catch (error) {
    return error;
  }
};

export const addFollowApi = async (token, userId, followerId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.patch(
      `${BASE_URL}addFollower/${userId}/${followerId}`,
      {},
      config
    );
    return data;
  } catch ({ ...error }) {
    return error;
  }
};
export const unFollowApi = async (token, userId, followerId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.patch(
      `${BASE_URL}unfollow/${userId}/${followerId}`,
      {},
      config
    );
    return data;
  } catch ({ ...error }) {
    return error;
  }
};

export const followAPI = async (token, userId, followerId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const body = {
      user_id: userId,
      follower_id: followerId,
    };

    const data = await axios.post(`${BASE_URL}follow-unfollow`, body, config);
    return data;
  } catch ({ ...error }) {
    return error;
  }
};

// ------------------ Create Apis -------------------
export const Create_NFTApi = async (token, nonceId, req) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}createNftItem/${nonceId}`,
      req,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const Create_CollectionApi = async (data) => {
  try {
    const data = await axios.post(`${BASE_URL}`, {
      data,
    });
  } catch (error) {}
};

export const Create_UserApi = async (token, data) => {
  try {
    const data = await axios.post(`${BASE_URL}`, data);
  } catch (error) {}
};

export const Get_Profile = async (data) => {
  try {
    const result = await axios.get(
      `${BASE_URL}getCreator?page=1&limit=10&account=${data}`
    );
    return result.data.data;
  } catch (error) {
    console.log("Get_Profile__Error ---->>", error.message);
    return error;
  }
};

export const Get_Profile_By_NickName = async (data) => {
  try {
    const result = await axios.get(
      `${BASE_URL}getCreator?page=1&limit=10&nickName=${data}`
    );
    return result.data;
  } catch (error) {
    console.log("Get_Profile__Error ---->>", error.message);
    return error;
  }
};

export const Get_Profile_By_AccountId = async (accountID, tokenId) => {
  try {
    let config = null;
    if (tokenId) {
      config = {
        headers: { Authorization: `Bearer ${tokenId}` },
      };
    }
    const result = await axios.get(
      `${BASE_URL}getProfileByaccount/${accountID}`,
      config
    );
    return result.data;
  } catch (error) {
    console.log("Get_Profile__Error ---->>", error.message);
    return error;
  }
};

export const Get_Profile_By_Id = async (_id) => {
  try {
    const result = await axios.get(`${BASE_URL}getProfile/${_id}`);
    return result.data;
  } catch (error) {
    console.log("Get_Profile__Error ---->>", error.message);
    return error;
  }
};

export const Create_Profile = async (token, data) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.post(`${BASE_URL}createProfile`, data, config);
    return result.data;
  } catch (error) {
    console.log("Create_Profile__Error ---->>", error.message);
    return error;
  }
};

export const update_Profile = async (token, data, userId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const result = await axios.patch(`${BASE_URL}updateProfile`, data, config);
    return result.data;
  } catch (error) {
    console.log("Update_Profile__Error ---->>", error.message);
    return error;
  }
};

// --------------- Nonce ---------------
export const getNonceCode = async (body) => {
  try {
    const data = await axios.post(`${BASE_URL}getNonceCode`, body);
    return data;
  } catch (error) {
    return error;
  }
};

export const getNonceCount = async () => {
  try {
    const data = await axios.get(`${BASE_URL}getCountOfNonce`);
    return data;
  } catch (error) {
    return error;
  }
};

// ------------------- Verify signature------------

export const verifySignatureApi = async (body) => {
  try {
    const data = await axios.post(`${BASE_URL}verifySignature`, body);
    return data;
  } catch (error) {
    return error;
  }
};

export const likeDislikeApi = async (token, nftId) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.patch(
      `${BASE_URL}like_dislike/${nftId}`,
      {},
      config
    );
    return data;
  } catch ({ ...error }) {
    return error;
  }
};

export const import_CollectionApi = async (req, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const data = await axios.post(
      `${BASE_URL}/createCollectionWithCollectionAddress`,
      req,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const launchpad_Collection_Create = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/create-collection`,
      body,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const launchpad_Collection_Update = async (body) => {
  try {
    const data = await axios.patch(
      `${BASE_URL}launchpad/collection/update-collection`,
      body
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const launchpad_Collection_nft_create_with_images = async (body) => {
  try {
    const formData = new FormData();
    body.files.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("collectionId", body.collectionId);
    const config = {
      headers: { "Content-Type": "multipart/form-data" },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/nft/create-nft-with-upload-images`,
      formData,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const launchpad_Collection_Delete = async (id, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.delete(
      `${BASE_URL}launchpad/collection/delete-collection/${id}`,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getCollectionMetaData = async (id, address) => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-collection-detail/${id}?userAddress=${address}`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getLaunchpadCollection = async (body) => {
  try {
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/get-collection-list`,
      body
    );
    return data;
  } catch (error) {
    return error;
  }
};
export const getLaunchpadNft = async (body) => {
  try {
    const data = await axios.post(
      `${BASE_URL}launchpad/nft/get-nft-list`,
      body
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getMyNftList = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/nft/get-my-nft-list`,
      body,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const approveLaunchpadCollection = async (token, body) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.patch(
      `${BASE_URL}launchpad/collection/approved-collection`,
      body,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getNftDetail = async (id) => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/nft/get-nft-detail/${id}`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const createSignatureAndNonce = async (body, token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/create-signature`,
      body,
      config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getAllCollectionHeaderData = async (id) => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-stash-all-collections-header`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getMyLaunchPadCollection = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/get-my-collection-list`,body,config
    );
    return data;
  } catch (error) {
    return error;
  }
}

export const getUpcomingCollection = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/upcoming-collection-list`,body,config
    );
    return data;
  } catch (error) {
    return error;
  }
}

export const getLiveCollection = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/live-collection-list`,body,config
    );
    return data;
  } catch (error) {
    return error;
  }
}

export const getEndCollection = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/End-collection-list`,body,config
    );
    return data;
  } catch (error) {
    return error;
  }
}

export const getAllUsersApiV2 = async (req) => {
  try {
    const body = {
      page: req.page,
      limit: req.limit,
    };
    let config = null;
    if (req.token) {
      config = {
        headers: { Authorization: `Bearer ${req.token}` },
      };
    } else {
    }
    const result = await axios.post(
      `${BASE_URL}launchpad/collection/get-collection-creator-users`,
      body,
      config
    );
    return result;
  } catch (error) {
    return error;
  }
};

export const getTopCreators = async () => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-top-creator`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getTopBuyers = async () => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-top-buyers`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getTopSallers = async () => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-top-sellers`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getCreators = async (req) => {
  try {
    const body = {
      userAddresses: req.topList,
    };
    let config = null;
    if (req.token) {
      config = {
        headers: { Authorization: `Bearer ${req.token}` },
      };
    } else {
    }
    const result = await axios.post(
      `${BASE_URL}launchpad/collection/add-top-creator`,
      body,
      config
    );
    return result;
  } catch (error) {
    return error;
  }
};

export const getLatestCreator = async () => {
  try {
    const data = await axios.get(
      `${BASE_URL}launchpad/collection/get-latest-creator`
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const getLatestCollection = async (req) => {
  try {
    const body = {
      networkId: req.networkId,
      networkName: req.networkName,  
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/get-latest-collection`,body
    );
    return data;
  } catch (error) {
    return error;
  }
};



export const updateWhitelistedUser = async (body,token) => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const data = await axios.post(
      `${BASE_URL}launchpad/collection/update-whiteListedUser`,body,config
    );
    return data;
  } catch (error) {
    return error;
  }
};

export const uploadMultiJSON = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(`${BASE_URL}launchpad/nft/upload-multi-json-to-pinata`, body, config);
    return result;
  } catch (error) {}
};

export const UpdateCollectionWithNFTCreate = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.patch(`${BASE_URL}launchpad/collection/update-collection-with-create-nft`, body, config);
    return result;
  } catch (error) {}
};

export const getNFTAttributes = async (body) => {
  try {
    const config = {
      headers: { "Content-Type": "application/json" },
    };
    const result = await axios.post(`${BASE_URL}launchpad/nft/get-nft-attributes`, body, config);
    return result;
  } catch (error) {}
};






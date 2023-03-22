import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Switch from 'react-switch'
import { toast } from 'react-toastify'
import 'styles/create.css'
import moment from 'moment'
import ReactSlider from 'react-slider'
import { parseUnits } from '@ethersproject/units'
import bluefiabi from '../../services/smart-contract/AngeldustNFT'
import reserveAuctionAbi from '../../services/smart-contract/reserveAuction.json'
import buyCollectionNFTabi from '../../services/smart-contract/ERC721'
import FixedSaleMarketPlaceAbi from '../../services/smart-contract/FixedSaleMarketPlace.json'
import NFTDropzone from '../../components/Dropzone'
import LoaderNew from 'components/Loader-New'
import { Create_NFTApi, Get_Profile_By_AccountId, getNonceCount } from 'apis'
import { RPC_URLS } from "../Header/connectors";
import { uploadFileToPinata } from 'apis'
import { useDisconnect } from 'hooks/useDisconnect'
import { uploadJSONToPinata } from 'apis'

function Create() {
  const mobileAccount = localStorage.getItem("mobileAccount")
  const isActive = localStorage.getItem("isActive");
  const web3 = new Web3(Web3.givenProvider || window.etherum);
  const newContract = process.env.REACT_APP_Angeldust_NFT;
  const reserveAuction = process.env.REACT_APP_RESERVE_MARKETPLACE;
  const abiFile = bluefiabi.abi;
  const contractInstance = new web3.eth.Contract(abiFile, newContract);
  const reserveContractInstance = new web3.eth.Contract(
    reserveAuctionAbi.abi,
    reserveAuction,
  )
  const { active, account } = useWeb3React()
  const [accounts, setAccount] = useState(account)
  const FixedSaleMarketPlace = process.env.REACT_APP_FIXED_MARKETPLACE
  const [user, setUser] = useState({
    account: accounts,
    avatar: 'assets/img/avatars/avatar.jpg',
    ownerAvatar: 'assets/img/avatars/avatar.jpg',
    imageCover: '/assets/img/bg/bg.png',
    firstName: 'User',
    lastName: '',
    nickName: 'user',
    bio: '',
    twitter: '',
    telegram: '',
    instagram: '',
    subscribe: '',
    followers: [],
  })
  const [type, setType] = useState('image')
  const [fileForPinata, setFileForPinata] = useState(null)
  const [category, setCategory] = useState('art')
  const [name, setName] = useState('')
  const [royalties, setRoyalties] = useState(0)
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [saleType, setSaleType] = useState('Fixed')
  const [buffer, setBuffer] = useState(null)
  const [isCreateProcess, setCreateProcess] = useState(false)
  const [isSale, setIsSale] = useState(false)
  const [isMIntType, setMIntType] = useState('lazyMint')
  const [auctionLength, setAuctionLength] = useState('12')
  const [isClearPreview, setIsClearPreview] = useState(false);
  const [unique, setUnique] = useState(false)
  const history = useHistory()
  const { disconnectWalletConnect } = useDisconnect();
  const tokenId = useSelector(state => state?.tokenData?.token);

  const getFile = (file, isAttach = false) => {
    if (file) {
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        if (!isAttach) setBuffer(binaryStr)
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const headerfun = (e) => {
    switch (e.target.value) {
      case 'createCollection':
        history?.push('/createcollection')
        break
      case 'create':
        history?.push('/create')
        break
      default:
        history?.push('/create')
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (
      window.location?.pathname === '/create' ||
      window.location?.pathname === '/createcollection'
    ) {
      setUnique(unique)
    } else {
      setUnique(!unique)
    }
  }, [window.location?.pathname]);

  useEffect(() => {
    setIsClearPreview(true)
  }, [type])

  const startAuction = async (tokenId, tokenURI) => {
    if (active) {
      try {
        let auction_length = null
        if (auctionLength == "1") auction_length = parseInt(auctionLength) * 36;
        else auction_length = parseInt(auctionLength) * 3600;
        let curator
        let approve
        if (mobileAccount == 'true') {
          const provider = new WalletConnectProvider({
            rpc: RPC_URLS,
          })
          await provider.enable()
          const web3 = new Web3(provider)
          const reserveContractInstance = new web3.eth.Contract(
            reserveAuctionAbi.abi,
            reserveAuction,
          )
          curator = await reserveContractInstance.methods.brokerAddress().call()
          const contractInstanceNFT = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            newContract,
          )
          approve = await contractInstanceNFT.methods
            .approve(reserveAuction, tokenId)
            .send({ from: accounts })
        } else {
          curator = await reserveContractInstance.methods.brokerAddress().call()
          const contractInstanceNFT = new web3.eth.Contract(
            buyCollectionNFTabi.abi,
            newContract,
          )
          approve = await contractInstanceNFT.methods
            .approve(reserveAuction, tokenId)
            .send({ from: accounts })
        }
        if (approve) {
          let res = null
          if (mobileAccount == 'true') {
            const provider = new WalletConnectProvider({
              rpc: RPC_URLS,
            })
            await provider.enable()
            const web3 = new Web3(provider)
            const reserveContractInstance = new web3.eth.Contract(
              reserveAuctionAbi.abi,
              reserveAuction,
            )
            res = await reserveContractInstance.methods
              .createAuction(
                newContract,
                tokenId,
                auction_length,
                parseUnits(price.toString()),
                accounts,
              )
              .send({ from: accounts })
          }
          else {
            res = await reserveContractInstance.methods
              .createAuction(
                newContract,
                tokenId,
                auction_length,
                parseUnits(price.toString()),
                accounts,
              )
              .send({ from: accounts })
          }
          if (res) {
            const events = res?.events
            if (events) {
              toast.success('You create an auction')
              setTimeout(() => {
                history.push(`/creator/${accounts}?tab=items`)
              }, 5000)
            }
          }
        }
      } catch (err) {
        console.log("err", err)
        toast.error('Failed to create auction')
      }
    } else {
      toast.error('Please connect your wallet first')
    }
  }

  const normalMint = async (tokenURI, signature) => {
    let resultNormalMint
    if (mobileAccount == 'true') {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      })
      await provider.enable()
      const web3 = new Web3(provider)
      const contractInstance = new web3.eth.Contract(abiFile, newContract)
      resultNormalMint = await contractInstance.methods
        .mint(accounts, royalties * 100, tokenURI)
        .send({ from: accounts })
    } else {
      resultNormalMint = await contractInstance.methods
        .mint(accounts, royalties * 100, tokenURI)
        .send({ from: accounts })
    }
    if (resultNormalMint) {
      let newTokenId = resultNormalMint.events.Transfer.returnValues.tokenId
      if (saleType === 'Auction' && isSale) {
        startAuction(newTokenId, tokenURI)
      } else if (saleType === 'Fixed' && isSale) {
        let FixedSaleMarketPlaceContract
        let approve
        if (mobileAccount == 'true') {
          const provider = new WalletConnectProvider({
            rpc: RPC_URLS,
          })
          await provider.enable()
          const web3 = new Web3(provider)
          const contractInstance = new web3.eth.Contract(abiFile, newContract)
          FixedSaleMarketPlaceContract = new web3.eth.Contract(
            FixedSaleMarketPlaceAbi.abi,
            FixedSaleMarketPlace,
          )
          approve = await contractInstance.methods
            .setApprovalForAll(FixedSaleMarketPlace, true)
            .send({ from: accounts })
        } else {
          FixedSaleMarketPlaceContract = new web3.eth.Contract(
            FixedSaleMarketPlaceAbi.abi,
            FixedSaleMarketPlace,
          )
          approve = await contractInstance.methods
            .setApprovalForAll(FixedSaleMarketPlace, true)
            .send({ from: accounts })
        }
        if (approve) {
          const res = await FixedSaleMarketPlaceContract.methods
            .putOnSale(
              newContract,
              newTokenId,
              accounts,
              parseUnits(price.toString()),
            )
            .send({ from: accounts })

          if (res) {
            setCreateProcess(false)
            toast.success('Listed on marketplace successfully')
            setTimeout(() => {
              history.push(`/creator/${accounts}?tab=items`)
            }, 5000)
          }
        }
      } else {
        toast.success('NFT Item is successfully created!')
        setCreateProcess(false)
        setTimeout(() => {
          history.push(`/creator/${accounts}?tab=items`)
        }, 5000)
      }
    }
  }

  const createNFT = async () => {
    if (!name || !description) {
      toast.error('Please fill the NFT information.')
      return
    }
    else if (!buffer) {
      return toast.error('Please select nft image.')
    }
    if (isSale && price <= 0) {
      toast.error('Price should not be zero.')
      return
    }
    if (!(isActive == 'true' || mobileAccount == 'true')) return toast.error("Please connect your wallet first.");
    try {
      if (!accounts) toast.error('Please connect your wallet first.')
      const userData = await Get_Profile_By_AccountId(accounts, '');
      const userExist = userData ? userData?.data : {};
      if (!userExist?.nickName) {
        toast.error(`Please update your profile first.`)
        return
      }
      if (!tokenId) {
        return await disconnectWalletConnect();
      }
      if (accounts) {
        setCreateProcess(true);
        const data = new FormData();
        if (fileForPinata) {
          const fileSize = fileForPinata.size / 1024 / 1024; // in MiB
          if (fileSize > 1024) {
            setCreateProcess(false);
            return toast.error("Media size not greater than 1 GB.")
          }
        }
        data.append('file', fileForPinata)
        const responsePinata = await uploadFileToPinata(data)
        if (responsePinata) {
          const result = responsePinata?.data?.data?.url
          const jsonData = JSON.stringify({
            name: name,
            description: description,
            creator: accounts,
            type,
            category,
            royalties: royalties * 100,
            image: result
          });
          const contractJsonFile = new Blob([jsonData], { type: 'application/json' });
          const contractJsonFileRes = await uploadJSONToPinata(contractJsonFile);
          const fileUrlRes = contractJsonFileRes?.data?.data?.url;
          let tokenURI = "";
          if (fileUrlRes) {
            tokenURI = fileUrlRes;
          }
          if (tokenURI) {
            if (isMIntType == 'lazyMint') {
              let resNonce;
              const req = {
                account_address: account
              }
              let nonceId;
              const res = await getNonceCount();
              if (res) {
                resNonce = res?.data?.data?.nonce;
                nonceId = res?.data?.data?._id;
              }
              let variblelNonse = resNonce;
              variblelNonse = variblelNonse + 1
              let signature
              if (mobileAccount == 'true') {
                const provider = new WalletConnectProvider({
                  rpc: RPC_URLS,
                });
                await provider.enable();
                const web3 = new Web3(provider);
                const contractInstance = new web3.eth.Contract(abiFile, newContract);
                const hash = await contractInstance.methods
                  .getMessageHash(
                    variblelNonse,
                    parseUnits(price.toString()),
                    tokenURI,
                    royalties * 100
                  )
                  .call();
                signature = await web3.eth.personal.sign(hash, accounts);
                if (!signature) {
                  variblelNonse = variblelNonse - 1;

                }
              } else {
                const hash = await contractInstance.methods
                  .getMessageHash(
                    variblelNonse,
                    parseUnits(price.toString()),
                    tokenURI,
                    royalties * 100
                  )
                  .call();
                const encodedhash = await contractInstance.methods
                  .getEthSignedMessageHash(hash)
                  .call();
                signature = await web3.eth.personal.sign(hash, accounts);
                if (!signature) {
                  variblelNonse = variblelNonse - 1;

                }
              }
              const bodyReq = {
                isFirstSale: true,
                tokenId: 0,
                tokenURI,
                collectionAddress: newContract,
                ownerAvatar: user?.avatar || '/assets/img/avatars/avatar.jpg',
                owner: accounts,
                creator: accounts,
                price: parseFloat(price),
                paymentType: 'BNB',
                isSale,
                saleType: 'Fixed',
                auctionLength: 0,
                auctionInfo: null,
                auctionCreator: null,
                time: 0,
                likes: [],
                created: moment().valueOf(),
                type,
                category,
                name,
                description,
                signature,
                nonce: variblelNonse,
                royalties: royalties * 100
              }
              const result = await Create_NFTApi(tokenId, nonceId, bodyReq);
              if (result?.data?.status === 201) {
                toast.success('NFT Item is successfully created!')
                setTimeout(() => {
                  history.push(`/creator/${accounts}?tab=items`)
                }, 2000)
                setCreateProcess(false)
              } else {
                setCreateProcess(false)
                toast.error('Create failed.')
              }
            } else {
              await normalMint(tokenURI, '')
            }
          }
        }
        else {
          toast.error('Uploading failed')
          setCreateProcess(false)
        }
      }
    } catch (err) {
      setCreateProcess(false)
      if (isMIntType == 'lazyMint') {
      }
      toast.error("Failed to create NFT");
      console.log(err)
    }
  }

  useEffect(async () => {
    if (mobileAccount == 'true') {
      const provider = new WalletConnectProvider({
        rpc: RPC_URLS,
      })
      await provider.enable()
      setAccount(provider.accounts[0])
    } else {
      setAccount(account)
    }
  }, [account])

  const fileHandler = (newfile) => {
    if (!newfile) {
      setFileForPinata(null)
      setIsClearPreview(false)
      return toast.error("Please select valid file.");
    }
    getFile(newfile)
    setFileForPinata(newfile)
    setIsClearPreview(false)
  }
  return (
    <>
      {
        isCreateProcess && <LoaderNew />
      }
      <main className="buyFlokin main">
        <div className="hero_common">
          <div className="hero_border">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-12">
                  <div className="create_nft_head mt-4 mb-4 pb-2">
                    <div className="row">
                      <div className="col-md-6 col-6">
                        <h1>create New NFT</h1>
                      </div>

                      <div className="col-md-6 col-6 text-right">
                        <div className="create_drop_nft">
                          <select
                            className="header__nav-link form-select"
                            onChange={headerfun}
                          >
                            <option value="create">NFT Item</option>
                            <option value="createCollection">
                              NFT Collection
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 pr-md-3 createPart">
                      <h2 className="createStepLabel">
                        Upload File <span className="validation">*</span>
                      </h2>
                      <p>
                        File types supported: JPG, PNG, GIF, SVG, MP4, WEBM, MP3,
                        WAV, OGG, GLB, GLTF. Max size: 100 MB
                      </p>
                      {type === 'audio' ? (
                        <div className="nftdropzone">
                          <NFTDropzone
                            isClearPreview={isClearPreview}
                            nftType="Audio"
                            onChange={(newfile) => fileHandler(newfile)}
                          />
                        </div>
                      ) : type === 'video' ? (
                        <div className="nftdropzone">
                          <NFTDropzone
                            isClearPreview={isClearPreview}
                            nftType="Video"
                            onChange={(newfile) => fileHandler(newfile)}
                          />
                        </div>
                      ) : type === 'image' ? (
                        <div className="nftdropzone">
                          <NFTDropzone
                            isClearPreview={isClearPreview}
                            nftType="image"
                            onChange={(newfile) => fileHandler(newfile)}
                          />
                        </div>
                      ) : (
                        ''
                      )}

                      <div className='row'>
                        <div className='col-md-6 col-12'>
                          <div className="sign__group">
                            <h2 className="createStepLabel">NFT Type</h2>
                            <select
                              id="type"
                              name="type"
                              className="sign__select inputBg"
                              onChange={(e) => setType(e.target.value)}
                            >
                              <option value="image">Image</option>
                              <option value="audio">Audio</option>
                              <option value="video">Video</option>
                            </select>
                          </div>
                        </div>

                        <div className='col-md-6 col-12'>
                          <div className="sign__group">
                            <h2 className="createStepLabel">Category</h2>
                            <select
                              id="category"
                              name="category"
                              className="sign__select"
                              value={category}
                              onChange={(e) => setCategory(e.target.value)}
                            >
                              <option value="art">Art</option>
                              <option value="music">Music</option>
                              <option value="film">Film</option>
                              <option value="sports">Sports</option>
                              <option value="education">Education</option>
                              <option value="photography">Photography</option>
                              <option value="games">Games</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>

                        <div className='col-md-6 col-12'>
                          <div className="sign__group">
                            <h2 className="createStepLabel">Title <span className="validation">*</span></h2>
                            <input
                              id="name"
                              type="text"
                              name="name"
                              className="sign__input "
                              placeholder="Title"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className='col-md-12 col-12'>
                          <div className="sign__group">
                            <h2 className="createStepLabel">Description <span className="validation">*</span></h2>
                            <textarea
                              id="description"
                              name="description"
                              className="sign__textarea"
                              placeholder="Description"
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                          </div>
                        </div>

                        <div className='col-md-6 col-12'>
                          <div className="sign__group">
                            <label
                              className="sign__label createStepLabel mr-3"
                              htmlFor="sale"
                            >
                              Mint Type
                            </label>
                            <select
                              id="mintType"
                              name="mintType"
                              className="sign__select "
                              value={isMIntType}
                              onChange={(e) => setMIntType(e.target.value)}
                            >
                              <option value="lazyMint">Lazy Mint</option>
                              <option value="normalMint">Normal Mint</option>
                            </select>
                          </div>
                        </div>

                        <div className='col-md-12 col-12'>
                          <div className="sign__group mt-4 pb-3">
                            <label
                              className="sign__label switch_lab_space mr-3"
                              htmlFor="sale"
                            >
                              List for Sale
                            </label>
                            <Switch
                              onChange={() => {
                                setIsSale(!isSale)
                              }}
                              checked={isSale}
                              checkedIcon
                              uncheckedIcon
                              height={26}
                              className="createListSwitch"
                            />
                          </div>
                        </div>

                        <div className='col-md-12 col-12'>
                          <div className="sign__group">
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                flexDirection: 'row',
                              }}
                            >
                              <label className="sign__label" htmlFor="royalties">
                                Royalties
                              </label>
                              <button className="royaltyBtnNew">{royalties}%</button>
                            </div>
                            <ReactSlider
                              className="horizontal-slider ml-1"
                              thumbClassName="example-thumb"
                              trackClassName="example-track"
                              defaultValue={7}
                              value={royalties}
                              onChange={(e) => {
                                setRoyalties(e)
                              }}
                              min={0}
                              max={20}
                              renderTrack={(props, state) => (
                                <div {...props}>{state.valueNow}</div>
                              )}
                            />
                          </div>
                        </div>

                        {isSale && (
                          <div className='col-md-12 col-12'>
                            <div className="sign__group">
                              {isMIntType == 'lazyMint' ? (
                                <select
                                  id="saleType"
                                  name="saleType"
                                  className="sign__select "
                                  value={saleType}
                                  onChange={(e) => setSaleType(e.target.value)}
                                >
                                  <option value="Fixed">Fixed Price</option>
                                </select>
                              ) : (
                                <select
                                  id="saleType1"
                                  name="saleType1"
                                  className="sign__select "
                                  value={saleType}
                                  onChange={(e) => setSaleType(e.target.value)}
                                >
                                  <option value="Auction">Auction</option>
                                  <option value="Fixed">Fixed Price</option>
                                </select>
                              )}


                              <div className="sign__group mt-3">
                                <input
                                  id="price"
                                  type="text"
                                  maxLength={8}
                                  value={price}
                                  onChange={(e) => setPrice(e.target.value)}
                                  name="price"
                                  className="sign__input"
                                  placeholder="BNB Price"
                                />
                              </div>

                              {isMIntType == 'lazyMint' ? null : (
                                <>
                                  {saleType === 'Auction' && (
                                    <div className="sign__group">
                                      <select
                                        id="length"
                                        name="length"
                                        className="sign__select mt-0"
                                        value={auctionLength}
                                        onChange={(e) =>
                                          setAuctionLength(e.target.value)
                                        }
                                      >
                                        {/* <option value="1">15 mintues</option> */}
                                        <option value="12">12 hours</option>
                                        <option value="24">24 hours</option>
                                        <option value="48">2 days</option>
                                        <option value="72">3 days</option>
                                        <option value="168">7 days</option>
                                      </select>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-100 pl-md-0 pr-md-0 pl-0 pr-0 mb-xs-4">
                    <button
                      type="button"
                      className="asset__btn asset__btn--full asset__btn--clr open-modal mr-0 createbtn"
                      onClick={createNFT}
                      disabled={isCreateProcess}
                    >
                      {isCreateProcess ? 'Creating...' : 'Create'}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Create

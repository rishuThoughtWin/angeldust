import React, {useEffect, useState} from 'react'

import Web3 from 'web3'
import ReservedMarketPlace from '../services/smart-contract/reserveAuction.json'

export const TransactionContext = React.createContext()
let eth
let web3
let web3Mobile

const reserveContractAddress = process.env.REACT_APP_RESERVE_MARKETPLACE
const collectionContractAddress = process.env.REACT_APP_COLLECTION_FACTORY

export const TransactionProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState()

  const [walletProvider, setWalletProvider] = useState()
  const [walletConnectProvider, setWalletConnectProvider] = useState()

  let reserveContractInstance1
  let reserveContractInstance1Mobile
  let collectionFactoryInstance

  const [active, setActive] = useState(false)

  if (typeof window !== 'undefined') {
    web3 = new Web3(Web3.givenProvider || walletProvider)
  }

  reserveContractInstance1 = new web3.eth.Contract(
    ReservedMarketPlace.abi,
    reserveContractAddress,
  )

  const getOwnerAddress = async () => {
    let ownerAddress
    if (walletConnectProvider) {
      ownerAddress = await reserveContractInstance1Mobile.methods.owner().call()
    } else {
      ownerAddress = await reserveContractInstance1.methods.owner().call()
    }
    return ownerAddress
  }

  web3Mobile = new Web3(walletConnectProvider)
  reserveContractInstance1Mobile = new web3Mobile.eth.Contract(
    ReservedMarketPlace.abi,
    reserveContractAddress,
  )

  useEffect(() => {
    if (localStorage.getItem('walletProvider')) {
      setWalletProvider(localStorage.getItem('walletProvider'))
    } else if (localStorage.getItem('walletConnectProvider')) {
      setWalletConnectProvider(localStorage.getItem('walletConnectProvider'))
    }
  }, [])
  return (
    <TransactionContext.Provider
      value={{
        // connectWallet,
        currentAccount,

        walletProvider,
        setWalletProvider,
        eth,
        // mobileWallet,
        // handleChange,
        // sendTransaction,
        reserveContractInstance1,
        reserveContractInstance1Mobile,

        setWalletConnectProvider,
        walletConnectProvider,
        getOwnerAddress,

        active,
      }}
    >
      {children}
    </TransactionContext.Provider>
  )
}

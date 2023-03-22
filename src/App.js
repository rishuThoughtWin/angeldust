import React, {useState} from 'react'
import './styles/auth.css'
import './App.css'
import Routes from './routes'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {useSelector} from 'react-redux'
import {TransactionProvider} from './context/walletConnectweb3'

const App = () => {
  const [authenticated, setAuthenticated] = useState(false)

  const { theme } = useSelector((state) => state.web3)

  return (
    <TransactionProvider>
      <div className="App">
        <Routes authenticated={authenticated} />
        <ToastContainer autoClose={5000} hideProgressBar />
      </div>
    </TransactionProvider>
  )
}

export default App

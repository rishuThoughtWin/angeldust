import { Container } from "react-bootstrap";
import { CreationSteps, Button } from "components";
import "./Success.css";
import Web3 from "web3";
import { useHistory } from "react-router-dom";
import Thumb from "../../assets/img/thumb.png";

export const Success = () => {
  const history = useHistory();

  const handleSuccess = async()=>{
    let currentAccount = null;
    const web3 = new Web3(Web3.givenProvider || window.etherum);
      currentAccount = await web3.eth.requestAccounts();
      currentAccount = currentAccount[0];
    
    history.push(`/creator/${currentAccount}?tab=collection`)
  }
  return (
    <div className="signIn_card card chain_Card">
      <div>
        <div className="mb-3">
          <img src={Thumb} alt="Image" />
        </div>
        <label className="mb-2">Successful !</label>
        <h5 className="text-center collect_chain mb-3">Collection Successfully Created</h5>
        <Button type="primary" onClick={() => handleSuccess()} >
          Done
        </Button>
      </div>
    </div>
  );
};

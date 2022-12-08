import React, { useState } from "react";
import { Button } from "reactstrap";
import Modal from '@mui/material/Modal';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import "./style.scss";

import HashPackConnectModal from "components/HashPackConnectModal";
import { useHashConnect } from "../../assets/api/HashConnectAPIProvider.tsx";

import { useDispatch } from 'react-redux'
import { setGroundNumber } from "../../components/Features/GroundNumber";
import { setWalletData } from "components/Features/WalletData";
import store from "../../store";

function MainNavbar() {
  const dispatch = useDispatch()

  const [addresshidden, setAddressHidden] = useState(true);

  const [walletConnectModalViewFlag, setWalletConnectModalViewFlag] = useState(false);

  const { walletData, installedExtensions, connect, disconnect } = useHashConnect();
  const { accountIds } = walletData;

/*  console.log("walletData", walletData);

  if(walletData.accountIds != undefined)
    dispatch(setWalletData(walletData));*/

  store.subscribe(() => {
    if(store.getState().gameScene.value == "totalmap")
      setAddressHidden(false);
  });

  const onClickWalletConnectModalClose = () => {
    setWalletConnectModalViewFlag(false);
  }

  const onClickOpenConnectModal = () => {
    setWalletConnectModalViewFlag(true);
    console.log("onClickOpenConnectModal log - 1 : ", walletData);
  }

  const onClickDisconnectHashPack = () => {
    disconnect();
    setWalletConnectModalViewFlag(false);
  }

  const onClickCopyPairingStr = () => {
    navigator.clipboard.writeText(walletData.pairingString);
  };

  const onClickConnectHashPack = () => {
    console.log("onClickConnectHashPack log - 1");
    if (installedExtensions) {
      connect();
      setWalletConnectModalViewFlag(false);
    } else {
      alert(
        "Please install hashconnect wallet extension first. from chrome web store."
      );
    }
  };

  const onAddresskeyPress = (e) => {
    if(e.key == 'Enter')
      dispatch(setGroundNumber(e.target.value));
  };

  return (
    <div className="main-nav-container">
      <div className="main-nav-wrapper">
        <div className="nav-links">
          {
            accountIds?.length > 0 &&
            <Avatar alt="" src={process.env.PUBLIC_URL + "imgs/avatars/5.png"} />
          }
        </div>
        {/* <TextField className="search-address-input" label="search address" size="small" /> */}
        <OutlinedInput className="search-address-input" placeholder="Please enter address" onKeyDown={onAddresskeyPress} hidden={addresshidden} />
        {/* <TextField label="Search address" className="search-address-input" variant="filled" color="secondary" size="small" /> */}
        <div className="nav-buttons">
          <Button className="wallet-connect-button" onClick={() => onClickOpenConnectModal()}>
            {
              !accountIds &&
              <img alt="..." src={require("assets/imgs/wallet-connect-icon.png")} />
            }
            <p>{accountIds?.length > 0 ? accountIds[0] : "Connect Wallet"}</p>
          </Button>
        </div>
      </div>
      <Modal
        open={walletConnectModalViewFlag}
        onClose={() => onClickWalletConnectModalClose()}
        centered={true}
        className="hashpack-connect-modal"
      >
        <HashPackConnectModal
          pairingString={walletData.pairingString}
          connectedAccount={accountIds}
          onClickConnectHashPack={onClickConnectHashPack}
          onClickCopyPairingStr={onClickCopyPairingStr}
          onClickDisconnectHashPack={onClickDisconnectHashPack}
        />
      </Modal>
    </div>
  );
}

export default MainNavbar;

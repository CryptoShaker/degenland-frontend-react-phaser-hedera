import React, { useState, useEffect } from "react";
import axios from "axios";
import * as env from "../../env";
import "./style.scss";

import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHashConnect } from "../../assets/api/HashConnectAPIProvider.tsx";

function Main() {

    const { walletData } = useHashConnect();
    const { accountIds } = walletData;

    const [loadingView, setLoadingView] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const [loginFlag, setLoginFlag] = useState(false);
    const [playerInfo, setPlayerInfo] = useState({});

    const [walletNftInfo, setWalletNftInfo] = useState([]);

    const [selectedLand, setSelectedLand] = useState(0);

    const onChangeSelectLand = (newValue) => {
        setSelectedLand(newValue);
    };

    useEffect(() => {
        if (accountIds?.length > 0) {
            setLoginFlag(false);
            getPlayerInfo(accountIds[0]);
            getWalletNftData(accountIds[0]);
        } else {
        }
    }, [accountIds]);

    //--------------------------------------------------------------------------------------------------

    const getPlayerInfo = async (accountId_) => {
        console.log("getPlayerInfo log - 1: ", accountId_);
        setLoadingView(true);
        const g_playerInfo = await getInfoResponse(env.SERVER_URL + "/api/account/get_player?accountId=" + accountId_);
        console.log("getPlayerInfo log - 2: ", g_playerInfo);

        if (!g_playerInfo) {
            toast.error("Something wrong with server!");
            setLoadingView(false);
            return;
        }

        if (!g_playerInfo.data.result) {
            toast.error(g_playerInfo.data.error);
            setLoadingView(false);
            return;
        }

        setPlayerInfo({
            playerId: g_playerInfo.data.data.playerId,
            avatarUrl: g_playerInfo.data.data.avatarUrl
        });
        setLoginFlag(true);

        setLoadingView(false);
    }

    const getWalletNftData = async (accountId_) => {
        console.log("getWalletNftData log - 1 : ", accountId_);
        setLoadingView(true);

        let _nextLink = null;
        let _newWalletNftInfo = [];

        let _WNinfo = await getInfoResponse(env.MIRROR_NET_URL + "/api/v1/accounts/" + accountId_ + "/nfts");
        if (_WNinfo && _WNinfo.data.nfts.length > 0)
            _nextLink = _WNinfo.data.links.next;

        while (1) {
            let _tempNftInfo = _WNinfo.data.nfts;

            for (let i = 0; i < _tempNftInfo.length; i++) {
                if (_tempNftInfo[i].token_id === env.DEGENLAND_NFT_ID ||
                    _tempNftInfo[i].token_id === env.TYCOON_NFT_ID ||
                    _tempNftInfo[i].token_id === env.MOGUL_NFT_ID ||
                    _tempNftInfo[i].token_id === env.INVESTOR_NFT_ID) {
                    _newWalletNftInfo.push({
                        tokenId: _tempNftInfo[i].token_id,
                        serialNum: _tempNftInfo[i].serial_number
                    })
                }
            }

            if (!_nextLink || _nextLink === null) break;

            _WNinfo = await getInfoResponse(env.MIRROR_NET_URL + _nextLink);
            _nextLink = null;
            if (_WNinfo && _WNinfo.data.nfts.length > 0)
                _nextLink = _WNinfo.data.links.next;
        }
        console.log("getWalletNftData log - 2 : ", _newWalletNftInfo);
        setWalletNftInfo(_newWalletNftInfo);
        setRefreshFlag(!refreshFlag);
        setLoadingView(false);
    }

    //--------------------------------------------------------------------------------------------------

    // axios get
    const getInfoResponse = async (urlStr_) => {
        try {
            return await axios.get(urlStr_);
        } catch (error) {
            console.log(error);
        }
    };

    // axios post
    const postInfoResponse = async (urlStr_, postData_) => {
        let _response = await axios
            .post(urlStr_, postData_)
            .catch((error) => console.log('Error: ', error));
        if (_response && _response.data) {
            // console.log(_response);
            return _response;
        }
    }

    return (
        <>
            <div className="main-container">
                <div className="main-wrapper">
                    <div className="account-info">
                        <Avatar
                            src={env.SERVER_URL + playerInfo.avatarUrl}
                            sx={{ width: 64, height: 64 }}
                        />
                        <p style={{
                            color: "#373B44",
                            fontSize: "18px",
                            fontWeight: "700"
                        }}>{playerInfo.playerId}</p>
                        {
                            accountIds?.length > 0 &&
                            <p>{accountIds[0]}</p>
                        }
                    </div>
                    <div>
                        <Tabs
                            className="lands-wrapper"
                            value={selectedLand}
                            orientation="vertical"
                            onChange={onChangeSelectLand}
                            variant="scrollable"
                            scrollButtons
                            aria-label="visible arrows tabs example"
                            sx={{
                                [`& .${tabsClasses.scrollButtons}`]: {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}

                        >
                            <Tab
                                icon={<img alt="" className="land-image"
                                    src="imgs/front/nfts/degenland.png" />}
                                label={walletNftInfo[0].tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${walletNftInfo[0].serialNum}` :
                                    walletNftInfo[0].tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${walletNftInfo[0].serialNum}` :
                                        walletNftInfo[0].tokenId === env.MOGUL_NFT_ID ? `Mogul - ${walletNftInfo[0].serialNum}` : `Investor - ${walletNftInfo[0].serialNum}`}
                            />
                            <Tab
                                icon={<img alt="" className="land-image"
                                    src="imgs/front/nfts/degenland.png" />}
                                label={walletNftInfo[1].tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${walletNftInfo[1].serialNum}` :
                                    walletNftInfo[1].tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${walletNftInfo[1].serialNum}` :
                                        walletNftInfo[1].tokenId === env.MOGUL_NFT_ID ? `Mogul - ${walletNftInfo[1].serialNum}` : `Investor - ${walletNftInfo[1].serialNum}`}
                            />
                            <Tab
                                icon={<img alt="" className="land-image"
                                    src="imgs/front/nfts/degenland.png" />}
                                label={walletNftInfo[2].tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${walletNftInfo[2].serialNum}` :
                                    walletNftInfo[2].tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${walletNftInfo[2].serialNum}` :
                                        walletNftInfo[2].tokenId === env.MOGUL_NFT_ID ? `Mogul - ${walletNftInfo[2].serialNum}` : `Investor - ${walletNftInfo[2].serialNum}`}
                            />
                            {/* {
                                walletNftInfo?.length > 0 &&
                                walletNftInfo.map((item_, index_) => {
                                    return <Tab
                                        icon={<img alt="" className="land-image"
                                            src="imgs/front/nfts/degenland.png" />}
                                        label={item_.tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${item_.serialNum}` :
                                            item_.tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${item_.serialNum}` :
                                                item_.tokenId === env.MOGUL_NFT_ID ? `Mogul - ${item_.serialNum}` : `Investor - ${item_.serialNum}`}
                                    />;
                                })
                            } */}
                        </Tabs>
                    </div>
                </div>
            </div>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loadingView}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <ToastContainer autoClose={5000} draggableDirection="x" />
        </>
    );
}

export default Main;

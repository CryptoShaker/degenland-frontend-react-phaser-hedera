import React, { useState, useEffect } from "react";
import axios from "axios";
import * as env from "../../env";
import "./style.scss";

import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import ApartmentIcon from '@mui/icons-material/Apartment';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TerrainIcon from '@mui/icons-material/Terrain';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import ForestIcon from '@mui/icons-material/Forest';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import { Button, Grid } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useHashConnect } from "../../assets/api/HashConnectAPIProvider.tsx";

const TOTAL_MAP = "total-map";
const SINGLE_MAP = "single-map";
const EDIT_MAP = "edit-map";

const MAP_TYPE = [TOTAL_MAP, SINGLE_MAP, EDIT_MAP];

function Main() {

    const { walletData } = useHashConnect();
    const { accountIds } = walletData;

    const [loadingView, setLoadingView] = useState(false);
    const [refreshFlag, setRefreshFlag] = useState(false);

    const [loginFlag, setLoginFlag] = useState(false);
    const [playerInfo, setPlayerInfo] = useState({});

    const [chatStr, setChatStr] = useState("");

    const [walletNftInfo, setWalletNftInfo] = useState([]);
    const [currentLandInfo, setCurrentLandInfo] = useState({
        tokenId: env.DEGENLAND_NFT_ID,
        serialNum: 1,
        buildingCount: 10,
        customerCount: 10,
        landBalance: 100
    });

    const [groundTileInfo, setGroundTileInfo] = useState([
        { url: process.env.PUBLIC_URL + "imgs/ground/g-1.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-2.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-3.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-4.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-5.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-6.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-7.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-8.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-9.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-10.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-11.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-12.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-13.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-14.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-15.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-16.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-17.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-18.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-19.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-20.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-21.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-22.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-23.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-24.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-25.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-26.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-27.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-28.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-29.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-30.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-31.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-32.png" },
        { url: process.env.PUBLIC_URL + "imgs/ground/g-33.png" }
    ]);

    const [selectedLandTabNo, setSelectedLand] = useState(0);
    const [currentMap, setCurrentMap] = useState(MAP_TYPE[0]);

    const [drawMapToolValue, setDrawMapToolValue] = React.useState(0);

    const onChangeDrawMapTool = (event, newValue) => {
        setDrawMapToolValue(newValue);
    };

    const onClickTile = (index_) => {
        console.log("onClickTile - 1 : ", index_);
    }

    const onChangeSelectedLandTabNo = (event: React.SyntheticEvent, newValue: number) => {
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
                <div className="account-info">
                    <Avatar
                        className="account-avatar"
                        src={env.SERVER_URL + playerInfo.avatarUrl}
                        sx={{ width: 82, height: 82 }}
                    />
                    <div className="account-info-str">
                        <p>{playerInfo.playerId}</p>
                        {
                            accountIds?.length > 0 &&
                            <p>{accountIds[0]}</p>
                        }
                    </div>
                </div>
                {
                    currentMap === TOTAL_MAP &&
                    <div className="total-map-wrapper">
                        <Tabs
                            className="lands-wrapper"
                            value={selectedLandTabNo}
                            orientation="vertical"
                            onChange={onChangeSelectedLandTabNo}
                            variant="scrollable"
                            scrollButtons
                            aria-label="visible arrows tabs example"
                            sx={{
                                [`& .${tabsClasses.scrollButtons}`]: {
                                    '&.Mui-disabled': { opacity: 0.3 },
                                },
                            }}

                        >
                            {
                                walletNftInfo?.length > 0 &&
                                walletNftInfo.map((item_, index_) => {
                                    return <Tab
                                        icon={<img alt="" className="land-image"
                                            src={item_.tokenId === env.DEGENLAND_NFT_ID ? "imgs/front/nfts/degenland.png" :
                                                item_.tokenId === env.TYCOON_NFT_ID ? "imgs/front/nfts/tycoon.png" :
                                                    item_.tokenId === env.MOGUL_NFT_ID ? "imgs/front/nfts/mogul.png" : "imgs/front/nfts/investor.png"} />}
                                        label={
                                            item_.tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${item_.serialNum}` :
                                                item_.tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${item_.serialNum}` :
                                                    item_.tokenId === env.MOGUL_NFT_ID ? `Mogul - ${item_.serialNum}` : `Investor - ${item_.serialNum}`
                                        }
                                    />;
                                })
                            }
                        </Tabs>
                    </div>
                }
                {
                    (currentMap === SINGLE_MAP || currentMap === EDIT_MAP) &&
                    <div className="single-map-wrapper">
                        <div className="map-info">
                            <div className="map-detail">
                                <div>
                                    <ApartmentIcon />
                                    <p>{currentLandInfo.buildingCount}</p>
                                </div>
                                <div>
                                    <PeopleIcon />
                                    <p>{currentLandInfo.customerCount}</p>
                                </div>
                                <div>
                                    <TrendingUpIcon />
                                    <p>{currentLandInfo.landBalance}</p>
                                </div>
                            </div>
                            <p>{
                                currentLandInfo.tokenId === env.DEGENLAND_NFT_ID ? `Degenland - ${currentLandInfo.serialNum}` :
                                    currentLandInfo.tokenId === env.TYCOON_NFT_ID ? `Tycoon - ${currentLandInfo.serialNum}` :
                                        currentLandInfo.tokenId === env.MOGUL_NFT_ID ? `Mogul - ${currentLandInfo.serialNum}` : `Investor - ${currentLandInfo.serialNum}`
                            }</p>
                        </div>
                        <img alt="" className="land-image"
                            src={currentLandInfo.tokenId === env.DEGENLAND_NFT_ID ? "imgs/front/nfts/degenland.png" :
                                currentLandInfo.tokenId === env.TYCOON_NFT_ID ? "imgs/front/nfts/tycoon.png" :
                                    currentLandInfo.tokenId === env.MOGUL_NFT_ID ? "imgs/front/nfts/mogul.png" : "imgs/front/nfts/investor.png"} />
                    </div>
                }
                {
                    currentMap === SINGLE_MAP &&
                    <div className="chatting-wrapper">
                        <input value={chatStr} onChange={(e) => { setChatStr(e.target.value) }} />
                        <Button>
                            <SendIcon />
                        </Button>
                    </div>
                }
                {
                    currentMap === EDIT_MAP &&
                    <div className="edit-map-wrapper">
                        <Box className="draw-map-tool">
                            <Tabs
                                value={drawMapToolValue}
                                onChange={onChangeDrawMapTool}
                                variant="scrollable"
                                scrollButtons="auto"
                                aria-label="scrollable auto tabs example"
                            >
                                <Tab icon={<TerrainIcon />} label="Ground" />
                                <Tab icon={<AddRoadIcon />} label="Road" />
                                <Tab icon={<ApartmentIcon />} label="Building" />
                                <Tab icon={<ForestIcon />} label="Object" />
                            </Tabs>
                            <div className="map-content-wrapper">
                                <Grid container>
                                    {
                                        groundTileInfo.map((item_, index_) => {
                                            return <Grid item xs={12} md={6} className="single-map-tile" onClick={() => onClickTile(index_)}>
                                                <img alt="" src={item_.url} />
                                            </Grid>;
                                        })
                                    }
                                </Grid>
                            </div>
                        </Box>
                    </div>
                }
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

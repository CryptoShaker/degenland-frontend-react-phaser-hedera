import React from "react";
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TerrainIcon from '@mui/icons-material/Terrain';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ForestIcon from '@mui/icons-material/Forest';
import SendIcon from '@mui/icons-material/Send';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import ReplyIcon from '@mui/icons-material/Reply';
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';

import Game from "../Phaser/Game"
import "./style.scss";
import store from "../../store";
import { useDispatch } from 'react-redux'
import { setBuilding } from '../../components/Features/BuildingNumber';
import { setGroundNumber } from '../../components/Features/GroundNumber';
import { setGroundBuilding } from '../../components/Features/GroundBuilding';
import { setRoadBuilding } from '../../components/Features/RoadBuilding';
import { setChat, setClicked } from "../../components/Features/Chat";
import { backtoTotalMap, clickPosition, setVisit, setVisitPark } from "../../components/Features/GameScene";

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import StarIcon from '@material-ui/icons/Star';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="down" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }
}));

function TotalMap() {
    const dispatch = useDispatch()
    let history = useHistory();

    const [chathidden, setChatHidden] = React.useState(true);
    const [hiddenBox, setHiddenBox] = React.useState(true);
    const [drawMapToolValue, setDrawMapToolValue] = React.useState(0);
    const [chatinputValue, setChatInputValue] = React.useState("");

    const stateGameScene = useSelector(state => state.gameScene);

    const [open, setOpen] = React.useState(false);
    const [parkopen, setParkOpen] = React.useState(false);

    const classes = useStyles();

    store.subscribe(() => {
        if (store.getState().gameScene.value == "singlezone") {
            setChatHidden(false);
            setHiddenBox(false);
        }
        else if (store.getState().gameScene.value == "totalmap") {
            setHiddenBox(true);
            setChatHidden(true);
        }

        if (store.getState().gameScene.clickPosition == 1) {
            setOpen(true);
            dispatch(clickPosition(0));
        }
        else if (store.getState().gameScene.clickPosition == 2) {
            setParkOpen(true);
            dispatch(clickPosition(0));
        }
    });


    const handleMouseDown = (e) => {
        e.stopPropagation();
    }

    const handleMouseUp = (e) => {
        e.stopPropagation();
    }

    const handleVisit = (e) => {
        setOpen(false);
        dispatch(setVisit(true));
    }

    const handleClose = () => {
        setOpen(false);
    };

    const handlePark = () => {
        setParkOpen(false);
    };

    const onBackClick = () => {
        if (stateGameScene.value == "totalmap")
            history.push('/home');
        else if (stateGameScene.value == "singlezone") {
            dispatch(backtoTotalMap(1));
        }
    }

    const onChatChange = (e) => {
        setChatInputValue(e.target.value);
    };

    const onSendClick = (e) => {
        setChatInputValue("");
        dispatch(setChat(chatinputValue));
    };

    const onChatClick = (e) => {
        dispatch(setClicked(1));
    };

    const onChatkeyPress = (e) => {
        if (e.key == 'Enter') {
            dispatch(setChat(e.target.value));
            e.target.value = "";
        }
    };

    const onChangeDrawMapTool = (event, newValue) => {
        setDrawMapToolValue(newValue);
    };

    const onClickgroundTile = (index_) => {
        console.log("onClickgroundTile - 1 : ", index_);
        dispatch(setGroundBuilding(index_));
    }

    const onClickbuildingTile = (index_) => {
        console.log("onClickbuildingTile : ", index_);
        dispatch(setBuilding(index_ + 1));
    }

    const onClickroadTile = (index_) => {
        dispatch(setRoadBuilding(index_ + 1));
    }

    return (
        <>
            <div className="single-zone-container">
                <div className="single-zone-wrapper">
                </div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Room Detail"}</DialogTitle>
                    <DialogContent>
                        <div className={classes.root}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Box
                                        component="img"
                                        src={"/imgs/front/home-background.jpg"}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                    <StarIcon />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        owner:
                                    </Typography>
                                    <Avatar alt="Remy Sharp" src={process.env.PUBLIC_URL + "imgs/avatars/1.jpg"} />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        building count: 100
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        current visitor: 50
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        total visitor: 150
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleVisit} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} color="primary">
                            Visit
                        </Button>
                    </DialogActions>
                </Dialog>
                <Dialog
                    open={parkopen}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{"Park"}</DialogTitle>
                    <DialogContent>
                        <div className={classes.root}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        Comming Soon...
                                    </Typography>
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handlePark} color="primary">
                            Ok
                        </Button>
                    </DialogActions>
                </Dialog>
                <ReplyIcon onClick={onBackClick} />
                <div className="chat-wrapper" onKeyDown={onChatkeyPress} onClick={onChatClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} hidden={chathidden}>
                    <OutlinedInput
                        className="chat-text-input"
                        value={chatinputValue}
                        onChange={onChatChange}
                        onInput={(e) => {
                            if (e.target.value.length > 45)
                                e.target.value = e.target.value.slice(0, 45);
                        }} />
                    <Button variant="text" onClick={onSendClick} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                        <SendIcon />
                    </Button>
                </div>
                <Box className="draw-map-tool" hidden={hiddenBox}>
                    <Tabs
                        value={drawMapToolValue}
                        onChange={onChangeDrawMapTool}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                    >
                        <Tab icon={<TerrainIcon />} label="Ground" />
                        <Tab icon={<AddRoadIcon />} label="Road" />
                        <Tab icon={<ApartmentIcon />} label="Building" />
                        <Tab icon={<ForestIcon />} label="Object" />
                    </Tabs>
                    <div className="map-content-wrapper">
                        <Grid container>
                            {
                                drawMapToolValue == 0 &&
                                groundTileInfo.map((item_, index_) => {
                                    return <Grid key={index_} item xs={12} md={6} className="single-map-tile" onClick={() => onClickgroundTile(index_)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                                        <img alt="" src={item_.url} />
                                    </Grid>;
                                })
                            }
                            {
                                drawMapToolValue == 1 &&
                                roadTileInfo.map((item_, index_) => {
                                    return <Grid key={index_} item xs={12} md={6} className="single-map-tile" onClick={() => onClickroadTile(index_)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                                        <img alt="" src={item_.url} />
                                    </Grid>;
                                })
                            }
                            {
                                drawMapToolValue == 2 &&
                                buildingTileInfo.map((item_, index_) => {
                                    return <Grid key={index_} item xs={12} md={6} className="single-map-tile" onClick={() => onClickbuildingTile(index_)} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
                                        <img alt="" src={item_.url} />
                                    </Grid>;
                                })
                            }
                        </Grid>
                    </div>
                </Box>
            </div>
        </>
    );
}

export default TotalMap;

const buildingTileInfo = [
    { url: process.env.PUBLIC_URL + "imgs/building/b (1).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (2).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (3).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (4).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (5).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (6).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (7).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (8).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (9).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (10).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (11).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (12).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (13).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (14).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (15).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (16).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (17).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (18).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (19).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (20).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (21).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (22).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (23).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (24).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (25).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (26).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (27).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (28).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (29).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (30).png" },
    { url: process.env.PUBLIC_URL + "imgs/building/b (31).png" },
];

const groundTileInfo = [
    { url: process.env.PUBLIC_URL + "imgs/ground/g(0).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(1).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(2).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(3).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(4).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(5).png" },
    { url: process.env.PUBLIC_URL + "imgs/ground/g(6).png" }
];

const roadTileInfo = [
    { url: process.env.PUBLIC_URL + "imgs/road/r (1).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (2).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (3).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (4).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (5).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (6).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (7).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (8).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (9).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (10).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (11).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (12).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (13).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (14).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (15).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (16).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (17).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (18).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (19).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (20).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (21).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (22).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (23).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (24).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (25).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (26).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (27).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (28).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (29).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (30).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (31).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (32).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (33).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (34).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (35).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (36).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (37).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (38).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (39).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (40).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (41).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (42).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (43).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (44).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (45).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (46).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (47).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (48).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (49).png" },
    { url: process.env.PUBLIC_URL + "imgs/road/r (50).png" }
];

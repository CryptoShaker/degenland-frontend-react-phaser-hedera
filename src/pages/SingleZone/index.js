import React from "react";
import "./style.scss";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TerrainIcon from '@mui/icons-material/Terrain';
import AddRoadIcon from '@mui/icons-material/AddRoad';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ForestIcon from '@mui/icons-material/Forest';
import { Grid } from '@mui/material';

import SinglePlace from "../Phaser/SinglePlace"


function SingleZone() {
    const [drawMapToolValue, setDrawMapToolValue] = React.useState(0);

    const onChangeDrawMapTool = (event, newValue) => {
        setDrawMapToolValue(newValue);
    };

    const onClickTile = (index_) => {
        console.log("onClickTile - 1 : ", index_);
    }

    return (
        <>
            <div className="single-zone-container">
                <div className="single-zone-wrapper">
                </div>
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
//                                TREASURY_ID_SWAP === 1 &&
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
        </>
    );
}

export default SingleZone;

const groundTileInfo = [
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
]

import React from "react";
import { Button } from "reactstrap";
import "./style.scss";

const MainFooter = () => {
    return (
        <div className="footer-container">
            <div className="footer-wrapper">
                <div className="info-wrapper">
                </div>
                <div className="social-link-buttons">
                    <Button>
                        <img alt="..." src={require("assets/imgs/discord-icon.png")} />
                    </Button>
                    <Button>
                        <img alt="..." src={require("assets/imgs/twitter-icon.png")} />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default MainFooter;
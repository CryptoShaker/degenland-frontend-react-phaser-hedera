import React, { Component } from 'react';
import Phaser from 'phaser';
import Map from "./Map";
import SinglePlace from "./SinglePlace";

class Game extends Component {
    // Build the Game class
    componentDidMount() {
        const config = {
            type:Phaser.AUTO,
            parent: 'render-game',
            scale:{
              mode: Phaser.Scale.RESIZE
            },
            physics:{
              default:'arcade',
              arcade:
              {
                debug: false,
                gravity: { y: 0 },
              },
          
            },
            fps:{
             target:60,
            },
            dom: {
                createContainer: false
             },
            audio: {
                disableWebAudio: true
            },
            render:{
              imageSmoothingEnabled:false,
              transparent: false,
            },
            autoFocus:true,
            width:window.innerWidth,
            height:window.innerHeight,
            scene: [Map, SinglePlace]
        };
          
        this.game = new Phaser.Game(config);
    };

    render() {
      return <div id='render-game' />
    };
};

export default Game;
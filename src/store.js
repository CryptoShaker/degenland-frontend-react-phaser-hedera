import { configureStore } from '@reduxjs/toolkit';
import buildingReducer from './components/Features/BuildingNumber';
import groundbuildingReducer from './components/Features/GroundBuilding';
import groundReducer from './components/Features/GroundNumber';
import roadReducer from './components/Features/RoadBuilding';
import chatReducer from './components/Features/Chat';
import gameReducer from './components/Features/GameScene';
import walletdataReducer from './components/Features/WalletData';

export default configureStore({
  reducer: {
    walletData: walletdataReducer,
    roadBuilding: roadReducer,
    groundBuilding: groundbuildingReducer,
    buildingNumber: buildingReducer,
    groundNumber: groundReducer,
    gameScene: gameReducer,
    Chat: chatReducer
  },
})
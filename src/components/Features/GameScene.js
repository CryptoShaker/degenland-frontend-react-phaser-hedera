import { createSlice } from '@reduxjs/toolkit'

export const gameScene = createSlice({
  name: 'gameScene',
  initialState: {
    value: "",
    isbacked: 0,
    clickPosition: 0,
    visit: false,
    visitPark: false
  },
  reducers: {
    setgameScene: (state, action) => {
      state.value = action.payload
    },
    backtoTotalMap: (state, action) => {
      state.isbacked = action.payload
    },
    clickPosition: (state, action) => {
      state.clickPosition = action.payload
    },
    setVisit: (state, action) => {
      state.visit = action.payload
    },
    setVisitPark: (state, action) => {
      state.visitPark = action.payload
    }
  },
})

// Action creators are generated for each case reducer function
export const { setgameScene, backtoTotalMap, clickPosition, setVisit, setVisitPark } = gameScene.actions

export default gameScene.reducer
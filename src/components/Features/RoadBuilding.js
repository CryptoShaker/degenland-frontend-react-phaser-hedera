import { createSlice } from '@reduxjs/toolkit'

export const RoadBuilding = createSlice({
  name: 'roadBuilding',
  initialState: {
    value: -1,
  },
  reducers: {
    resetRoadBuilding: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = -1
    },
    setRoadBuilding: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { resetRoadBuilding, setRoadBuilding } = RoadBuilding.actions

export default RoadBuilding.reducer
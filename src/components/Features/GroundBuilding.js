import { createSlice } from '@reduxjs/toolkit'

export const GroundBuilding = createSlice({
  name: 'groundBuilding',
  initialState: {
    value: -1,
  },
  reducers: {
    resetGroundBuilding: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = -1
    },
    setGroundBuilding: (state, action) => {
      state.value = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { resetGroundBuilding, setGroundBuilding } = GroundBuilding.actions

export default GroundBuilding.reducer
import { createSlice } from '@reduxjs/toolkit'

export const GroundNumber = createSlice({
  name: 'GroundNumber',
  initialState: {
    value: 0,
  },
  reducers: {
    setGroundNumber: (state, action) => {
      state.value = action.payload;
    },
  },
})

// Action creators are generated for each case reducer function
export const { setGroundNumber } = GroundNumber.actions

export default GroundNumber.reducer
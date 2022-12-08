import { createSlice } from '@reduxjs/toolkit'

export const WalletData = createSlice({
  name: 'walletData',
  initialState: {
    data: null,
  },
  reducers: {
    setWalletData: (state, action) => {
      state.data = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setWalletData } = WalletData.actions

export default WalletData.reducer
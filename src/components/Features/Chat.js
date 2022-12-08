import { createSlice } from '@reduxjs/toolkit'

export const Chat = createSlice({
  name: 'Chat',
  initialState: {
    value: "",
    clicked: 0,
  },
  reducers: {
    setChat: (state, action) => {
      state.value = action.payload
    },
    setClicked: (state, action) => {
      state.clicked = action.payload
    },
  },
})

// Action creators are generated for each case reducer function
export const { setChat, setClicked } = Chat.actions

export default Chat.reducer
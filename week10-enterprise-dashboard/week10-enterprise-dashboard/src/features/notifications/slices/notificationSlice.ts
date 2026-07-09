import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  messages: string[];
}

const initialState: NotificationState = {
  messages: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },

    clearNotifications: (state) => {
      state.messages = [];
    },
  },
});

export const { addNotification, clearNotifications } =
  notificationSlice.actions;

export default notificationSlice.reducer;
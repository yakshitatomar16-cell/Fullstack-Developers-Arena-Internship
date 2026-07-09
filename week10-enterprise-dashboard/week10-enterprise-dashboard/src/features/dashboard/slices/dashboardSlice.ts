import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DashboardState {
  totalUsers: number;
  revenue: number;
}

const initialState: DashboardState = {
  totalUsers: 0,
  revenue: 0,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    updateDashboard: (
      state,
      action: PayloadAction<{ totalUsers: number; revenue: number }>
    ) => {
      state.totalUsers = action.payload.totalUsers;
      state.revenue = action.payload.revenue;
    },
  },
});

export const { updateDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
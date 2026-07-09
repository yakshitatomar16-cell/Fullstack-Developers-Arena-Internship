import { createSlice } from "@reduxjs/toolkit";

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
    setDashboardData: (state, action) => {
      state.totalUsers = action.payload.totalUsers;
      state.revenue = action.payload.revenue;
    },
  },
});

export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;
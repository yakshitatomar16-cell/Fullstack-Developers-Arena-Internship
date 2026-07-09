import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/slices/authSlice";
import dashboardReducer from "../../features/dashboard/slices/dashboardSlice";
import notificationReducer from "../../features/notifications/slices/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  dashboard: dashboardReducer,
  notifications: notificationReducer,
});

export default rootReducer;
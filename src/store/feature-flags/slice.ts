import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

// type FeatureFlags = {
//   enableGroupMapping: boolean;
//   apiMode: "cloud" | "onprem" | "";
//   enableLdap: boolean;
//   enableDashboard: boolean;
//   emailAsUsername: boolean;
//   trustEmail: boolean;
//   displayName: string;
//   domain: string;
//   logoUrl: string;
//   name: string;
// };

export interface FeatureFlagsState {
  enableGroupMapping: boolean;
  apiMode: "cloud" | "onprem" | "";
  enableLdap: boolean;
  enableDashboard: boolean;
  emailAsUsername: boolean;
  trustEmail: boolean;
  displayName: string;
  domain: string;
  logoUrl: string;
  name: string;
}

const initialState: FeatureFlagsState = {
  enableGroupMapping: false,
  apiMode: "",
  enableLdap: false,
  enableDashboard: false,
  emailAsUsername: false,
  trustEmail: false,
  displayName: "",
  domain: "",
  logoUrl: "",
  name: "",
};

export const featureFlagsSlice = createSlice({
  name: "featureflags",
  initialState,
  reducers: {
    // incrementByAmount: (state, action: PayloadAction<number>) => {
    //   state.value += action.payload;
    // },
  },
});

export default featureFlagsSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
// import { injectedRtkApi } from "store/apis/orgs";
// import { RootState } from "store";

// export const userSlice = createSlice({
//   name: "user",
//   initialState: { orgs: [] },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder.addMatcher(
//       injectedRtkApi.endpoints.getByRealmUsersAndUserIdOrgs.matchFulfilled,
//       (state, { payload }) => {
//         console.log("🚀 ~ file: slice.ts:22 ~ payload:", payload);

//         const orgIds = payload.map((org) => org.id);
//         // @ts-ignore
//         state.orgs = [...orgIds];
//       }
//     );
//   },
// });

// export default userSlice.reducer;

// export const selectFeatureFlags = (state: RootState) => state.featureFlags;

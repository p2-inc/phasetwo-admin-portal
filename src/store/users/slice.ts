import { createSlice } from "@reduxjs/toolkit";
import { injectedRtkApi } from "store/apis/orgs";
// import { RootState } from "store";
// import { emptySplitApi as api } from "store/apis/empty";
// import { useAppDispatch } from "store/hooks";
// import { config } from "config";
// import useUser from "components/utils/useUser";

// const { realm } = config.env;

export const userSlice = createSlice({
  name: "user",
  initialState: { orgs: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      injectedRtkApi.endpoints.getByRealmUsersAndUserIdOrgs.matchFulfilled,
      (state, { payload }) => {
        // const dispatch = useAppDispatch();

        console.log("🚀 ~ file: slice.ts:22 ~ payload:", payload);

        // const orgIds = payload.map((org) => org.id);

        // payload.map((org) => {
        //   const resp = dispatch(
        //     injectedRtkApi.endpoints.getByRealmUsersAndUserIdOrgsOrgIdRoles.initiate(
        //       {
        //         orgId: org.id!,
        //         realm,
        //         userId: user?.id!,
        //       }
        //     )
        //   );
        //   console.log("🚀 ~ file: slice.ts:36 ~ payload.map ~ resp:", resp);
        // });

        // @ts-ignore
        // state.orgs = [...orgIds];
      }
    );
  },
});

export default userSlice.reducer;

// export const selectFeatureFlags = (state: RootState) => state.featureFlags;

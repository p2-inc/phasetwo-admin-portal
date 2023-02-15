// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "config";
import { FeatureFlagsState } from "./slice";

// Define a service using a base URL and expected endpoints
export const featureFlagsApi = createApi({
  reducerPath: "featureFlagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: `${config.baseUrl}/${config.realm}` }),
  endpoints: (builder) => ({
    getFeatureFlags: builder.query<FeatureFlagsState, void>({
      query: () => `config.json`,
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetFeatureFlagsQuery } = featureFlagsApi;

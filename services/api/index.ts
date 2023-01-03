import axios from "axios";
import { useAppStore } from "store";

axios.interceptors.request.use(
  async (config) => {
    const token = useAppStore.getState().accessToken;

    if (token) {
      config.headers = {
        authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);

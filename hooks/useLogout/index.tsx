import { API_LOGOUT } from "appConstants";
import useAxios from "axios-hooks";
import { useCallback } from "react";
import { useAppStore } from "store";

const useLogout = () => {
  const { logout } = useAppStore();

  const [{ loading, error }, requestLogout] = useAxios(
    {
      url: API_LOGOUT,
      method: "post",
      withCredentials: true,
    },
    { manual: true }
  );

  const onLogout = useCallback(async () => {
    try {
      const result = await requestLogout();
      if (result.status === 200) {
        logout();
      }
    } catch (error) {
      console.error("Something went wrong: ", error);
    }
  }, [logout, requestLogout]);

  return { onLogout, logoutLoading: loading, logoutError: error };
};

export default useLogout;

import useAxios from "axios-hooks";
import { useCallback, useEffect } from "react";
import { API_LOGIN } from "appConstants";
import { useAppStore } from "store";
import { TSecureUser } from "types/user.type";

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  user: TSecureUser;
  accessToken: string;
}

const useLogin = () => {
  const { setAccessToken, setUser } = useAppStore();

  const [{ loading, error }, execute] = useAxios<ILoginResponse, ILoginRequest>(
    {
      url: API_LOGIN,
      method: "post",
    },
    { manual: true }
  );

  const onLogin = useCallback(
    async (reqData: ILoginRequest) => {
      console.log("reqData: ", reqData);

      try {
        const { data } = await execute({ data: reqData });
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    },
    [execute, setAccessToken, setUser]
  );

  return {
    onLogin,
    loginLoading: loading,
    loginError: error,
  };
};

export default useLogin;

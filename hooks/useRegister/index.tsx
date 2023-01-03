import useAxios from "axios-hooks";
import { API_REGISTER } from "appConstants";
import { useCallback, useEffect } from "react";
import { useAppStore } from "store";
import { TSecureUser } from "types/user.type";

export interface ISignUpRequest {
  email: string;
  password: string;
}

export interface ISignUpResponse {
  user: TSecureUser;
  accessToken: string;
}

const useSignup = () => {
  const { setAccessToken, setUser } = useAppStore();

  const [{ loading, error }, signUp] = useAxios<
    ISignUpResponse,
    ISignUpRequest
  >(
    {
      url: API_REGISTER,
      method: "post",
    },
    { manual: true }
  );

  const onSignup = useCallback(
    async (reqData: ISignUpRequest) => {
      try {
        const { data } = await signUp({ data: reqData });
        setAccessToken(data.accessToken);
        setUser(data.user);
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    },
    [setAccessToken, setUser, signUp]
  );

  return { onSignup, signUpLoading: loading, signUpError: error };
};

export default useSignup;

import { startAuthentication } from "@simplewebauthn/browser";
import {
  AuthenticationCredentialJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/typescript-types";
import useAxios from "axios-hooks";
import useWebAuthn from "hooks/useWebAuthn";
import { useCallback } from "react";
import { API_PASSKEY_LOGIN_OPTIONS, API_PASSKEY_LOGIN } from "appConstants";
import { TSecureUser } from "types/user.type";
import { useAppStore } from "store";

export interface IGetPasskeyLoginOptionsRequest {
  email: string;
}

export interface IVerifyPasskeyLoginOptionsRequest {
  email: string;
  credential: AuthenticationCredentialJSON;
}

export interface IVerifyPasskeyLoginResponse {
  user: TSecureUser;
  accessToken: string;
}

const usePasskeyLogin = () => {
  const { setAccessToken, setUser } = useAppStore();

  const [optionsResult, getPasskeyOptions] = useAxios<
    PublicKeyCredentialCreationOptionsJSON,
    { email: string }
  >(
    {
      url: API_PASSKEY_LOGIN_OPTIONS,
      method: "post",
    },
    { manual: true }
  );

  const [verifyResult, verifyLogin] = useAxios<
    IVerifyPasskeyLoginResponse,
    IVerifyPasskeyLoginOptionsRequest
  >(
    {
      url: API_PASSKEY_LOGIN,
      method: "post",
    },
    { manual: true }
  );

  const loginPasskey = useCallback(
    async (email: string) => {
      try {
        const options = await getPasskeyOptions({ data: { email } });

        const userLoginResult = await startAuthentication(options.data);

        const verifyReqData = {
          email,
          credential: userLoginResult,
        };

        const verificationResult = await verifyLogin({
          data: verifyReqData,
        });

        if (verificationResult.data.accessToken) {
          setAccessToken(verificationResult.data.accessToken);
          setUser(verificationResult.data.user);
        }
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    },
    [getPasskeyOptions, setAccessToken, setUser, verifyLogin]
  );

  return {
    loginPasskey,
    loading: optionsResult.loading || verifyResult.loading,
  };
};

export default usePasskeyLogin;

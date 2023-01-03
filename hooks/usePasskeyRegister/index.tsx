import { startRegistration } from "@simplewebauthn/browser";
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
} from "@simplewebauthn/typescript-types";
import {
  API_PASSKEY_REGISTER,
  API_PASSKEY_REGISTER_OPTIONS,
} from "appConstants";
import useAxios from "axios-hooks";
import { useCallback, useState } from "react";

export interface IVerificationResponse {
  verified: boolean;
}

const usePasskeyRegister = () => {
  const [registerVerified, setRegisterVerified] = useState<boolean>(false);

  const [optionsResult, getPasskeyOptions] = useAxios<
    PublicKeyCredentialCreationOptionsJSON,
    { email: string }
  >(
    {
      url: API_PASSKEY_REGISTER_OPTIONS,
      method: "post",
    },
    { manual: true }
  );

  const [verifyResult, veriftyOptions] = useAxios<
    IVerificationResponse,
    { email: string; credential: RegistrationCredentialJSON }
  >(
    {
      url: API_PASSKEY_REGISTER,
      method: "post",
    },
    { manual: true }
  );

  const registerPasskey = useCallback(
    async (email: string) => {
      try {
        const optionsResult = await getPasskeyOptions({
          data: { email },
        });
        if (optionsResult.data) {
          const userRegistrationResult: RegistrationCredentialJSON =
            await startRegistration(optionsResult.data);
          const verificationResult = await veriftyOptions({
            data: {
              email,
              credential: userRegistrationResult,
            },
          });
          setRegisterVerified(verificationResult.data.verified);
        }
      } catch (error) {
        console.error("Something went wrong: ", error);
      }
    },
    [getPasskeyOptions, veriftyOptions]
  );

  return {
    registerVerified,
    registerPasskey,
    loading: optionsResult.loading || verifyResult.loading,
  };
};

export default usePasskeyRegister;

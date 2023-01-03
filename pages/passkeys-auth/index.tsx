import Input from "components/input";
import InputContainer from "components/inputContainer";
import Label from "components/label";
import usePasskeyLogin from "hooks/usePasskeyLogin";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import Box from "components/box";
import Button from "components/button";
import { useEffect, useMemo } from "react";
import { useAppStore } from "store";
import useWebAuthn from "hooks/useWebAuthn";

interface IPasskeysFormInputs {
  email: string;
}

const StyledBox = styled(Box)`
  text-align: center;
  justify-content: space-between;
`;

const ButtonContainer = styled.div`
  justify-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IPasskeysFormInputs>({ mode: "all", reValidateMode: "onBlur" });
  const { push } = useRouter();

  const { setAppLoading } = useAppStore();

  const { hasWebAuthnAutofill } = useWebAuthn();

  const { loading, loginPasskey } = usePasskeyLogin();

  useEffect(() => {
    setAppLoading(loading);
  }, [loading, setAppLoading]);

  const onSubmit: SubmitHandler<IPasskeysFormInputs> = (data) => {
    loginPasskey(data.email);
  };

  const autoComplete = useMemo(() => {
    let result = ["username"];
    if (hasWebAuthnAutofill) {
      result.push("webauthn");
    }
    return result.join(" ");
  }, [hasWebAuthnAutofill]);

  return (
    <StyledBox>
      <div>
        <h1>Auth With Passkeys</h1>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            autoFocus={true}
            autoComplete={autoComplete}
            type="email"
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
          {errors.email && <span>Please Check your Email</span>}
        </InputContainer>

        <ButtonContainer>
          <Button type="submit">Log In with passkeys</Button>
          <Button type="button" onClick={() => push("/")}>
            home page
          </Button>
        </ButtonContainer>
      </form>
    </StyledBox>
  );
}

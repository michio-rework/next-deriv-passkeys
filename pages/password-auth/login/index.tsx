import Box from "components/box";
import Button from "components/button";
import Input from "components/input";
import InputContainer from "components/inputContainer";
import Label from "components/label";
import useLogin from "hooks/useLogin";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppStore } from "store";
import styled from "styled-components";

interface ISignUpFormInputs {
  email: string;
  password: string;
}

const StyledBox = styled(Box)`
  text-align: center;
  justify-content: space-between;
  min-width: 30%;
`;

const ButtonContainer = styled.div`
  justify-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

export default function PasswordLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormInputs>({ mode: "all", reValidateMode: "onBlur" });

  const { setAppLoading } = useAppStore();

  const { push } = useRouter();

  const { onLogin, loginLoading } = useLogin();

  useEffect(() => {
    setAppLoading(loginLoading);
  }, [loginLoading, setAppLoading]);

  const onSubmit: SubmitHandler<ISignUpFormInputs> = (data) => {
    onLogin(data);
  };

  return (
    <StyledBox>
      <div>
        <h2>Log In With Password</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <Label>Email</Label>
          <Input
            placeholder="Enter your email"
            type="email"
            {...register("email", {
              required: true,
              pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
          />
          {errors.email && <span>Please Check your Email</span>}
        </InputContainer>

        <InputContainer>
          <Label>Password</Label>
          <Input
            placeholder="Enter your password"
            type="password"
            {...register("password", { required: true, minLength: 1 })}
          />
          {errors.password && <span>Please Check your Password</span>}
        </InputContainer>
        <ButtonContainer>
          <Button type="submit">Log In with password</Button>
          <Button type="button" onClick={() => push("/password-auth/signup")}>
            Sign Up Page
          </Button>
          <Button type="button" onClick={() => push("/")}>
            home page
          </Button>
        </ButtonContainer>
      </form>
    </StyledBox>
  );
}

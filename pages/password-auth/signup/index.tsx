import useLogout from "hooks/useLogout";
import useSignup from "hooks/useRegister";
import Link from "next/link";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import useLogin from "hooks/useLogin";
import { useAppStore } from "store";
import styled from "styled-components";
import Box from "components/box";
import { SubmitHandler, useForm } from "react-hook-form";
import Label from "components/label";
import InputContainer from "components/inputContainer";
import Input from "components/input";
import Button from "components/button";
import { useRouter } from "next/router";

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

export default function PasswordSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignUpFormInputs>({ mode: "all", reValidateMode: "onBlur" });

  const { push } = useRouter();

  const { onSignup } = useSignup();

  const onSubmit: SubmitHandler<ISignUpFormInputs> = (data) => {
    onSignup(data);
  };

  return (
    <StyledBox>
      <div>
        <h2>Sign Up With Password</h2>
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
          <Button type="submit">Sign Up with password</Button>
          <Button type="button" onClick={() => push("/password-auth/login")}>
            Login Page
          </Button>
          <Button type="button" onClick={() => push("/")}>
            Home Page
          </Button>
        </ButtonContainer>
      </form>
    </StyledBox>
  );
}

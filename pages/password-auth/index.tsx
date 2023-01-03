import useLogout from "hooks/useLogout";
import useSignup from "hooks/useRegister";
import Link from "next/link";
import { MouseEventHandler, useCallback, useEffect, useState } from "react";
import useLogin from "hooks/useLogin";
import { useAppStore } from "store";
import styled from "styled-components";
import Box from "components/box";
import { useForm } from "react-hook-form";
import Label from "components/label";
import InputContainer from "components/inputContainer";
import Input from "components/input";
import Button from "components/button";
import { useRouter } from "next/router";

interface ILoginFormInputs {
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
  width: 70%;
`;

export default function Home() {
  const { push } = useRouter();

  return (
    <StyledBox>
      <div>
        <h2>Auth With Password</h2>
      </div>

      <ButtonContainer>
        <Button type="button" onClick={() => push("/password-auth/login")}>
          Log In
        </Button>
        <Button type="button" onClick={() => push("/password-auth/signup")}>
          Sign Up
        </Button>
        <Button type="button" onClick={() => push("/")}>
          Back Home
        </Button>
      </ButtonContainer>
    </StyledBox>
  );
}

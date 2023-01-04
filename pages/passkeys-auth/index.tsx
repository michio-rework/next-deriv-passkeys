import Box from "components/box";
import Button from "components/button";
import { useRouter } from "next/router";
import styled from "styled-components";

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
  const { push } = useRouter();

  return (
    <StyledBox>
      <div>
        <h1>Auth With Passkeys</h1>
      </div>
      <ButtonContainer>
        <Button type="button" onClick={() => push("/passkeys-auth/login")}>
          Login with Passkeys
        </Button>
        <Button type="button" onClick={() => push("/passkeys-auth/signup")}>
          Singup with passkeys
        </Button>
        <Button type="button" onClick={() => push("/")}>
          home page
        </Button>
      </ButtonContainer>
    </StyledBox>
  );
}

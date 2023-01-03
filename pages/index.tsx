import { useRouter } from "next/router";
import styled from "styled-components";
import Box from "components/box";
import Button from "components/button";
import useWebAuthn from "hooks/useWebAuthn";

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
  width: 70%;
`;

export default function Home() {
  const { hasWebAuthnSupport } = useWebAuthn();

  const router = useRouter();

  return (
    <StyledBox>
      <div>
        <h1>Passkeys POC</h1>
        {hasWebAuthnSupport && <h3>Your Device Has Webauthn Support!</h3>}
        {hasWebAuthnSupport ? (
          <p>
            You can either login / register as with <strong>Password</strong>{" "}
            and with <strong>Passkeys</strong>
          </p>
        ) : (
          <p>
            You can only login / register with <strong>Password</strong>
          </p>
        )}
      </div>
      <ButtonContainer>
        <Button onClick={() => router.push("/password")}>Password Flow</Button>
        <Button onClick={() => router.push("/passkeys")}>Passkeys Flow</Button>
      </ButtonContainer>
    </StyledBox>
  );
}

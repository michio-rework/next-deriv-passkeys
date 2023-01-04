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
        {hasWebAuthnSupport && <h3>Your Device Has WebAuthn Support!</h3>}
        {hasWebAuthnSupport ? (
          <p>
            You can either login / register as with <strong>Password</strong> or
            with <strong>Passkeys</strong>
          </p>
        ) : (
          <p>
            You can only login / register with <strong>Password</strong>
          </p>
        )}
      </div>
      <div>
        <p>
          With passkeys flow you only need to know your{" "}
          <strong>email ( as username )</strong>, if you want you can create an
          account with <strong>password flow</strong> and then add new passkeys
          to your account
        </p>
      </div>
      <p>
        <strong>Note: </strong> On Mac devices if you add / create passkey
        authenticators, it only works on your browser. so for every browser you
        have to add a new passkey.
      </p>
      <p>
        <strong>Note: </strong> Firefox browser does not support the passkeys
        feature, but you can use YubiKey for authenitcaiton and authorization.
      </p>
      <ButtonContainer>
        <Button onClick={() => router.push("/password-auth")}>
          Password Flow
        </Button>
        {hasWebAuthnSupport && (
          <Button onClick={() => router.push("/passkeys-auth")}>
            Passkeys Flow
          </Button>
        )}
      </ButtonContainer>
    </StyledBox>
  );
}

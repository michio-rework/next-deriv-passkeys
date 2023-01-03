import styled from "styled-components";
import Box from "../../components/box";
import Button from "../../components/button";

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
  return (
    <StyledBox>
      <div>
        <h1>Auth With Password</h1>
      </div>
      <ButtonContainer>
        <Button>Password Flow</Button>
        <Button>Passkeys Flow</Button>
      </ButtonContainer>
    </StyledBox>
  );
}

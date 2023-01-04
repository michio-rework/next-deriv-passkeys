import Box from "components/box";
import Button from "components/button";
import Table from "components/table";
import useLogout from "hooks/useLogout";
import usePasskeyRegister from "hooks/usePasskeyRegister";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppStore } from "store";
import styled from "styled-components";

const StyledBox = styled(Box)`
  text-align: center;
  justify-content: space-between;
  min-width: 60%;
`;
const ButtonContainer = styled.div`
  justify-self: flex-end;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledTable = styled(Table)`
  min-width: 480px;
`;
const Dashboard = () => {
  const { accessToken, user, setAppLoading } = useAppStore();
  const { onLogout } = useLogout();
  const router = useRouter();

  const { registerPasskey, registerVerified, loading } = usePasskeyRegister();

  useEffect(() => {
    setAppLoading(loading);
  }, [loading, setAppLoading]);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  const data = user.authenticators?.map((item) => ({
    loginCount: String(item.counter),
    transports: item.transports?.join(", "),
    deviceType: item.credentialDeviceType,
  }));

  return (
    <StyledBox>
      <h1>Dashboard</h1>

      {data?.length && <StyledTable data={data} />}

      <p>
        If you dont want to use YubiKey please remove it from your device first
        before adding new passkey
      </p>

      <ButtonContainer>
        <Button onClick={() => registerPasskey(user.email)}>
          Add New Passkey
        </Button>
        <Button onClick={() => onLogout()}>Log Out</Button>
      </ButtonContainer>
    </StyledBox>
  );
};

export default Dashboard;

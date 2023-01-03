import Box from "components/box";
import Button from "components/button";
import useLogout from "hooks/useLogout";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAppStore } from "store";
import styled from "styled-components";

const StyledBox = styled(Box)`
  text-align: center;
  justify-content: space-between;
`;

const Dashboard = () => {
  const { accessToken } = useAppStore();
  const { onLogout } = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.replace("/");
    }
  }, [accessToken, router]);

  return (
    <StyledBox>
      <div>
        <h1>Dashboard</h1>

        <Button onClick={() => onLogout()}>Log Out</Button>
      </div>
    </StyledBox>
  );
};

export default Dashboard;

import { useRouter } from "next/router";
import styled from "styled-components";
import Box from "components/box";
import Button from "components/button";
import useWebAuthn from "hooks/useWebAuthn";
import { useAppStore } from "store";
import { useEffect } from "react";
import useLogout from "hooks/useLogout";

const StyledBox = styled(Box)`
  text-align: center;
  justify-content: space-between;
`;

export default function Dashboard() {
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
}

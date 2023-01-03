import { RouletteSpinner } from "react-spinner-overlay";
import styled from "styled-components";

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.7);
`;

interface ILoading {
  loading: boolean;
}

const Loading = ({ loading }: ILoading) => {
  if (loading) {
    return (
      <LoadingContainer>
        <RouletteSpinner loading={true} />
      </LoadingContainer>
    );
  }
  return null;
};

export default Loading;

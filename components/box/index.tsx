import styled from "styled-components";

const Box = styled.div`
  background-color: white;
  border-radius: 2rem;
  padding: 2rem;
  flex-direction: column;
  display: flex;
  justify-content: flex-start;
  align-items: center;

  @media screen and (max-width: 640px) {
    width: 100%;
    height: 100%;
  }
  min-height: 640px;
`;

export default Box;

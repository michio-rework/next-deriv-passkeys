import styled from "styled-components";

const Button = styled.button`
  border-radius: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  color: white;
  font-weight: 700;
  min-width: 16rem;
  background: rgb(34, 193, 195);
  background: linear-gradient(
    90deg,
    rgba(34, 193, 195, 1) 0%,
    rgba(253, 187, 45, 1) 100%
  );
  border: 0px;
  cursor: pointer;
  margin: 1rem 0;
  transition: opacity 0.25s ease-out;
`;

export default Button;

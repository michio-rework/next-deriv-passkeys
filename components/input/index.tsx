import styled from "styled-components";

const Input = styled.input`
  box-sizing: border-box;
  border: none;
  font-size: 1.3rem;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  box-shadow: inset 0px -3px 0px 0px rgba(187, 187, 187, 0.2);
  transition: box-shadow 0.2s ease-in;
  &::-webkit-input-placeholder {
    opacity: 1;
    transition: opacity 0.25s ease-out;
  }

  background: transparent !important;
  &:hover::-webkit-input-placeholder,
  &:focus::-webkit-input-placeholder {
    opacity: 0;
  }

  &:focus {
    box-shadow: inset 0px -3px 0px 0px rgba(34, 193, 195, 0.7);
    outline: none;
  }
`;

export default Input;

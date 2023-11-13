import styled from "styled-components";

export const Container = styled.ul`
  margin-top: 20px;

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #444;

    & + li {
      margin-top: 15px;
    }
  }
`;

export const FileInfo = styled.div`
  display: flex;
  align-items: center;

  div {
    display: flex;
    flex-direction: column;

    span {
      font-size: 12px;
      color: #999;
      margin-top: 5px;

      button {
        border: 0;
        background: transparent;
        color: #e57878;
        margin-left: 5px;
        cursor: pointer;
      }
    }

    strong {
      font-size: 14px;

      /* exibir apenas os 10 primeiros caracteres do nome do arquivo , os caracteres extras serão substituídos por "..." graças às propriedades text-overflow: ellipsis e white-space: nowrap.*/
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 105px; /* Ajuste conforme necessário */
    }
  }
`;

export const Preview = styled.div`
  width: 56px;    /* Ajuste conforme necessário o tamanho das imagens */
  height: 56px;
  border-radius: 5px;
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50% 50%;
  margin-right: 10px;
`;

export const DeleteButton = styled.button`
  background-color: #e57878;
  color: white;
  border: 0;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ca6161;
    color: white;
  }

  &:active {
    background-color: #a14343;
  }
`;
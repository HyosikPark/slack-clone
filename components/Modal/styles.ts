import styled from '@emotion/styled';

export const CreateModal = styled.div`
  position: fixed;
  text-align: center;
  top: 50%;
  left: 50%;
  transform: translate(-25%, -50%);
  width: 440px;
  background: white;
  --saf-0: rgba(var(--sk_foreground_low, 29, 28, 29), 0.13);
  box-shadow: 0 0 0 1px var(--saf-0), 0 4px 12px 0 rgba(0, 0, 0, 0.12);
  background-color: rgba(var(--sk_foreground_min_solid, 248, 248, 248), 1);
  border-radius: 6px;
  user-select: none;
  max-width: 440px;
  padding: 30px 40px 0;
  z-index: 1012;
`;

export const CloseModalButton = styled.button`
  position: absolute;
  right: 10px;
  top: 6px;
  background: transparent;
  border: none;
  font-size: 30px;
  cursor: pointer;
`;

import { ModalProps } from '@typings/db';
import React, { useCallback } from 'react';
import { CreateModal } from './styles';

function Modal({ children, show }: ModalProps) {
  const removeBubbling = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) return null;

  return (
    <CreateModal data-testid="modal" onClick={removeBubbling}>
      {children}
    </CreateModal>
  );
}

export default React.memo(Modal);

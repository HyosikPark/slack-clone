import React, { useCallback, useRef } from 'react';
import Modal from '@components/Modal/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { toast } from 'react-toastify';
import axios from 'axios';
import { trigger } from 'swr';
import { SubmitModalProps } from '@typings/db';

function CreateWorkspaceModal({ show, onCloseModal }: SubmitModalProps) {
  const nameInput = useRef<HTMLInputElement>(null);
  const urlInput = useRef<HTMLInputElement>(null);

  const onCreateWorkspace = useCallback(
    (e) => {
      e.preventDefault();

      if (!nameInput.current?.value.trim()) return;
      if (!urlInput.current?.value.trim()) return;

      axios
        .post(
          '/api/workspaces',
          {
            workspace: nameInput.current?.value,
            url: urlInput.current?.value,
          },
          { withCredentials: true },
        )
        .then(() => {
          trigger('/api/users');
          onCloseModal();
        })
        .catch((err) => {
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [onCloseModal],
  );

  return (
    <Modal show={show}>
      <form onSubmit={onCreateWorkspace}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" ref={nameInput} />
        </Label>
        <Label id="workspace-url-label">
          <span>워크스페이스 url</span>
          <Input id="workspace" ref={urlInput} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}

export default React.memo(CreateWorkspaceModal);

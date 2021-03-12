import Modal from '@components/Modal/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import axios from 'axios';
import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import { trigger } from 'swr';
import { SubmitModalProps } from '@typings/db';

function CreateChannelModal({ show, onCloseModal }: SubmitModalProps) {
  const input = useRef<HTMLInputElement>(null);

  const { workspace } = useParams<{ workspace: string }>();

  const onCreateChannel = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.current?.value.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/channels`,
          {
            name: input.current?.value,
          },
          { withCredentials: true },
        )
        .then(() => {
          trigger(`/api/workspaces/${workspace}/channels`);
          onCloseModal();
        })
        .catch((err) => {
          console.dir(err);
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [onCloseModal, workspace],
  );

  return (
    <Modal show={show}>
      <form onSubmit={onCreateChannel}>
        <Label id="workspace-label">
          <span>워크스페이스 이름</span>
          <Input id="workspace" ref={input} />
        </Label>
        <Button type="submit">생성하기</Button>
      </form>
    </Modal>
  );
}

export default React.memo(CreateChannelModal);

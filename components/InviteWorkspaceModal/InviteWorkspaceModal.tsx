import Modal from '@components/Modal/Modal';
import { Button, Input, Label } from '@pages/SignUp/styles';
import { SubmitModalProps } from '@typings/db';
import axios from 'axios';
import React, { useCallback, useRef } from 'react';
import { useParams } from 'react-router';
import { trigger } from 'swr';
import { toast } from 'react-toastify';

function InviteWorkspaceModal({ show, onCloseModal }: SubmitModalProps) {
  const { workspace } = useParams<{ workspace: string }>();
  const input = useRef<HTMLInputElement>(null);

  const onInviteMember = useCallback(
    (e) => {
      e.preventDefault();
      if (!input.current?.value.trim()) return;

      axios
        .post(
          `/api/workspaces/${workspace}/members`,
          {
            email: input.current.value,
          },
          { withCredentials: true },
        )
        .then(() => {
          trigger(`/api/workspaces/${workspace}/members`);
          onCloseModal();
        })
        .catch((err) => {
          toast.error(err.response?.data, { position: 'bottom-center' });
        });
    },
    [onCloseModal, workspace],
  );

  return (
    <Modal show={show}>
      <form onSubmit={onInviteMember}>
        <Label id="member-label">
          <span>이메일</span>
          <Input id="member" type="email" ref={input} />
        </Label>
        <Button type="submit">초대하기</Button>
      </form>
    </Modal>
  );
}

export default React.memo(InviteWorkspaceModal);

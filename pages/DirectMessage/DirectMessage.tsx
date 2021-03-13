import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import useSWR, { useSWRInfinite } from 'swr';
import { fetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatList from '@components/ChatList/ChatList';
import ChatBox from '@components/ChatBox/ChatBox';
import axios from 'axios';
import { IDM } from '@typings/db';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import { toast } from 'react-toastify';
import { PER_PAGE } from '@pages/Channel/Channel';

function DirectMessage() {
  const { workspace, id } = useParams<{ workspace: string; id: string }>();

  const { data: userData } = useSWR(`/api/workspaces/${workspace}/users/${id}`, fetcher);
  const { data: myData } = useSWR(`/api/users`, fetcher);
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IDM[]>(
    (index) => `/api/workspaces/${workspace}/dms/${id}/chats?perPage=${PER_PAGE}&page=${index + 1}`,
    fetcher,
  );
  const [chat, setChat] = useState('');
  const [socket] = useSocket(workspace);
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < PER_PAGE) || false;

  const onChangeChat = useCallback((e) => {
    setChat(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!chat.trim() || !chatData) return;

      const savedChat = chat;

      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          SenderId: myData.id,
          Sender: myData,
          ReceiverId: userData.id,
          Receiver: userData,
          createdAt: new Date(),
        });

        return prevChatData;
      }, false).then(() => {
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      });

      axios
        .post(`/api/workspaces/${workspace}/dms/${id}/chats`, {
          content: chat,
        })
        .catch((err) => console.log(err));
    },
    [chat, chatData, id, mutateChat, myData, userData, workspace],
  );

  const onMessage = useCallback(
    (data: IDM) => {
      // 두번의 mutateChat 방지하기 위해 내 데이터인 경우 배제;
      if (data.SenderId === Number(id) && myData.id !== Number(id)) {
        mutateChat((chatData) => {
          chatData?.[0].unshift(data);
          return chatData;
        }, false).then(() => {
          revalidate();
          if (scrollbarRef.current) {
            if (
              scrollbarRef.current.getScrollHeight() <
              scrollbarRef.current.getClientHeight() + scrollbarRef.current.getScrollTop() + 150
            ) {
              console.log('scrollToBottom!', scrollbarRef.current?.getValues());
              scrollbarRef.current.scrollToBottom();
            } else {
              toast.success('새 메시지가 도착했습니다.', {
                onClick() {
                  scrollbarRef.current?.scrollToBottom();
                },
                closeOnClick: true,
              });
            }
          }
        });
      }
    },
    [id, mutateChat, myData.id, revalidate],
  );

  useEffect(() => {
    socket?.on('dm', onMessage);

    return () => {
      socket?.off('dm', onMessage);
    };
  }, [onMessage, revalidate, socket]);

  useEffect(() => {
    if (chatData?.length === 1 && scrollbarRef.current) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!userData || !myData || !chatData) return null;

  const chatSections = makeSection(chatData.flat().reverse());

  return (
    <Container>
      <Header>
        <img src={gravatar.url(userData.nickname, { s: '24px', d: 'retro' })} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList
        chatSections={chatSections}
        scrollbarRef={scrollbarRef}
        setSize={setSize}
        isReachingEnd={isReachingEnd}
      />
      <ChatBox
        placeholder={`Message ${userData.nickname}`}
        chat={chat}
        onSubmitForm={onSubmitForm}
        onChangeChat={onChangeChat}
      />
    </Container>
  );
}

export default React.memo(DirectMessage);

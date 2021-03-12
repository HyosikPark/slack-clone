import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Container, Header } from './styles';
import useSWR, { useSWRInfinite } from 'swr';
import { fetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import ChatList from '@components/ChatList/ChatList';
import ChatBox from '@components/ChatBox/ChatBox';
import axios from 'axios';
import { IChannel, IChat, IUser } from '@typings/db';
import makeSection from '@utils/makeSection';
import { Scrollbars } from 'react-custom-scrollbars';
import useSocket from '@hooks/useSocket';
import { toast, ToastContainer } from 'react-toastify';
import InviteChannelModal from '@components/InviteChannelModal/InviteChannelModal';

interface ChannelProps {
  onOpenModal: (e: any) => void;
  onCloseModal: () => void;
  show: boolean;
}

function Channel({ onOpenModal, show, onCloseModal }: ChannelProps) {
  const { workspace, channel } = useParams<{ workspace: string; channel: string }>();

  const { data: myData } = useSWR(`/api/users`, fetcher);
  const { data: channelData } = useSWR<IChannel>(`/api/workspaces/${workspace}/channels/${channel}`, fetcher);
  const { data: chatData, mutate: mutateChat, revalidate, setSize } = useSWRInfinite<IChat[]>(
    (index) => `/api/workspaces/${workspace}/channels/${channel}/chats?perPage=20&page=${index + 1}`,
    fetcher,
  );
  const { data: channelMembersData } = useSWR<IUser[]>(
    myData ? `/api/workspaces/${workspace}/channels/${channel}/members` : null,
  );

  const [chat, setChat] = useState('');
  const [socket] = useSocket(workspace);
  const scrollbarRef = useRef<Scrollbars>(null);

  const isEmpty = chatData?.[0]?.length === 0;
  const isReachingEnd = isEmpty || (chatData && chatData[chatData.length - 1]?.length < 20) || false;

  const onChangeChat = useCallback((e) => {
    setChat(e.target.value);
  }, []);

  const onSubmitForm = useCallback(
    (e) => {
      e.preventDefault();
      if (!chat.trim() || !chatData || !channelData) return;

      const savedChat = chat;

      mutateChat((prevChatData) => {
        prevChatData?.[0].unshift({
          id: (chatData[0][0]?.id || 0) + 1,
          content: savedChat,
          UserId: myData.id,
          User: myData,
          ChannelId: channelData.id,
          Channel: channelData,
          createdAt: new Date(),
        });

        return prevChatData;
      }, false).then(() => {
        setChat('');
        scrollbarRef.current?.scrollToBottom();
      });

      axios
        .post(`/api/workspaces/${workspace}/channels/${channel}/chats`, {
          content: chat,
        })
        .then(() => revalidate())
        .catch((err) => console.log(err));
    },
    [channel, channelData, chat, chatData, mutateChat, myData, revalidate, workspace],
  );

  const onMessage = useCallback(
    (data: IChat) => {
      // 두번의 mutateChat 방지하기 위해 내 데이터인 경우 배제;
      if (data.Channel.name === channel && data.UserId !== myData?.id) {
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
    [channel, mutateChat, myData?.id, revalidate],
  );

  useEffect(() => {
    socket?.on('message', onMessage);

    return () => {
      socket?.off('message', onMessage);
    };
  }, [onMessage, socket]);

  useEffect(() => {
    if (chatData?.length === 1 && scrollbarRef.current) {
      scrollbarRef.current?.scrollToBottom();
    }
  }, [chatData]);

  if (!myData || !chatData) return null;

  const chatSections = makeSection(chatData.flat().reverse());

  return (
    <Container>
      <Header>
        <span>#{channel}</span>
        <div className="header-right">
          <span>{channelMembersData?.length}</span>
          <button
            id="open-ic-btn"
            onClick={onOpenModal}
            className="c-button-unstyled p-ia__view_header__button"
            aria-label="Add people to #react-native"
            data-sk="tooltip_parent"
            type="button"
          >
            <i className="c-icon p-ia__view_header__button_icon c-icon--add-user" aria-hidden="true" />
          </button>
        </div>
      </Header>
      <ChatList
        scrollbarRef={scrollbarRef}
        isReachingEnd={isReachingEnd}
        chatSections={chatSections}
        setSize={setSize}
      />
      <ChatBox
        onSubmitForm={onSubmitForm}
        chat={chat}
        onChangeChat={onChangeChat}
        placeholder={`Message #${channel}`}
      />
      <InviteChannelModal show={show} onCloseModal={onCloseModal} />
      <ToastContainer position="bottom-center" />
    </Container>
  );
}

export default React.memo(Channel);

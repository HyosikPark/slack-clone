import { IChat, IDM } from '@typings/db';
import React, { RefObject, useCallback } from 'react';
import { ChatZone, Section, StickyHeader } from './styles';
import Chat from '@components/Chat/Chat';
import { Scrollbars } from 'react-custom-scrollbars';

interface ChatListProps {
  chatSections: { [key: string]: (IDM | IChat)[] };
  scrollbarRef: RefObject<Scrollbars>;
  setSize: (size: number | ((size: number) => number)) => Promise<(IDM | IChat)[][] | undefined>;
  isReachingEnd: boolean;
}

function ChatList({ chatSections, scrollbarRef, setSize, isReachingEnd }: ChatListProps) {
  const onScroll = useCallback(
    (values) => {
      if (values.scrollTop === 0 && !isReachingEnd) {
        console.log('가장 위');
        setSize((prevSize) => prevSize + 1).then(() => {
          //스크롤 위치 유지
          scrollbarRef.current?.scrollTop(scrollbarRef.current?.getScrollHeight() - values.scrollHeight);
        });
      }
    },
    [isReachingEnd, scrollbarRef, setSize],
  );

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollbarRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date, chats]) => {
          return (
            <Section className={`section-${date}`} key={date}>
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
              {chats.map((chat) => (
                <Chat key={chat.id} data={chat}></Chat>
              ))}
            </Section>
          );
        })}
      </Scrollbars>
    </ChatZone>
  );
}

export default React.memo(ChatList);

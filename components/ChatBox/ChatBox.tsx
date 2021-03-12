import React, { useCallback, useEffect, useRef } from 'react';
import { ChatArea, EachMention, Form, MentionsTextarea, SendButton, Toolbox } from './styles';
import { Mention, SuggestionDataItem } from 'react-mentions';
import useSWR from 'swr';
import { IUser } from '@typings/db';
import { fetcher } from '@utils/fetcher';
import { useParams } from 'react-router';
import gravatar from 'gravatar';
import autosize from 'autosize';

interface ChatBoxprops {
  chat: string;
  onSubmitForm: (e: any) => void;
  onChangeChat: (e: any) => void;
  placeholder: string;
}

function ChatBox({ chat, onSubmitForm, onChangeChat, placeholder }: ChatBoxprops) {
  const { workspace } = useParams<{ workspace: string }>();
  const { data: memberData } = useSWR<IUser[]>(`/api/workspaces/${workspace}/members`, fetcher);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const onKeyPressChat = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        onSubmitForm(e);
      }
    },
    [onSubmitForm],
  );

  const renderSuggestion = useCallback(
    (
      suggestion: SuggestionDataItem,
      search: string,
      highlightedDisplay: React.ReactNode,
      index: number,
      focus: boolean,
    ): React.ReactNode => {
      if (!memberData) return null;

      return (
        <EachMention focus={focus}>
          <img
            src={gravatar.url(memberData[index].email, { s: '20px', d: 'retro' })}
            alt={memberData[index].nickname}
          />
          <span>{highlightedDisplay}</span>
        </EachMention>
      );
    },
    [memberData],
  );

  useEffect(() => {
    if (textareaRef.current) {
      autosize(textareaRef.current);
    }
  }, []);

  return (
    <ChatArea>
      <Form onSubmit={onSubmitForm}>
        <MentionsTextarea
          id="editor-chat"
          value={chat}
          onKeyPress={onKeyPressChat}
          onChange={onChangeChat}
          inputRef={textareaRef}
          placeholder={placeholder}
          allowSuggestionsAboveCursor
        >
          <Mention
            appendSpaceOnAdd
            trigger="@"
            data={memberData?.map((v) => ({ id: v.id, display: v.nickname })) || []}
            renderSuggestion={renderSuggestion}
          />
        </MentionsTextarea>
        <Toolbox>
          <SendButton
            className={
              'c-button-unstyled c-icon_button c-icon_button--light c-icon_button--size_medium c-texty_input__button c-texty_input__button--send' +
              (chat?.trim() ? '' : ' c-texty_input__button--disabled')
            }
            data-qa="texty_send_button"
            aria-label="Send message"
            data-sk="tooltip_parent"
            type="submit"
            disabled={!chat.trim()}
          >
            <i className="c-icon c-icon--paperplane-filled" area-hidden="true" />
          </SendButton>
        </Toolbox>
      </Form>
    </ChatArea>
  );
}

export default React.memo(ChatBox);

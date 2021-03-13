import React, { useCallback, useEffect, useState } from 'react';
import { Redirect, Route, Switch, useParams } from 'react-router';
import { fetcher } from '@utils/fetcher';
import axios from 'axios';
import useSWR from 'swr';
import {
  AddButton,
  Channels,
  Chats,
  Header,
  LogOutButton,
  MenuScroll,
  ProfileImg,
  ProfileModal,
  RightMenu,
  WorkspaceButton,
  WorkspaceModal,
  WorkspaceName,
  Workspaces,
  WorkspaceWrapper,
} from './styles';
import gravatar from 'gravatar';
import loadable from '@loadable/component';
import Menu from '@components/Menu/Menu';
import { Link } from 'react-router-dom';
import { IUser } from '@typings/db';
import CreateChannelModal from '@components/CreateChannelModal/CreateChannelModal';
import CreateWorkspaceModal from '@components/CreateWorkspaceModal/CreateWorkspaceModal';
import InviteWorkspaceModal from '@components/InviteWorkspaceModal/InviteWorkspaceModal';
import ChannelList from '@components/ChannelList/ChannelList';
import DMList from '@components/DMList/DMList';
import useSocket from '@hooks/useSocket';

const Channel = loadable(() => import('@pages/Channel/Channel'));
const DirectMessage = loadable(() => import('@pages/DirectMessage/DirectMessage'));

function Workspace() {
  const { workspace } = useParams<{ workspace: string }>();
  const [socket, disconnectSocket] = useSocket(workspace);

  const { data: userData, mutate } = useSWR<IUser | false>('/api/users', fetcher);
  const { data: channelData } = useSWR<IUser[]>(userData ? `/api/workspaces/${workspace}/channels` : null, fetcher);

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showCreateChannelModal, setShowCreateChannelModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [showInviteWorkspaceModal, setShowInviteWorkspaceModal] = useState(false);
  const [showInviteChannelModal, setShowInviteChannelModal] = useState(false);

  useEffect(() => {
    if (channelData && userData && socket) {
      socket.emit('login', { id: userData.id, channels: channelData.map((v) => v.id) });
    }
  }, [channelData, socket, userData]);

  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const onLogout = useCallback(() => {
    axios.post('/api/users/logout', null, { withCredentials: true }).then(() => mutate(false, false));
  }, [mutate]);

  const onOpenModalAndMenu = useCallback((e) => {
    const id = e.target.id;
    if (id === 'open-ic-btn') return setShowInviteChannelModal(true);
    if (id === 'open-iws-btn') return setShowInviteWorkspaceModal(true);
    if (id === 'user-profile') return setShowUserMenu(true);
    if (id === 'open-ws-btn') return setShowWorkspaceModal(true);
    if (id === 'open-cws-btn') return setShowCreateWorkspaceModal(true);
    if (id === 'open-cc-btn') return setShowCreateChannelModal(true);
  }, []);

  const onCloseModalAndMenu = useCallback(() => {
    if (showInviteChannelModal) return setShowInviteChannelModal(false);
    if (showInviteWorkspaceModal) return setShowInviteWorkspaceModal(false);
    if (showCreateWorkspaceModal) return setShowCreateWorkspaceModal(false);
    if (showCreateChannelModal) return setShowCreateChannelModal(false);
    if (showUserMenu) return setShowUserMenu(false);
    if (showWorkspaceModal) return setShowWorkspaceModal(false);
  }, [
    showInviteChannelModal,
    showInviteWorkspaceModal,
    showCreateWorkspaceModal,
    showCreateChannelModal,
    showUserMenu,
    showWorkspaceModal,
  ]);

  if (userData === undefined) return null;
  if (userData === false) return <Redirect to="/login" />;

  return (
    <div data-testid="workspace-container" className="workspace-container" onClick={onCloseModalAndMenu}>
      <Header>
        <RightMenu>
          <ProfileImg
            id="user-profile"
            data-testid="user-profile"
            onClick={onOpenModalAndMenu}
            src={gravatar.url(userData.nickname, { s: '20px', d: 'retro' })}
            alt={userData.nickname}
          />
          <Menu style={{ right: 0, top: 38 }} show={showUserMenu}>
            <ProfileModal>
              <img src={gravatar.url(userData.nickname, { s: '20px', d: 'retro' })} alt={userData.nickname} />
              <div>
                <span id="profile-name">{userData.nickname}</span>
                <span id="profile-active">Active</span>
              </div>
            </ProfileModal>
            <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
          </Menu>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {userData?.Workspaces?.map((ws) => (
            <Link key={ws.id} to={`/workspace/${ws.url}/channel/일반`}>
              <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
            </Link>
          ))}
          <AddButton id="open-cws-btn" onClick={onOpenModalAndMenu}>
            +
          </AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName id="open-ws-btn" onClick={onOpenModalAndMenu}>
            {userData?.Workspaces?.find((item) => item.url === workspace)?.name}
          </WorkspaceName>
          <MenuScroll>
            <Menu show={showWorkspaceModal} style={{ top: 95, left: 80 }}>
              <WorkspaceModal>
                <h2>{userData?.Workspaces?.find((item) => item.url === workspace)?.name}</h2>
                <button id="open-iws-btn" onClick={onOpenModalAndMenu}>
                  워크스페이스에 사용자 초대
                </button>
                <button id="open-cc-btn" onClick={onOpenModalAndMenu}>
                  채널 만들기
                </button>
                <button onClick={onLogout}>로그아웃</button>
              </WorkspaceModal>
            </Menu>
            {/* channelList Component */}
            <ChannelList />
            {/* DMList Component */}
            <DMList />
          </MenuScroll>
        </Channels>
        <Chats>
          <Switch>
            <Route
              path="/workspace/:workspace/channel/:channel"
              render={() => (
                <Channel
                  show={showInviteChannelModal}
                  onCloseModal={onCloseModalAndMenu}
                  onOpenModal={onOpenModalAndMenu}
                />
              )}
            />
            <Route path="/workspace/:workspace/dm/:id" component={DirectMessage} />
          </Switch>
        </Chats>
      </WorkspaceWrapper>
      <CreateWorkspaceModal show={showCreateWorkspaceModal} onCloseModal={onCloseModalAndMenu} />
      <CreateChannelModal show={showCreateChannelModal} onCloseModal={onCloseModalAndMenu} />
      <InviteWorkspaceModal show={showInviteWorkspaceModal} onCloseModal={onCloseModalAndMenu} />
    </div>
  );
}

export default React.memo(Workspace);

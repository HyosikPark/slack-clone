import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router';
import useSWR from 'swr';
import Workspace from './Workspace';
import { act } from 'react-dom/test-utils';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSWR = useSWR as jest.Mock;

jest.mock('axios');
jest.mock('swr');

describe('Workspace Toggle Modal And Menu Test', () => {
  beforeEach(() => {
    mockedSWR.mockReturnValue({ data: true, mutate: null });

    render(
      <MemoryRouter>
        <Workspace />
      </MemoryRouter>,
    );
    jest.clearAllMocks();
  });

  it('Toggle UserProfile Menu', () => {
    const profileImg = screen.getByTestId('user-profile');
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();

    fireEvent.click(profileImg);
    expect(screen.queryByTestId('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('workspace-container'));
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('Toggle CreateWorkspace Modal', () => {
    const addBtn = screen.getByText('+');
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(screen.queryByTestId('modal')).toBeInTheDocument();

    (screen.getByLabelText('워크스페이스 이름') as HTMLInputElement).value = 'test';
    (screen.getByLabelText('워크스페이스 url') as HTMLInputElement).value = 'test';

    fireEvent.click(screen.getByTestId('workspace-container'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    fireEvent.click(addBtn);
    expect(screen.queryByTestId('modal')).toBeInTheDocument();

    expect(screen.getByLabelText('워크스페이스 이름')).toHaveValue('');
    expect(screen.getByLabelText('워크스페이스 url')).toHaveValue('');
  });

  it('Toggle Workspace Menu', () => {
    const workspace = screen.getByText('Sleact');
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();

    fireEvent.click(workspace);
    expect(screen.queryByTestId('menu')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('workspace-container'));
    expect(screen.queryByTestId('menu')).not.toBeInTheDocument();
  });

  it('Toggle CreateChannel Modal', () => {
    fireEvent.click(screen.getByText('Sleact'));
    expect(screen.queryByTestId('menu')).toBeInTheDocument();

    const button = screen.getByText('채널 만들기');

    fireEvent.click(button);
    expect(screen.queryByTestId('modal')).toBeInTheDocument();

    (screen.getByLabelText('워크스페이스 이름') as HTMLInputElement).value = 'test';

    fireEvent.click(screen.getByTestId('workspace-container'));
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.queryByTestId('modal')).toBeInTheDocument();
    expect(screen.getByLabelText('워크스페이스 이름')).toHaveValue('');
  });
});

describe('Workspace Data Test', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  function renderWorkspace<T>(data: T) {
    mockedSWR.mockReturnValue({ data, mutate: null });

    return render(
      <MemoryRouter>
        <Workspace />
        <Route path="/login">login page</Route>
        <Route path="/workspaces/test">test page</Route>
      </MemoryRouter>,
    );
  }

  it('Logout', () => {
    const { container } = renderWorkspace(false);
    expect(container).toHaveTextContent(/login page/);
  });

  it('Go to another Workspace', () => {
    const userData = { Workspaces: [{ id: 1, url: 'test', name: 'test' }] };
    const { container, getByText } = renderWorkspace(userData);

    fireEvent.click(getByText(userData.Workspaces[0].name.slice(0, 1).toUpperCase()));
    expect(container).toHaveTextContent(/test page/);
  });

  it('Create Channel', () => {
    const channelData = [{ id: 1, name: 'goose', private: false, WorkspaceId: 1 }];
    const { getByText } = renderWorkspace(channelData);

    getByText(`# ${channelData[0].name}`);
  });

  it('blocking create workspace test', async () => {
    mockedAxios.post.mockResolvedValue(1);

    renderWorkspace(true);
    fireEvent.click(screen.getByText('+'));

    const nameInput = screen.getByLabelText('워크스페이스 이름') as HTMLInputElement;
    const urlInput = screen.getByLabelText('워크스페이스 url') as HTMLInputElement;

    nameInput.value = '  ';
    urlInput.value = 'test';

    fireEvent.click(screen.getByText('생성하기'));
    expect(mockedAxios.post).not.toHaveBeenCalled();

    nameInput.value = 'test';
    urlInput.value = '   ';

    fireEvent.click(screen.getByText('생성하기'));
    expect(mockedAxios.post).not.toHaveBeenCalled();

    nameInput.value = 'test';
    urlInput.value = 'test';

    fireEvent.click(screen.getByText('생성하기'));
    await act(async () => {
      await expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      expect(screen.queryByText('생성하기')).not.toBeInTheDocument();
    });
  });

  it('blocking create channel test', async () => {
    mockedAxios.post.mockResolvedValue(1);
    renderWorkspace(true);

    fireEvent.click(screen.getByText('Sleact'));
    fireEvent.click(screen.getByText('채널 만들기'));

    const createChannelInput = screen.getByLabelText('워크스페이스 이름') as HTMLInputElement;

    createChannelInput.value = '  ';
    fireEvent.click(screen.getByText('생성하기'));
    expect(mockedAxios.post).not.toHaveBeenCalled();

    createChannelInput.value = 'test';
    fireEvent.click(screen.getByText('생성하기'));

    await act(async () => {
      await expect(mockedAxios.post).toHaveBeenCalledTimes(1);

      expect(screen.queryByText('생성하기')).not.toBeInTheDocument();
    });
  });
});

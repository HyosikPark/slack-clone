import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';
import LogIn from './LogIn';
import useSWR from 'swr';

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedSWR = useSWR as jest.Mock;

jest.mock('axios');
jest.mock('swr');

function loginComponent(data: boolean) {
  mockedSWR.mockReturnValue({ data, mutate: null });

  return render(
    <MemoryRouter>
      <LogIn />
      <Route path="/workspace/:workspace/channel/일반">workspace page</Route>
      <Route path="/signup">signup page</Route>
    </MemoryRouter>,
  );
}

describe('<SignUp />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('login failure', () => {
    mockedAxios.post.mockRejectedValue('');

    const { getByTestId, queryByText } = loginComponent(false);

    expect(queryByText('아이디 또는 비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument();

    const form = getByTestId('form');

    fireEvent.submit(form);

    expect(mockedAxios.post).toBeCalledTimes(1);

    waitFor(() => expect(queryByText('아이디 또는 비밀번호가 일치하지 않습니다.')).toBeInTheDocument());
  });

  it('login success', () => {
    const { container } = loginComponent(true);

    expect(container).toHaveTextContent(/workspace page/);
  });

  it('Go to SignUp page', () => {
    const { container, getByText } = loginComponent(false);

    fireEvent.click(getByText('회원가입 하러가기'));

    expect(container).toHaveTextContent(/signup page/);
  });
});

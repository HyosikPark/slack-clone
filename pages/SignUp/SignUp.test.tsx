import React from 'react';
import { render, fireEvent, RenderResult, waitFor, screen } from '@testing-library/react';
import SignUp from '@pages/SignUp/SignUp';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';

const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('axios');

describe('<SignUp />', () => {
  let signUpCompontent: RenderResult<
    typeof import('../../node_modules/@testing-library/dom/types/queries'),
    HTMLElement
  >;

  beforeEach(() => {
    signUpCompontent = render(
      <MemoryRouter>
        <SignUp />
        <Route path="/login">
          <div>login page</div>{' '}
        </Route>
      </MemoryRouter>,
    );

    const { getByLabelText } = signUpCompontent;

    const emailInput = getByLabelText('이메일 주소');
    const nicknameInput = getByLabelText('닉네임');
    const passwordInput = getByLabelText('비밀번호');
    const passwordCheckInput = getByLabelText('비밀번호 확인');

    fireEvent.change(emailInput, { target: { value: 'dlrj@abc.com' } });
    fireEvent.change(nicknameInput, { target: { value: 'okok' } });
    fireEvent.change(passwordInput, { target: { value: '1234' } });
    fireEvent.change(passwordCheckInput, { target: { value: '1234' } });

    jest.clearAllMocks();
  });

  function submitRegisterForm() {
    const { getByTestId } = signUpCompontent;
    const form = getByTestId('form');

    fireEvent.submit(form);
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  }

  it('email Test', () => {
    const { getByTestId, queryByText, getByLabelText } = signUpCompontent;
    const emailInput = getByLabelText('이메일 주소');
    const form = getByTestId('form');

    expect(queryByText('이메일 형식이 올바르지 않습니다.')).not.toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: 'goose@gmail' } });
    fireEvent.submit(form);

    expect(queryByText('이메일 형식이 올바르지 않습니다.')).toBeInTheDocument();
    expect(queryByText('이메일을 입력해주세요.')).not.toBeInTheDocument();

    fireEvent.change(emailInput, { target: { value: '' } });
    fireEvent.submit(form);

    expect(queryByText('이메일을 입력해주세요.')).toBeInTheDocument();
  });

  it('nickname Test', () => {
    const { getByTestId, queryByText, getByLabelText } = signUpCompontent;
    const nicknameInput = getByLabelText('닉네임');
    const form = getByTestId('form');

    expect(queryByText('닉네임을 입력해주세요.')).not.toBeInTheDocument();

    fireEvent.change(nicknameInput, { target: { value: '' } });
    fireEvent.submit(form);

    expect(queryByText('닉네임을 입력해주세요.')).toBeInTheDocument();
  });

  it('password Test', () => {
    const { getByTestId, queryByText, getByLabelText } = signUpCompontent;
    const passwordInput = getByLabelText('비밀번호');
    const passwordCheckInput = getByLabelText('비밀번호 확인');

    const form = getByTestId('form');

    expect(queryByText('비밀번호가 일치하지 않습니다.')).not.toBeInTheDocument;

    fireEvent.change(passwordInput, { target: { value: '' } });
    fireEvent.submit(form);

    expect(queryByText('비밀번호가 일치하지 않습니다.')).toBeInTheDocument;
    expect(queryByText('비밀번호를 입력해주세요.')).not.toBeInTheDocument;

    fireEvent.change(passwordCheckInput, { target: { value: '' } });
    fireEvent.submit(form);

    expect(queryByText('비밀번호를 입력해주세요.')).toBeInTheDocument;
  });

  it('duplicated Email SignUp Failure Check', () => {
    mockedAxios.post.mockRejectedValue('failure');

    expect(screen.queryByText('이미 사용 중인 이메일입니다.')).not.toBeInTheDocument();

    submitRegisterForm();

    waitFor(() => expect(screen.queryByText('이미 사용 중인 이메일입니다.')).toBeInTheDocument());
  });

  it('SignUp Success Check', async () => {
    mockedAxios.post.mockResolvedValue('success');

    await submitRegisterForm();

    screen.getByText('login page');
  });

  it('Go to Login Page', () => {
    fireEvent.click(screen.getByText('로그인 하러가기'));

    screen.getByText('login page');
  });
});

import React, { useCallback, useState } from 'react';
import { Form, Label, Input, LinkContainer, Button, Header, Error } from '@pages/SignUp/styles';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';
import { fetcher } from '@utils/fetcher';

function LogIn() {
  const { data, mutate } = useSWR('/api/users', fetcher);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [LoginError, setLoginError] = useState(false);

  const onChangeEmail = useCallback(
    (e) => {
      if (LoginError) setLoginError(false);

      setEmail(e.target.value);
    },
    [LoginError],
  );

  const onChangePassword = useCallback(
    (e) => {
      if (LoginError) setLoginError(false);

      setPassword(e.target.value);
    },
    [LoginError],
  );

  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();

      axios
        .post('/api/users/login', {
          email,
          password,
        })
        .then((res) => mutate(res.data, false))
        .catch(() => setLoginError(true));
    },

    [email, mutate, password],
  );

  if (data === undefined) return null;

  if (data) return <Redirect to="/workspace/sleact/channel/일반" />;

  return (
    <div id="container">
      <Header>Slack-clone</Header>
      <Form data-testid="form" onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <Input blankInput={LoginError} type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <Input
            blankInput={LoginError}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
          />
        </Label>
        {LoginError && <Error data-testid="login-error">아이디 또는 비밀번호가 일치하지 않습니다.</Error>}
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default React.memo(LogIn);

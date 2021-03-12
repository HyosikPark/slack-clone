import React, { useCallback, useState } from 'react';
import { validateRegister } from '@utils/Validate';
import { Form, Label, Input, LinkContainer, Button, Header, Error } from '@pages/SignUp/styles';
import { ErrorsProps } from '@utils/Validate';
import axios from 'axios';
import { useHistory, Link } from 'react-router-dom';

function SignUp() {
  const history = useHistory();

  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMismatchError] = useState(false);
  const [validError, setValidError] = useState<ErrorsProps>({ email: '', nickname: '', password: '' });
  const [signUpError, setSignUpError] = useState(false);

  const onChangeEmail = useCallback(
    (e) => {
      if (validError.email) setValidError({ ...validError, email: '' });
      setEmail(e.target.value);
    },
    [validError],
  );

  const onChangeNickname = useCallback(
    (e) => {
      if (validError.nickname) setValidError({ ...validError, nickname: '' });
      setNickname(e.target.value);
    },
    [validError],
  );

  const onChangePassword = useCallback(
    (e) => {
      if (validError.password) setValidError({ ...validError, password: '' });
      setPassword(e.target.value);
      setMismatchError(e.target.value !== passwordCheck);
    },
    [validError, passwordCheck],
  );

  const onChangePasswordCheck = useCallback(
    (e) => {
      if (validError.password) setValidError({ ...validError, password: '' });
      setPasswordCheck(e.target.value);
      setMismatchError(e.target.value !== password);
    },
    [password, validError],
  );

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      setSignUpError(false);

      if (mismatchError) return;

      const userInput = { email, nickname, password };
      const { errors, valid } = validateRegister(userInput);

      if (!valid) return setValidError(errors);

      axios
        .post('/api/users', {
          email,
          nickname,
          password,
        })
        .then(() => history.push('/login'))
        .catch(() => setSignUpError(true));
    },

    [mismatchError, email, nickname, password, history],
  );

  return (
    <div id="container">
      <Header>Slack-clone</Header>
      <Form data-testid="form" onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <Input
            blankInput={Boolean(validError.email)}
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChangeEmail}
          />
        </Label>
        <Label id="nickname-label">
          <span>닉네임</span>
          <Input
            blankInput={Boolean(validError.nickname)}
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={onChangeNickname}
          />
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <Input
            blankInput={Boolean(validError.password)}
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={onChangePassword}
          />
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <Input
            blankInput={Boolean(validError.password)}
            type="password"
            id="password-check"
            name="password-check"
            value={passwordCheck}
            onChange={onChangePasswordCheck}
          />
        </Label>
        {Object.entries(validError).map(
          ([key, value]) =>
            value && (
              <Error key={key} data-testid={`blank-${key}`}>
                {value}
              </Error>
            ),
        )}
        {mismatchError && <Error data-testid="mismatch-password">비밀번호가 일치하지 않습니다.</Error>}
        {signUpError && <Error>이미 사용 중인 이메일입니다.</Error>}
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        <Link to="/login">로그인 하러가기</Link>
      </LinkContainer>
    </div>
  );
}

export default React.memo(SignUp);

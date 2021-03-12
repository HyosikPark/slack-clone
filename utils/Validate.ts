export interface ErrorsProps {
  nickname: string;
  email: string;
  password: string;
}

export function validateRegister({ email, nickname, password }: ErrorsProps) {
  const errors: ErrorsProps = { email: '', nickname: '', password: '' };
  const blankRegx = /\s/g;
  const emailRegx = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

  let valid = true;

  if (!email.match(emailRegx)) {
    errors.email = '이메일 형식이 올바르지 않습니다.';
    valid = false;
  }

  if (email.trim() === '' || email.match(blankRegx)) {
    errors.email = '이메일을 입력해주세요.';
    valid = false;
  }

  if (nickname.trim() === '' || nickname.match(blankRegx)) {
    errors.nickname = '닉네임을 입력해주세요.';
    valid = false;
  }

  if (password.trim() === '' || password.match(blankRegx)) {
    errors.password = '비밀번호를 입력해주세요.';
    valid = false;
  }

  return {
    errors,
    valid,
  };
}

// module.exports.validateLoginInput = (nickname, password) => {
//   const errors = {};
//   const blankRegx = /\s/g;

//   if (username.trim() === '' || username.match(blankRegx)) {
//     errors.username = 'username에 공백이 허용되지 않습니다.';
//   }

//   if (password.trim() === '' || password.match(blankRegx)) {
//     errors.password = '비밀번호를 입력해주십시오.';
//   }

//   return {
//     errors,
//     valid: Object.keys(errors).length < 1,
//   };
// };

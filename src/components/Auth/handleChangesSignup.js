import { toast } from 'react-toastify';

export const handleNameChange = setUsername => e => {
  const value = e.target.value;
  if (value.length >= 20) {
    const errorMessage = 'O Apelido de usuário não pode exceder 20 caracteres.';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
    }
  } else {
    setUsername(value);
  }
};

export const handleNameBlur = setUsername => e => {
  const value = e.target.value;
  if (value.includes(' ')) {
    const errorMessage = 'O Apelido de usuário não pode conter espaços!';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
    }
  } else if (value.length < 5) {
    const errorMessage =
      'O Apelido de usuário deve ter no mínimo 5 caracteres.';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
    }
  }
};

export const handlePasswordChange = setPassword => e => {
  const value = e.target.value;
  setPassword(value);
};

export const handleEmailChange = setEmail => e => {
  const value = e.target.value;
  setEmail(value.slice(0, 50));
};

export const handleEmailBlur = () => e => {
  const value = e.target.value;
  if (value.length > 50) {
    const errorMessage = 'O Email não pode exceder 50 caracteres';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
    }
  } else if (!value.includes('@') || value.includes(' ')) {
    const errorMessage = 'O Email não pode conter espaços e precisa ter um "@"';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage, autoClose: 5000 });
    }
  }
};

import { toast } from 'react-toastify';

export const handleIdentifierChange = (setIdentifier) => e => {
  const value = e.target.value;
  const atCount = value.split('@').length - 1;
  if (atCount > 1) {
    const errorMessage = 'Por favor, insira apenas um @';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }
  } else if (value.includes('@')) {
    if (value.length > 50) {
      const errorMessage = 'O email não pode exceder 50 caracteres';
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage, { toastId: errorMessage });
      }
    }
  } else {
    if (value.length > 20) {
      const errorMessage = 'O Nome de Usuário não pode exceder 20 Caracteres. Adicione um @ se vai entrar com E-mail.';
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage, { toastId: errorMessage });
      }
    }
  }
  setIdentifier(value);
};

export const handlePasswordChange = (setPassword) => e => {
  const value = e.target.value;
  if (value.length >= 60) {
    const errorMessage = 'A senha não pode exceder 60 caracteres';
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }
  }
  setPassword(value);
};
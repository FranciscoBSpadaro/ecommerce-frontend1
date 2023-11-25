import { toast } from 'react-toastify';

export const useHandleChangeProduct = (formData, setFormData) => {
  const handleChangeProduct = e => {
    const { name, value } = e.target;

    if (value.length > 45) {
      const errorMessage =
        'O nome do produto deve ter no máximo 45 caracteres.';

      // Verificar se o toast com o ID errorMessage já está ativo
      if (!toast.isActive(errorMessage)) {
        toast.error(errorMessage, { toastId: errorMessage });
      }

      return;
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return handleChangeProduct;
};

export const handleChangeBrand = (e, formData, setFormData) => {
  const { name, value } = e.target;

  if (value.length > 25) {
    const errorMessage = 'A marca deve ter no máximo 25 caracteres.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const handleChangeModel = (e, formData, setFormData) => {
  const { name, value } = e.target;

  if (value.length > 25 || value.includes(' ')) {
    const errorMessage =
      'O modelo deve ter no máximo 25 caracteres e não deve conter espaços.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const handleQuantityChange = (e, formData, setFormData) => {
  const value = parseInt(e.target.value);

  if (value < 0) {
    return;
  } else if (value > 999999999) {
    const errorMessage = 'A quantidade deve ter no máximo 9 dígitos.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  setFormData({
    ...formData,
    quantity: value,
  });
};

export const handlePriceChange = (e, formData, setFormData) => {
  let value = e.target.value;

  // Permitir que o valor do campo seja vazio
  if (value === '') {
    setFormData({
      ...formData,
      price: value,
    });
    return;
  }

  // Permitir apenas números, pontos e vírgulas
  const regex = /^[0-9.,]+$/;
  if (!regex.test(value)) {
    return;
  }

  // Verificar se um ponto é inserido após uma vírgula
  if (value.includes(',') && value.split(',')[1].includes('.')) {
    const errorMessage =
      'Atenção, não é permitido inserir um ponto se ja digitou uma vírgula.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  // Verificar se o valor tem mais de uma vírgula
  const commaCount = (value.match(/,/g) || []).length;
  if (commaCount > 1) {
    const errorMessage =
      'Atenção, respeite as casas decimais. Use apenas 1 vírgula depois de colocar pontos.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  // Verificar se há dois ou mais pontos em sequência
  if (/(\.\.)+/.test(value)) {
    const errorMessage =
      'Atenção, não é permitido inserir dois ou mais pontos em sequência.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  // Verificar se o número total de dígitos excede 10 e se os dígitos após a vírgula excedem 2
  const digitCount = value.replace(/[^0-9]/g, '').length;
  const decimalCount = value.split(',')[1]?.length || 0;
  if (digitCount > 10 || decimalCount > 2) {
    const errorMessage =
      'Atenção, o preço deve ter um total de 10 dígitos. use o padrão decimal 99.999.999,99 ou 99999999,99 ou 8 dígitos no formato 99999999';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  setFormData({
    ...formData,
    price: value,
  });
};

export const handleChangeDescription = (e, formData, setFormData) => {
  const { name, value } = e.target;

  if (name === 'description' && value.length > 55) {
    const errorMessage = 'A descrição curta deve ter no máximo 55 caracteres.';

    // Verificar se o toast com o ID errorMessage já está ativo
    if (!toast.isActive(errorMessage)) {
      toast.error(errorMessage, { toastId: errorMessage });
    }

    return;
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

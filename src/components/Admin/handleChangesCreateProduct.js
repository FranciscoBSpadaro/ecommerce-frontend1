export const handleChangeProduct = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
  const { name, value } = e.target;

  if (name === 'productName' && value.length > 45) {
    setErrorMessage(prevErrors => ({
      ...prevErrors,
      productName: 'O nome do produto deve ter no máximo 45 caracteres.',
    }));
    setTimeout(() => {
      setErrorMessage(prevErrors => ({ ...prevErrors, productName: '' }));
    }, 5000);
    return;
  } else {
    setErrorMessage(prevErrors => ({ ...prevErrors, productName: '' }));
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const handleChangeBrand = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
  const { name, value } = e.target;
  if (value.length > 25) {
    setErrorMessage(prevErrors => ({
      ...prevErrors,
      brand: 'A marca deve ter no máximo 25 caracteres.',
    }));
    setTimeout(() => {
      setErrorMessage(prevErrors => ({ ...prevErrors, brand: '' }));
    }, 5000);
    return;
  } else {
    setErrorMessage(prevErrors => ({ ...prevErrors, brand: '' }));
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const handleChangeModel = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
  const { name, value } = e.target;
  if (value.length > 25 || value.includes(' ')) {
    setErrorMessage(prevErrors => ({
      ...prevErrors,
      model:
        'O modelo deve ter no máximo 25 caracteres e não deve conter espaços.',
    }));
    setTimeout(() => {
      setErrorMessage(prevErrors => ({ ...prevErrors, model: '' }));
    }, 5000);
    return;
  } else {
    setErrorMessage(prevErrors => ({ ...prevErrors, model: '' }));
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

export const handleQuantityChange = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
  const value = parseInt(e.target.value);

  if (value < 0) {
    return;
  } else if (value > 999999999) {
    setErrorMessage(prevErrors => ({
      ...prevErrors,
      quantity: 'A quantidade deve ter no máximo 9 dígitos.',
    }));
    setTimeout(() => {
      setErrorMessage(prevErrors => ({ ...prevErrors, quantity: '' }));
    }, 5000);
    return;
  }

  setFormData({
    ...formData,
    quantity: value,
  });
};

export const handlePriceChange = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
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
    // Exibir uma mensagem de erro
    setErrorMessage(
      'Atenção, não é permitido inserir um ponto se ja digitou uma vírgula.',
    );
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
    return;
  }

  // Verificar se o valor tem mais de uma vírgula
  const commaCount = (value.match(/,/g) || []).length;
  if (commaCount > 1) {
    // Exibir uma mensagem de erro
    setErrorMessage(
      'Atenção, respeite as casas decimais. Use apenas 1 vírgula depois de colocar pontos.',
    );
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
    return;
  }

  // Verificar se o número total de dígitos excede 10 e se os dígitos após a vírgula excedem 2
  const digitCount = value.replace(/[^0-9]/g, '').length;
  const decimalCount = value.split(',')[1]?.length || 0;
  if (digitCount > 10 || decimalCount > 2) {
    // Exibir uma mensagem de erro
    setErrorMessage(
      `Atenção, o preço deve ter um total de 12 dígitos. \n use o padrão decimal 99.999.999,99 ou 10 dígitos no formato 9999999999`,
    );
    setTimeout(() => {
      setErrorMessage('');
    }, 6000);
    return;
  }
  // Verificar se o valor tem mais de duas casas decimais
  const parts = value.split(',');
  if (parts.length > 1 && parts[1].length > 2) {
    // Remover os dígitos extras
    value = parts[0] + ',' + parts[1].substring(0, 2);

    // Exibir uma mensagem de erro
    setErrorMessage(
      'Atenção, respeite as casas decimais. Use ponto antes de vírgulas.',
    );
    setTimeout(() => {
      setErrorMessage('');
    }, 5000);
  }

  setFormData({
    ...formData,
    price: value,
  });
};

export const handleChangeDescription = (
  e,
  setErrorMessage,
  formData,
  setFormData,
) => {
  const { name, value } = e.target;
  if (name === 'description' && value.length > 55) {
    setErrorMessage(prevErrors => ({
      ...prevErrors,
      description: 'A descrição curta deve ter no máximo 55 caracteres.',
    }));
    setTimeout(() => {
      setErrorMessage(prevErrors => ({ ...prevErrors, description: '' }));
    }, 5000);
    return;
  } else {
    setErrorMessage(prevErrors => ({ ...prevErrors, description: '' }));
  }

  setFormData({
    ...formData,
    [name]: value,
  });
};

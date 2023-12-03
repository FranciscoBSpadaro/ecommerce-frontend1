import React, { useEffect, useRef } from 'react';

const CheckoutForm = ({ orderId }) => {
  const mercadoPagoPublicKey = process.env.REACT_APP_MERCADO_PAGO_PUBLIC_KEY;

  const cardForm = useRef(null);

  const handleClick = event => {
    event.preventDefault();
    // Adicione a lógica do clique aqui
  };

  useEffect(() => {
    if (window.Mercadopago) {
      window.Mercadopago.setPublishableKey(mercadoPagoPublicKey);
      window.Mercadopago.getIdentificationTypes();

      cardForm.current = window.Mercadopago.cardForm({
        amount: '',
        autoMount: true,
        form: {
          id: 'form-checkout',
          cardholderName: {
            id: 'form-checkout__cardholderName',
            placeholder: 'Titular do cartão',
          },
          cardholderEmail: {
            id: 'form-checkout__cardholderEmail',
            placeholder: 'E-mail',
          },
          cardNumber: {
            id: 'form-checkout__cardNumber',
            placeholder: 'Número do cartão',
          },
          cardExpirationMonth: {
            id: 'form-checkout__cardExpirationMonth',
            placeholder: 'Mês de vencimento',
          },
          cardExpirationYear: {
            id: 'form-checkout__cardExpirationYear',
            placeholder: 'Ano de vencimento',
          },
          securityCode: {
            id: 'form-checkout__securityCode',
            placeholder: 'Código de segurança',
          },
          installments: {
            id: 'form-checkout__installments',
            placeholder: 'Parcelas',
          },
          identificationType: {
            id: 'form-checkout__identificationType',
            placeholder: 'Tipo de identificação',
          },
          identificationNumber: {
            id: 'form-checkout__identificationNumber',
            placeholder: 'Número da identificação',
          },
          issuer: {
            id: 'form-checkout__issuer',
            placeholder: 'Emissor do cartão',
          },
        },
        callbacks: {
          onFormMounted: error => {
            if (error)
              return console.warn('Form Mounted handling error: ', error);
            console.log('Form mounted');
          },
          onSubmit: event => {
            event.preventDefault();

            const {
              paymentMethodId: id,
              issuerId: issuer_id,
              cardholderEmail: email,
              amount,
              token,
              installments,
              identificationNumber,
              identificationType,
            } = cardForm.current.getCardFormData();
            fetch(`/orders/confirm/${orderId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id,
                token,
                description: 'Descrição do produto',
                installments: Number(installments),
                issuerId: issuer_id,
                payer: {
                  email,
                  identification: {
                    type: identificationType,
                    number: identificationNumber,
                  },
                },
                amount: Number(amount),
              }),
            })
              .then(response => {
                if (response.status === 200) {
                  console.log('Payment succeeded!');
                } else {
                  console.log('Payment failed!');
                }
              })
              .catch(error => {
                console.log('Error submitting payment: ', error);
              });
          },
          onFetching: resource => {
            console.log('Fetching resource: ', resource);

            // Animate progress bar
            const progressBar = document.querySelector('.progress-bar');
            progressBar.removeAttribute('value');

            return () => {
              progressBar.setAttribute('value', '0');
            };
          },
        },
      });
    }
  }, [mercadoPagoPublicKey, orderId]);

  return (
    <form id="form-checkout">
      <div className="form-group">
        <label htmlFor="form-checkout__cardholderName">
          Nome do titular do cartão
        </label>
        <input type="text" id="form-checkout__cardholderName" />
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__cardholderEmail">
          Email do titular do cartão
        </label>
        <input type="email" id="form-checkout__cardholderEmail" />
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__identificationType">
          Tipo de identificação
        </label>
        <select id="form-checkout__identificationType"></select>
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__identificationNumber">
          Número de identificação
        </label>
        <input type="text" id="form-checkout__identificationNumber" />
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__cardNumber">Número do cartão</label>
        <input type="text" id="form-checkout__cardNumber" />
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__securityCode">Código de segurança</label>
        <input type="text" id="form-checkout__securityCode" />
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__issuer">Emissor do cartão</label>
        <select id="form-checkout__issuer"></select>
      </div>

      <div className="form-group">
        <label htmlFor="form-checkout__installments">Parcelas</label>
        <select id="form-checkout__installments"></select>
      </div>

      {/* Add other form fields as needed */}
      <button type="submit" id="form-checkout__submit" onClick={handleClick}>
        Pagar
      </button>
    </form>
  );
};

export default CheckoutForm;

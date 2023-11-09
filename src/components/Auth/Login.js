import React, { useState } from 'react';
import api from '../../api'; // Importa o arquivo de configuração do Axios

const Login = () => {
  const [identifier, setIdentifier] = useState(''); // Armazena email ou username
  const [password, setPassword] = useState('');
  const [loginResponse, setloginResponse] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    

    try {
      // Construção do objeto de envio considerando a possibilidade de email ou username
      const payload = {   // strings vazias por padrão
        username: '',
        email: '',
        password
      };

      if (identifier.includes('@')) {
        payload.email = identifier; // Define email se o 'identifier' incluir '@'
      } else {
        payload.username = identifier; // Define username caso contrário
      }

      const response = await api.post('/users/login', payload);

      const { token } = response.data;   // armazena o token se resposta ok do backend

      if (token) { // se recebeu token armazena no sessionStorage no formato token Bearer
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        sessionStorage.setItem('token', token);
        setloginResponse('Login bem-sucedido!');
        setIsSuccess(true);  // setIsSuccess true ou falso vai definer a cor da mensagem na linha 56
        setIsLoading(true);

        setTimeout(() => {  // redireciona para home page apos 3 segundos 
          window.location.replace('/');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = ('Usuário ou Senha Invalidos');   // retorna mensagens que o backend responde
      setloginResponse(errorMessage);
      setIsSuccess(false);
      setIsLoading(false);
      console.error(error.response?.data?.message);

      setTimeout(() => {
        setloginResponse(null);
      }, 5000);
    }
  };

  return (
    <div className="center-container-login">
      <h2>🛒Acessar🤩</h2>
      {loginResponse && <p style={{ color: isSuccess ? 'green' : 'red' }}>{loginResponse}</p>}
      <form className="form-group" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuário ou E-mail"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {isLoading && <div className="loading-animation"><p>Entrando na loja...</p></div>}
      </form>
      <p style={{ textAlign: 'center' }}>
        <a href="/signup">Não possui Cadastro?</a>.
      </p>
      <p style={{ textAlign: 'center' }}>
        <a href="/forgotpassword">Esqueceu sua Senha?</a>
      </p>
      <p style={{ textAlign: 'center' }}>
        <a href="/forgotusername">Esqueceu seu Usuário?</a>
      </p>
    </div>
  );
};

export default Login;

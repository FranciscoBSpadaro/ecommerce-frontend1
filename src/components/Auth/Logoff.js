

const Logoff = () => {

    // Remova o token ou faça outras ações necessárias para desconectar o usuário
    sessionStorage.removeItem('token');
    
    // Redireciona o usuário para a página de login após o logoff
    window.location.replace('/login');


  

  return null; // Não é necessário renderizar nada para este componente
};

export default Logoff;

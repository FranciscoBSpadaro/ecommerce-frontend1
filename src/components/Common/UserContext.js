import React from 'react';

const UserContext = React.createContext({
  username: '',
  setUsername: () => {},
});

export default UserContext;
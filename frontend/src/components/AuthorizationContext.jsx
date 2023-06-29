import React from 'react';
/* создал и экспортировал контекст и функцию для него, которая просто возвращает тру или фолс
  в зависимости от наличия токена */
const AuthorizationContext = React.createContext({});

const isAuthorization = () => {
  const token = localStorage.getItem('token');
  // токен проеряется путем сверки типа, возможно стоит пересмотреть эту проерку, слишком простая
  return typeof (token) === 'string';
};

export { AuthorizationContext, isAuthorization };

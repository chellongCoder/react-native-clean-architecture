import React, {PropsWithChildren} from 'react';

import {AuthenticationContext} from './AuthenticationContext';
import {AuthenticationStore} from './AuthenticationStore';
import {authenticationModuleContainer} from 'src/authentication/AuthenticationModule';

export const AuthenticationProvider = ({children}: PropsWithChildren) => {
  const store = authenticationModuleContainer.getProvided(AuthenticationStore);

  return (
    <AuthenticationContext.Provider
      value={{
        authenticationStore: store,
      }}>
      {children}
    </AuthenticationContext.Provider>
  );
};

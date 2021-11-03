import { createContext, ReactNode } from 'react';
import useAuth from './hooks/useAuth';

interface AuthContextData {
  authenticated: boolean;
  loading: boolean;
  handleLogin: (token: JSON) => void;
  handleLogout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({children}: AuthProviderProps){
  const {
    authenticated, loading, handleLogin, handleLogout
  } = useAuth();

  return(
    <AuthContext.Provider value={{
      authenticated, 
      loading, 
      handleLogin, 
      handleLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
}
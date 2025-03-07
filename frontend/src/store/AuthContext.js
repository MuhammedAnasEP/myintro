import { useState, createContext } from "react";

export const AuthContext = createContext({
  user: {},
  setUser: () => {},
  accessToken: null,
  refreshToken: null,
  csrfToken: null,
  setAccessToken: () => {},
  setRefreshToken: () => {},
  setCSRFToken: () => {},
});

export function AuthContextProvider(props) {
  const [user, setUser] = useState({});
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [csrfToken, setCSRFToken] = useState(null);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        accessToken,
        setAccessToken,
        refreshToken,
        setRefreshToken,
        csrfToken,
        setCSRFToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
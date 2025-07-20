import React,{ createContext, useState, useContext } from "react" 
const AuthContext = createContext()
export const AuthProvider = ({children}) => {
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null)
  const setUpLogin = (userData) => {
    let { access_token, user } = userData
    setToken(access_token)
    setUser(user)
  }
  return (
    <AuthContext.Provider value={{ user, token, setUpLogin}}>
      {children}
    </AuthContext.Provider>
  )

}
export const useAuth = ()=> useContext(AuthContext)

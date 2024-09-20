"use cleint"
import { createContext, useContext } from "react"
const authContext = createContext({ children });


export default function AuthProvider() {
    const value = {

    };

  return (
    <authContext.Provider value={value}>
      { children }
    </authContext.Provider>
  )
}


export const useAuth = () => useContext(createContext) || {};
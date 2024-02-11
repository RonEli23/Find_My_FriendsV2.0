import { useContext, useDebugValue } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
    const { auth } = useContext(AuthContext);
    useDebugValue(auth, auth => auth?.user ? "Logged In" : "Logged Out") //determines the label displayed in DevTools
    return useContext(AuthContext);
}

export default useAuth;
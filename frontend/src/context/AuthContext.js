// import libraries from react
import { createContext, useState, useEffect } from "react";
// import js-cookie
import Cookies from 'js-cookie';
import axios from "../api/axios.js";

const initUesr = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    isLoggedIn: false,
    //first_time_Logged_in: true,
}

const getInitialState = () => {
    const user = Cookies.get("user");
    return user ? JSON.parse(user) : initUesr;
}

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
    const [user, setUser] = useState(getInitialState);
    //const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    useEffect(() => {
        Cookies.set("user", JSON.stringify(user));
    }, [user]);

    const login = (first_name, last_name, email, phone_number, accessToken) => {
        const updatedUser = {
            ...user,
            first_name,
            last_name,
            email,
            phone_number,
            isLoggedIn: true,
            accessToken
            //first_time_Logged_in: false,
        };
        setUser(updatedUser);
        Cookies.set("user", JSON.stringify(user));
    }

    const logout = async () => {
        setUser({})
        Cookies.set("user", JSON.stringify(user));
        try {
            await axios.get('/logout', {
                withCredentials: true
            });
        } catch (err) {
            console.error(err);
        }

    }

    const signUp = (first_name, last_name, email, phone_number) => {
        const newUser = {
            ...user,
            first_name,
            last_name,
            email,
            phone_number,
            //isLoggedIn: true,
            //first_time_Logged_in: true,
        };
        setUser(newUser);
        Cookies.set("user", JSON.stringify(user));
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, signUp }} >
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;
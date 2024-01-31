// import libraries from react
import { createContext, useState, useEffect } from "react";
// import js-cookie
import Cookies from 'js-cookie';

const initRequest = {
    status: ""
}

const getInitialState = () => {
    const request = Cookies.get("request");
    return request ? JSON.parse(request) : initRequest;
}

export const UserRequestContext = createContext();

const UserRequestContextProvider = (props) => {
    const [request, setRequest] = useState(getInitialState);

    useEffect(() => {
        Cookies.set("request", JSON.stringify(request));
    }, [request]);

    const updateStatus = (status) => {
        request.status = status;
        setRequest(request);
        Cookies.set("request", JSON.stringify(request));
    }

    return (
        <UserRequestContext.Provider value={{ request, updateStatus }} >
            {props.children}
        </UserRequestContext.Provider>
    )
}

export default UserRequestContextProvider;
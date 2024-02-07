import { axiosPrivate } from "../api/axios";
import { useEffect } from "react";
import useRefreshToken from "./useRefreshToken";
import useAuth from "./useAuth";

const useAxiosPrivate = () => {
    const refresh = useRefreshToken(); 
    const { auth } = useAuth(); 

    useEffect(() => {

        const requestIntercept = axiosPrivate.interceptors.request.use(
            // request interceptor starts with config
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // deal with response
        const responseIntercept = axiosPrivate.interceptors.response.use(
            // if all good return response
            response => response,
            // else, deal with error response
            async (error) => {
                const prevRequest = error?.config; // if there was an error, retrieve the previous request by accessing the config property
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    // 403 => expired  access token
                    // sent is a custom property, to avoid endless loop
                    prevRequest.sent = true; 
                    const newAccessToken = await refresh();
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return axiosPrivate(prevRequest); // update the request with a new access token
                }
                return Promise.reject(error);
            }
        );

        // cleaning up all the interceptors 
        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }
    }, [auth, refresh])

    return axiosPrivate;
}

export default useAxiosPrivate;
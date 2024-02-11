import { useContext } from 'react';
import axios from '../api/axios';
//import useAuth from './useAuth';
import { AuthContext } from '../context/AuthContext.js';


const useRefreshToken = () => {
    const { setUser } = useContext(AuthContext); 


    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setUser(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                //roles: response.data.roles,
                accessToken: response.data.accessToken
            }
        });
        return response.data.accessToken;
    }
    return refresh;
};

export default useRefreshToken;
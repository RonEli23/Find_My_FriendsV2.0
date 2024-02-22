import { useContext } from 'react';
import axios from '../api/axios';
//import useAuth from './useAuth';
import { AuthContext } from '../context/AuthContext.js';


const useRefreshToken = () => {
    const {setUser, user} = useContext(AuthContext);
    
    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });
        setUser(prev => {
        
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
import axios from 'axios';
const BASE_URL = 'http://127.0.0.1:8080';

export default axios.create({
    baseURL: BASE_URL
});

// axios for JWT auth process
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
import axios from 'axios';
import store from '@/store';

const BASE_AUTH_API = import.meta.env.VITE_BASE_AUTH_API;
const BASE_COURSE_API = import.meta.env.VITE_BASE_COURSE_API;
const getState = () => store.getState();

/* -------------------------------------------------------------------------- */
/*                                  Auth API                                  */
/* -------------------------------------------------------------------------- */

const authApi = axios.create({
    baseURL: BASE_AUTH_API,
    headers: {
        'Content-Type': 'application/json'
    },
});

authApi.interceptors.request.use(function (config) {
    const { accessToken } = getState().auth;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

/* -------------------------------------------------------------------------- */
/*                                 Course API                                 */
/* -------------------------------------------------------------------------- */

const courseApi = axios.create({
    baseURL: BASE_COURSE_API,
    headers: {
        'Content-Type': 'application/json'
    },
});

courseApi.interceptors.request.use(function (config) {
    const { accessToken } = getState().auth;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => Promise.reject(error));

export {
    authApi,
    courseApi
};
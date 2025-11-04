import axios from "axios";
const backendApi = import.meta.env.VITE_BACKEND_LINK;

export const axiosInstance = axios.create({
    baseURL: backendApi || '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

axiosInstance.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (error.response?.status === 401) {
            console.warn('Unauthorized, redirecting to login...')
        }
        return Promise.reject(error)
    }
)
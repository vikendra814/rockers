import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'x-api-key': '123456789' }
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

api.interceptors.response.use(
    res => res,
    async err => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post('http://localhost:5000/api/auth/refresh-token',
                    { refreshToken }, { headers: { 'x-api-key': '123456789' } });
                localStorage.setItem('token', data.token);
                localStorage.setItem('refreshToken', data.refreshToken);
                original.headers.Authorization = `Bearer ${data.token}`;
                return api(original);
            } catch {
                localStorage.clear();
                window.location.href = '/login';
            }
        }
        return Promise.reject(err);
    }
);

export default api;

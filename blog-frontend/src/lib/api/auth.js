import client from './client';
//API 함수화
export const login=({username, password})=>client.post('/api/auth/login', {username, password});

export const register=({username, password})=>client.post('/api/auth/register', {username, password});

export const check=()=>client.get('/api/auth/check');

export const logout=()=>client.post('/api/auth/logout');
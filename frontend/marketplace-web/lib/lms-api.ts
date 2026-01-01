import axios from 'axios';
import logger from './logger';

const LMS_API_URL = process.env.NEXT_PUBLIC_LMS_API_URL || 'http://localhost:8082/api';

export const lmsClient = axios.create({
  baseURL: LMS_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

lmsClient.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) config.headers = { ...(config.headers || {}), Authorization: `Bearer ${token}` };
  }
  logger.debug(`LMS API: ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

lmsClient.interceptors.response.use((resp) => resp, (err) => {
  logger.error('LMS API Error', err);
  return Promise.reject(err);
});

export default lmsClient;

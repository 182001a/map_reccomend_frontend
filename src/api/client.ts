import axios from 'axios';

import { API_BASE_URL } from '../config';

// APIクライアントの作成
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

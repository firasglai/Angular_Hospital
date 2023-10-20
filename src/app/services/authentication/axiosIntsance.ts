import axios from 'axios';
import { TokenService } from './token.service';


const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

const tokenService = new TokenService();
// Set the token in the headers
const token = tokenService.getToken();
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default api;

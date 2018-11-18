import axios from 'axios'

const api = axios.create({
  baseURL: 'https://twitter-mongo.glitch.me/'
});

export default api;
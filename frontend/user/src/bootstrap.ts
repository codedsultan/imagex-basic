import axios from 'axios';
window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
// withCredentials: true
window.axios.defaults.withCredentials = true;

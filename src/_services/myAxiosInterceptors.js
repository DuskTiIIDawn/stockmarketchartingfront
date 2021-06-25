

import { authenticationService } from './authenticationService';
import axios from 'axios';

const request = axios.create({
    baseURL: "http://localhost:3000"
})


let x = 0;
axios.interceptors.request.use(function (config) {
    x++;
    document.body.classList.add('loading-indicator');
    const currentUser = authenticationService.currentUserValue;
    if (currentUser) {
        config.headers.Authorization = `Bearer ${currentUser.token}`;
    }
    return config;
}, function (error) {
    if (--x === 0) {
        document.body.classList.remove('loading-indicator');
    }
    alert("Oops Something went wrong!")
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    if (--x === 0) {
        document.body.classList.remove('loading-indicator');
    }
    return response;
}, function (error) {
    if (--x === 0) {
        document.body.classList.remove('loading-indicator');
    }
    alert("Oops Something went wrong!")
    return Promise.reject(error);
});

export default request
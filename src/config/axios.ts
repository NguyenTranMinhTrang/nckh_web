import axios from "axios";
import { DOMAIN } from "./AppConfig";

axios.defaults.withCredentials = true;

axios.interceptors.response.use((response) => {
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    throw error;
});

export default axios.create({
    baseURL: DOMAIN,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
    },

});



export const axiosPrivate = axios.create({
    baseURL: DOMAIN,
    headers: { 'Content-Type': 'application/json' },
})


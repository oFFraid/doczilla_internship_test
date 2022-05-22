import axios from 'axios'

const options = {
    baseURL: "http://localhost:3001/",
}

const $api = axios.create(options);


export default $api;


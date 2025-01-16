import axios from "axios"

const apiURL = axios.create({
    baseURL: 'http://localhost:8800/'
  });

export default apiURL;



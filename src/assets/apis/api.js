import Axios from "axios";
import { post } from 'jquery';

const API_URL = "http://127.0.0.1:3000/api" 

class Apis {
    getToken = (data) => {
        post(`${API_URL}/api/account/token/`, data, resp => {
            return resp;
        })
        // $.ajax({
        //     url: `${API_URL}/api/account/token/`,
        //     type: "post",
        //     data: data,
        //     success(resp) {
        //         return resp;
        //     },
        //     error(resp) {
        //         return resp;
        //     }
        // }) 
    }

    addUser = (data) => {
        return Axios.post(`${API_URL}/api/addUser`, data);
    }

    checkUserInfo = (data) => {
        return Axios.post(`${API_URL}/api/checkUserInfo`, data);
    }
}

const apis = new Apis()

export {
    apis, API_URL
}
import Axios from "axios";
import { post } from 'jquery';

const API_URL = "https://app2074.acapp.acwing.com.cn/api";

class Apis {
    getToken = (data) => {
        post(`${API_URL}/api/account/token/`, data, resp => {
            return resp;
        })
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
    apis, 
    API_URL,
}
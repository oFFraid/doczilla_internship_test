import $api from "./api";

export default class BaseService {
    static $api = $api

    static selectData(res) {
        return res.data
    }
}

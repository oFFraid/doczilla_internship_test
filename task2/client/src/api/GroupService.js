import BaseService from "./BaseService";

export default class GroupService extends BaseService {
    static async getAll() {
        return this.$api.get("group").then(this.selectData)
    }
}

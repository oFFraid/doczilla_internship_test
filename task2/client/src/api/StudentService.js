import BaseService from "./BaseService";
import {StudentModel} from "./Models/StudentModel";

export default class StudentService extends BaseService {
    static async get(id) {
        return this.$api.get(`student/${id}`).then(this.selectData);
    }

    static async getAll() {
        return this.$api.get("student").then(this.selectData);
    }

    static async update(id, studentData) {
        return this.$api.put(`student/${id}`, new StudentModel(studentData)).then(this.selectData);
    }

    static async create(studentData) {
        return this.$api.post(`student`, new StudentModel(studentData)).then(this.selectData);
    }

    static async delete(id) {
        return this.$api.delete(`student/${id}`).then(this.selectData);
    }
}

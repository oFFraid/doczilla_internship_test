const db = require("./../db/index");

class StudentController {
    async createStudent(req, res) {
        try {
            const {
                firstName,
                lastName,
                patronymic,
                groupId,
                birthday
            } = req.body;

            const newStudent = await db.query("INSERT INTO student " +
                "(firstName,lastName,patronymic,groupId,birthday) " +
                "VALUES ($1,$2,$3,$4,$5) RETURNING id",
                [
                    firstName,
                    lastName,
                    patronymic,
                    groupId,
                    birthday
                ]);
            res.json(newStudent.rows[0].id);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }

    async getStudents(req, res) {
        try {
            const students = await db.query("SELECT student.id,birthday,firstname,lastname,patronymic,name AS groupName FROM student JOIN studyGroup ON student.groupId = studyGroup.id");
            res.json(students.rows);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }

    async getOneStudent(req, res) {
        try {
            const id = req.params.id;
            const student = await db.query("SELECT student.id,birthday,firstname,lastname,patronymic,name AS groupName FROM student JOIN studyGroup ON student.groupId = studyGroup.id WHERE student.id = $1", [id]);
            res.json(student.rows[0]);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }

    async updateStudent(req, res) {
        try {
            const {
                firstName,
                lastName,
                patronymic,
                groupId,
                birthday
            } = req.body;

            const updatedStudent = await db.query("UPDATE student set" +
                "firstName = $1, lastName = $2, patronymic = $3, groupId = $4, birthday = $5 RETURNING id",
                [
                    firstName,
                    lastName,
                    patronymic,
                    groupId,
                    birthday
                ])
            res.json(updatedStudent.rows[0].id);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }

    async deleteStudent(req, res) {
        try {
            const id = req.params.id;
            const student = await db.query("DELETE FROM student WHERE id = $1 RETURNING id", [id]);
            res.json(student.rows[0].id);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }
}

module.exports = new StudentController();

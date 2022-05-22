const db = require("./../db/index");

class StudentController {
    async getGroups(req, res) {
        try {
            const groups = await db.query("SELECT * FROM studyGroup");
            res.json(groups.rows);
        } catch (e) {
            res.status(300).send({message: e.message});
        }
    }
}

module.exports = new StudentController();

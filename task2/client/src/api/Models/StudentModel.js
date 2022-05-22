export class StudentModel {
    constructor(studentData) {
        const {
            firstName,
            lastName,
            patronymic,
            groupId,
            birthday
        } = studentData;
        this.firstName = firstName;
        this.lastName = lastName;
        this.patronymic = patronymic;
        this.groupId = groupId;
        this.birthday = birthday;
    }
}

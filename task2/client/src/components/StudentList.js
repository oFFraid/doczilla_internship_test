import {Button, Table} from "react-bootstrap";
import {dateFormat} from "../utils/dateFormat";

const StudentList = props => {
    const {
        items = [],
        onDelete = () => {}
    } = props;
    if (!items.length) {
        return <div className="d-flex justify-content-center text-info text-center">
            <h2> List of students is empty</h2>
        </div>
    }
    return <Table
        striped
        bordered
        hover
    >
        <thead>
        <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Patronymic</th>
            <th>Birthday</th>
            <th>group</th>
        </tr>
        </thead>
        <tbody>
        {
            items.map((student, i) => {
                const {
                    firstname,
                    lastname,
                    patronymic,
                    birthday,
                    groupname,
                    id
                } = student
                return <tr key={i}>
                    <td>{id}</td>
                    <td>{firstname}</td>
                    <td>{lastname}</td>
                    <td>{patronymic || "none"}</td>
                    <td>{dateFormat(birthday)}</td>
                    <td>{groupname}</td>
                    <td>
                        <Button
                            onClick={() => onDelete(id)}
                            variant="danger"
                        >
                            delete
                        </Button>
                    </td>
                </tr>
            })
        }
        </tbody>
    </Table>
}
export default StudentList

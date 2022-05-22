import StudentService from "./api/StudentService";
import {useEffect, useMemo, useState} from "react";
import {Button, Container, Spinner, Table} from "react-bootstrap";
import StudentForm from "./components/StudentForm";
import {dateFormat} from "./utils/dateFormat";
import 'react-toastify/dist/ReactToastify.min.css';

import {ToastContainer, toast} from 'react-toastify';

function App() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const reversedStudents = useMemo(() => {
        return [...students].reverse();
    }, [students]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const st = await StudentService.getAll();
                setStudents(st);
            } catch (e) {
                toast.error(e.response.data.message || e.message);
            } finally {
                setLoading(false);
            }
        })()
    }, []);

    const onCreateUser = async (data, {
        setLoading,
        resetForm
    }) => {
        try {
            setLoading(true);
            const id = await StudentService.create(data)
            const newStudent = await StudentService.get(id);
            const newStudents = [
                ...students,
                newStudent
            ];
            setStudents(newStudents);
            resetForm();
            toast.success('student was added');
        } catch (e) {
            toast.error(e.response.data.message || e.message);
        } finally {
            setLoading(false);
        }
    }

    const onDelete = async id => {
        try {
            const stId = await StudentService.delete(id);
            const newStudents = students.filter(st => st.id !== stId);
            setStudents(newStudents);
            toast.success('student was deleted');
        } catch (e) {
            toast.error(e.response.data.message || e.message);
        }
    }

    if (loading) {
        return <Container
            style={{
                paddingTop: "100px",
                display: "flex",
                justifyContent: "center"
            }}
        > <Spinner
            animation="border"
            role="status"
        >
            <span className="visually-hidden">Loading...</span>
        </Spinner>
        </Container>
    }
    return (
        <Container
            style={{paddingTop: "20px"}}
        >
            <h2>Add student form</h2>
            <StudentForm onSubmit={onCreateUser}/>
            <h2>All students</h2>
            <Table
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
                    reversedStudents.map((student, i) => {
                        return <tr key={i}>
                            <td>{student.id}</td>
                            <td>{student.firtsname}</td>
                            <td>{student.lastname}</td>
                            <td>{student.patronymic || "none"}</td>
                            <td>{dateFormat(student.birthday)}</td>
                            <td>{student.groupname}</td>
                            <td>
                                <Button
                                    onClick={() => onDelete(student.id)}
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
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                pauseOnHover
            />
        </Container>
    );
}

export default App;

import {useEffect, useState} from "react";
import GroupService from "../api/GroupService";
import {Button, Form} from "react-bootstrap";
import useForm from "../hooks/useForm";
import {isRequired} from "../utils/validators";

const StudentForm = (props) => {
    const {onSubmit = () => { }} = props
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);

    const {
        values,
        isValid,
        touched,
        errors,
        changeHandler,
        submitHandler
    } = useForm({
            firstName: '',
            lastName: '',
            birthday: '',
            groupId: '',
            patronymic: '',
        },
        [
            ({firstName}) => isRequired(firstName) || {firstName: "is required"},
            ({lastName}) => isRequired(lastName) || {lastName: "is required"},
            ({birthday}) => isRequired(birthday) || {birthday: "is required"},
            ({groupId}) => isRequired(groupId) || {groupId: "is required"},
        ],
        (values, action) => onSubmit(values, {setLoading, ...action}));

    useEffect(() => {
        (async () => {
            try {
                const gr = await GroupService.getAll();
                setGroups(gr);
            } catch (e) {

            }
        })();
    }, [])

    const getFormProps = name => {
        return {
            name,
            value: values[name],
            onChange: changeHandler,
        }
    }
    return <Form onSubmit={submitHandler}>
        <fieldset disabled={loading}>
            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="first name"
                    {...getFormProps("firstName")}
                />
                {touched.firstName && errors.firstName && <p className="text-danger">{errors.firstName}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="last name"
                    {...getFormProps("lastName")}
                />
                {touched.lastName && errors.lastName && <p className="text-danger">{errors.lastName}</p>}
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Control
                    type="text"
                    placeholder="Patronymic"
                    {...getFormProps("patronymic")}
                />
            </Form.Group>

            <Form.Group
                className="mb-3"
            >
                <Form.Label>birthday</Form.Label>
                <Form.Control
                    type="date"
                    placeholder="birthday"
                    {...getFormProps("birthday")}
                />
                {touched.birthday && errors.birthday && <p className="text-danger">{errors.birthday}</p>}
            </Form.Group>

            <Form.Group
                className="mb-3"
            >
                <Form.Select
                    aria-label="Default select example"
                    {...getFormProps("groupId")}
                >
                    <option value=''>select group</option>
                    {
                        groups.map(group => {
                            const {
                                id,
                                name
                            } = group;
                            return <option
                                key={id}
                                value={id}
                            >
                                {name}
                            </option>
                        })
                    }
                </Form.Select>
                {touched.groupId && errors.groupId && <p className="text-danger">{errors.groupId}</p>}
            </Form.Group>
        </fieldset>

        <Button
            disabled={!isValid}
            variant="primary"
            type="submit"
            className="mb-3"
        >
            create
        </Button>
    </Form>
}
export default StudentForm;

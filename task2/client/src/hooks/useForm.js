import {useState} from "react";

function validate(validations, values) {
    const errors = validations
        .map(validation => validation(values))
        .filter(validation => typeof validation === 'object');
    return {
        isValid: errors.length === 0,
        errors: errors.reduce((errors, error) => ({...errors, ...error}), {})
    };
}

export default function useForm(initialState = {}, validations = [], onSubmit = () => {}) { // Add the 'onSubmit' argument
    const {
        isValid: initialIsValid,
        errors: initialErrors
    } = validate(validations, initialState);
    const [values, setValues] = useState(initialState);
    const [errors, setErrors] = useState(initialErrors);
    const [isValid, setValid] = useState(initialIsValid);
    const [touched, setTouched] = useState({});
    const changeHandler = event => {
        const newValues = {
            ...values,
            [event.target.name]: event.target.value
        };
        const {
            isValid,
            errors
        } = validate(validations, newValues);
        setValues(newValues);
        setValid(isValid);
        setErrors(errors);
        setTouched({
            ...touched,
            [event.target.name]: true
        });
    };

    const resetForm = () => {
        setValues(initialState);
        setValid(initialIsValid);
        setErrors(initialErrors);
        setTouched({});
    }

    const submitHandler = event => {
        event.preventDefault();
        onSubmit(values, {
            resetForm
        });
    }
    return {
        values,
        changeHandler,
        isValid,
        errors,
        touched,
        resetForm,
        submitHandler
    };
}

import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Form from "./Form";
import axios from "axios";
import config from "../../config.json";

const Update = () => {
    const {id} = useParams();
    const [task, setTask] = useState({title: ''});
    const [defaultValues, setDefaultValues] = useState({});

    const setForm = () => {
        axios
        .get(config.API_URLS.TODO.concat("/") + id)
        .then((item) => {
            delete item.data['@id'];
            setTask(item.data);

            let defaultVal = {
                users: getDefaultValue(
                    item.data.user.name + ' ' + item.data.user.last_name,
                    config.API_URLS.USERS.concat('/') + item.data.user.id
                )
            };

            if (item.data.category) {
                defaultVal.category = getDefaultValue(
                    item.data.category.name,
                    config.API_URLS.CATEGORIES.concat('/') + item.data.category.id
                );
            }

            setDefaultValues(defaultVal);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => setForm(), []);

    const getDefaultValue = (label, value) => {
        return {label: label, value: value};
    }

    return (<Form
        id={id}
        task={task}
        defaultValues={defaultValues}
    />);
};
export default Update;



import config from "../../config.json";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";

import axios from "axios";
import Alert from "@mui/material/Alert";
import Select from 'react-select'
import Categories from "./Categories";
import Header from "./Header";

import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from "dayjs";
import moment from "moment";

const Form = (prop) => {
    const navigate = useNavigate();
    const id = prop.id ? prop.id : null;
    const [isLoading, setIsLoading] = useState(false);
    const [task, setTask] = useState({title: ''});
    const [categories, setCategories] = useState([]);
    const userPrompt = {value: '', label: 'Choose user'};
    const categoryPrompt = {value: '', label: 'Choose category'};

    const [defaultValues, setDefaultValues] = useState({users: userPrompt, category: categoryPrompt});
    const [users, setUsers] = useState({options: {}, defaultValue: ''});
    const [error, setError] = useState(false);

    const handleSelect = (option, select) => {

        if (!option.value) {
            delete task[select.name];
        } else {
            setTask({...task, [select.name]: option.value});
        }

    }

    const handleInput = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setTask({...task, [name]: value});
    }

    const handleDateTime = (date, name) => {
        let options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: false,
            timeZone: "America/Los_Angeles",
        };
        let dateTime = new Intl.DateTimeFormat(undefined, options).format(date);
        setTask({...task, [name]: dateTime});
    }

    const handleDefaultValues = function () {
        const args = Array.from(arguments);

        return args?.map((item, i) => {
            return typeof item == 'object' ? item['@id'] : item;
        });
    }

    useEffect(() => {
        getUsers();
        getCategories();

        prop.task && setTask(prop.task);
        prop.defaultValues && setDefaultValues(prop.defaultValues);

    }, [prop]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        id && ([task.user] = handleDefaultValues(task.user));
        id && task.category && ([task.category] = handleDefaultValues(task.category));

        fetch(id ? config.API_URLS.TODO.concat("/") + id : config.API_URLS.TODO, {
            method: id ? "PUT" : "POST",
            headers: {"Content-Type": "application/ld+json"},
            body: JSON.stringify(task),
        })
        .then((response) => {
            var json = response.json();
            if (!response.ok) {
                json.then((e) => setError(e.detail));
                throw new Error("Form submission fail");
            }
            return json;
        })
        .then((data) => {
            navigate("/");
        })
        .catch((error) => {
            setError(error.message);
        })
    }

    const getCategories = () => {
        setIsLoading(true);

        axios
        .get(config.API_URLS.CATEGORIES)
        .then((res) => {
            const data = res.data?.map((item, i) => {
                return {value: config.API_URLS.CATEGORIES.concat('/') + item.id, label: item.name};
            });
            data.unshift(categoryPrompt);
            setCategories(data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const getUsers = () => {
        setIsLoading(true);

        axios
        .get(config.API_URLS.USERS.concat("?is_locked=false"))
        .then((res) => {
            const data = res.data?.map((item, i) => {
                return {value: config.API_URLS.USERS.concat('/') + item.id, label: item.name + ' ' + item.last_name};
            });
            data.unshift(userPrompt);
            setUsers(data);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <>
            <Header isLoading={isLoading}/>
            <div className="row">
                <Categories/>
                <div className="col-12 col-md-8 col-xl-9 pt-3">
                    <div className="d-flex flex-wrap py-1 pt-lg-3 pb-lg-2 mt-lg-1">
                        <Link to={`/`} id="message-list-back-btn"
                              className="btn btn-lighter-primary btn-tp border-0">
                            <i className="fa fa-arrow-left mr-1 text-90"/>
                            <span className="text-dark-m3">
                    Back
                    </span>
                        </Link>
                    </div>
                    <hr className="mt-2 mt-sm-1 brc-black-tp10"/>

                    {error && <Alert severity="error" onClose={() => {
                        setError(null)
                    }}>{error}</Alert>}

                    <div className=" mr-2 my-2"
                         role="document">
                        <div className="modal-content border-0 mb-2 radius-1 shadow">
                            <div className="modal-header bgc-dark-d3 border-0 text-white pt-25 pb-2">
                                <h5 className="text-110 py-0 my-0">
                                    {id ? 'Update' : 'New'} Task
                                </h5>
                            </div>
                            <div className="modal-body">
                                <form autoComplete="off" onSubmit={handleSubmit} className="d-flex flex-column">
                                    <div className="form-group row">
                                        <div className="flex-grow-1 px-3">
                                            <input type="text"
                                                   value={task.title}
                                                   onChange={handleInput}
                                                   name="title"
                                                   className="px-1 brc-grey-l2 form-control border-none border-b-1 shadow-none radius-0"
                                                   id="id-form-field-1" placeholder="Task name"/>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="flex-grow-1 px-3">
                                            {(!id || task.id) && <Select
                                                options={categories}
                                                onChange={handleSelect}
                                                name='category'
                                                defaultValue={defaultValues.category}
                                            />}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="flex-grow-1 px-3">
                                            {(!id || task.id) && <Select
                                                options={users}
                                                onChange={handleSelect}
                                                name='user'
                                                defaultValue={defaultValues.users}
                                            />}
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <div className="flex-grow-1 px-3">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer
                                                    components={['DateTimePicker', 'DateTimePicker', 'DateTimePicker']}
                                                >
                                                    <DateTimePicker
                                                        onChange={(date) => handleDateTime(date, 'taskDate')}
                                                        inputFormat="dd-MM-yyyy hh:mm"
                                                        label="Task date"
                                                        value={dayjs(task.taskDate)}
                                                        name="taskDate"
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>
                                    </div>

                                    <div className="form-group row mt-3">
                                        <div className="px-3 w-100">
                                        <textarea onChange={handleInput}
                                                  name="description"
                                                  defaultValue={task.description}
                                                  className="px-1 brc-grey-l2 form-control border-none border-b-1 shadow-none radius-0"
                                                  id="id-form-field-1"
                                                  placeholder="Description"/>
                                        </div>
                                    </div>

                                </form>

                            </div>

                            <div className="modal-footer justify-content-start bgc-secondary-l4">
                                <button onClick={handleSubmit} type="button" className="btn btn-blue py-15 px-4 ml-2">
                                    <i className="fa fa-save"/> Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Form;



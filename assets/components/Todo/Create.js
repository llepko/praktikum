import config from "../../config.json";
import React, {useEffect, useState} from "react";
import {Link, useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Select from 'react-select'
import Categories from "./Categories";
import './styles/tasks.css';

const Create = () => {
    const navigate = useNavigate();
    const {id} = useParams();

    const [category, setCategory] = useState({
        title: "",
        category: {id: "", name: ""},
        user: {id: "", name: "", last_name: ""},
        description: ""
    });

    const [categories, setCategories] = useState([]);
    const [user, setUser] = useState({options: {}, defaultValue: ''});

    const [error, setError] = useState(false);

    const setForm = () => {
        axios
        .get(config.API_URLS.TODO.concat("/") + id)
        .then((item) => {
            setCategory(item.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        if (id) {
            setForm();
        }

        getUsers();
        getCategories();
    }, []);

    const handleInput = (event) => {
        event.preventDefault();
        const {name, value} = event.target;

        setCategory({...category, [name]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        fetch(id ? config.API_URLS.TODO.concat("/") + id : config.API_URLS.TODO, {
            method: id ? "PATCH" : "POST",
            headers: {
                "Content-Type": "application/ld+json",
            },
            body: JSON.stringify(category),
        })
        .then((response) => {
            var json = response.json();

            if (!response.ok) {

                json.then((e) => {
                    if (e.status == 422) {
                        setError(e.detail);
                    }
                });

                throw new Error("Form submission fail");
            }
            return json;
        })
        .then((data) => {
            setUser({name: "", email: "", latName: ""})
            navigate("/");
        })
        .catch((error) => {
            setError(error.message);
        })
    }

    const getCategories = () => {
        axios
        .get(config.API_URLS.CATEGORIES)
        .then((res) => {
            const data = res.data?.map((item, i) => {
                return {value: config.API_URLS.CATEGORIES.concat('/') + item.id, label: item.name};
            });

            setCategories(data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const getUsers = () => {
        axios
        .get(config.API_URLS.USERS.concat("?is_locked=false"))
        .then((res) => {
            const data = res.data?.map((item, i) => {
                return {value: config.API_URLS.USERS.concat('/') + item.id, label: item.name + ' ' + item.last_name};
            });

            setUser(data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const getDefaultValue = (label, value) => {
        return {
            label: label,
            value: value
        };
    }

    return (
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
                                               value={category.title}
                                               onChange={handleInput}
                                               name="title"
                                               className="px-1 brc-grey-l2 form-control border-none border-b-1 shadow-none radius-0"
                                               id="id-form-field-1" placeholder="Title"/>
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="flex-grow-1 px-3">
                                        {(!id || (categories && category.category.id)) && <Select
                                            options={categories}
                                            defaultValue={id ? getDefaultValue(
                                                category.category.name,
                                                config.API_URLS.CATEGORIES.concat('/') + category.category.id
                                            ) : ''}
                                        />}
                                    </div>
                                </div>

                                <div className="form-group row">
                                    <div className="flex-grow-1 px-3">
                                        {(!id || (user && category.user.id)) && <Select
                                            options={user}
                                            defaultValue={id ? getDefaultValue(
                                                category.user.name + ' ' + category.user.last_name,
                                                config.API_URLS.USERS.concat('/') + category.user.id
                                            ) : ''}
                                        />}
                                    </div>
                                </div>

                                <div className="form-group row mt-3">
                                    <div className="px-3 w-100">
                                        <textarea onChange={handleInput}
                                                  name="description"
                                                  defaultValue={category.description}
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
    );
};
export default Create;



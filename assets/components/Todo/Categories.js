import config from "../../config.json";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Alert from '@mui/material/Alert';
import './styles/categories.css';

const Categories = ({sideClass}) => {
    const {categoryId} = useParams();
    const [category, setCategory] = useState([]);
    const [showClassname, setClassName] = useState(false);
    const [error, setError] = useState(null);

    const [categoryItem, setCategoryItem] = useState({
        name: "",
    });

    const activeClassName = (itemId) => {
        return itemId == categoryId ? `active` : '' // or return a default class
    }

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axios
            .get(config.API_URLS.CATEGORIES)
            .then((res) => {
                setCategory(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const setSideClass = (className) => {
        sideClass.func();
    }

    const handleInput = (event) => {
        event.preventDefault();
        const {name, value} = event.target;

        setCategoryItem({...categoryItem, [name]: value});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        fetch(config.API_URLS.CATEGORIES, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(categoryItem),
        })
            .then((response) => {
                var json = response.json();

                if (!response.ok) {
                    json.then((e) => {
                        if (e.status == 422) {
                            setError(e.detail);
                        }
                    });
                }
                return json;
            })
            .then((data) => {
                getCategories()
            })
            .catch((error) => {
            })
        setClassName(false);
        setCategoryItem({name: ""});
    }

    if (category.length < 0) {
        return <h1>no category found</h1>;
    } else {
        return (
            <div className="col-12 col-md-4 col-xl-3">
                {error && <Alert severity="error" onClose={() => {
                    setError(null)
                }}>{error}</Alert>}

                <div id="aside-menu"
                     className={(sideClass && sideClass.menu ? 'show' : '') + " modal fade modal-off-md ace-aside aside-left"}>
                    <div id="modal-dialog-category" className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content brc-dark-l4 border-y-0 border-l-0 radius-l-0">

                            <div className="modal-header d-md-none position-tr mt-n25 mr-n2 border-0">
                                <button type="button"
                                        className="btn close-btn-side btn-brc-tp btn-white btn-xs btn-h-red btn-a-red text-xl"
                                        data-dismiss="modal"
                                        onClick={() => setSideClass()}
                                        aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <div className="modal-body pt-lg-1 px-2 px-md-1 ace-scrrollbar text-right">
                                <div className="pr-2 px-lg-3 pt-lg-4">
                                    <div className="text-center mb-4">
                                        <a href="#" data-toggle="modal"
                                           onClick={() => setClassName(!showClassname)}
                                           className="btn btn-blue mr-1 py-2 text-105 radius-2">
                                            <i className="fa fa-plus mr-1"/>
                                            Category
                                        </a>
                                        <Link to={`/create`} data-toggle="modal"
                                              className="btn btn-green py-2 text-105 radius-2">
                                            <i className="fa fa-plus mr-1"/>
                                            Task
                                        </Link>
                                    </div>

                                    <form autoComplete="off"
                                          className="btn-group btn-group-toggle btn-group-vertical d-flex"
                                          data-toggle="buttons">

                                        <Link to={`/`}
                                              className={activeClassName(null) + " d-style mb-1 btn py-25 btn-outline-dark btn-h-outline-blue btn-a-outline-blue btn-a-bold w-100 btn-brc-tp border-none border-l-4 radius-l-0 radius-r-round text-left"}
                                              key={0}>
                                            All
                                            <input type="radio" name="inbox"/>
                                        </Link>

                                        {category?.map((item, i) => {
                                            return (
                                                <Link to={`/category/${item.id}`}
                                                      className={activeClassName(item.id) + " d-style mb-1 btn py-25 btn-outline-dark btn-h-outline-blue btn-a-outline-blue btn-a-bold w-100 btn-brc-tp border-none border-l-4 radius-l-0 radius-r-round text-left"}
                                                      key={i + 1}>
                                                    {item.name}
                                                    {item.todo.length > 0 ? <span
                                                        className="badge badge-pill px-3 bgc-primary-l2 text-primary-d1 float-right">{item.todo.length}</span> : ''}
                                                    <input type="radio" name="inbox"/>
                                                </Link>
                                            );
                                        })}
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div
                    className={(showClassname ? 'show' : '') + " modal modal-nb ace-aside aside-bottom aside-r aside-fade aside-offset aside-shown-above-nav"}
                    id="aside-compose" tabIndex="-1" role="dialog" aria-hidden="false">

                    <div className="modal-dialog modal-dialog-scrollable mr-2 my-2"
                         role="document">
                        <div className="modal-content border-0 mb-2 radius-1 shadow">
                            <div className="modal-header bgc-primary-d3 border-0 text-white pt-25 pb-2">
                                <h5 className="text-110 py-0 my-0">
                                    New Category
                                </h5>
                            </div>
                            <div className="modal-body">
                                <form autoComplete="off" onSubmit={handleSubmit} className="d-flex flex-column">
                                    <div className="form-group row">
                                        <div className="flex-grow-1 px-3">
                                            <input type="text"
                                                   onChange={handleInput}
                                                   name='name'
                                                   value={categoryItem.name}
                                                   className="px-1 brc-grey-l2 form-control border-none border-b-1 shadow-none radius-0"
                                                   placeholder="Name"/>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer justify-content-start bgc-secondary-l4">
                                <button onClick={handleSubmit} type="button" className="btn btn-blue py-15 px-4 ml-2">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Categories;



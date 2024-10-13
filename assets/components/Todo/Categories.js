import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import './categories.css';

const Categories = () => {
    const showCategoryApi = "/api/categoriess";

    const [category, setCategory] = useState([]);

    useEffect(() => {
        getCategories();
    }, []);

    const getCategories = () => {
        axios
        .get(showCategoryApi)
        .then((res) => {
            setCategory(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    if (category.length < 0) {
        return <h1>no category found</h1>;
    } else {
        return (
            <div className="col-12 col-md-4 col-xl-3">
                <div id="aside-menu" className="modal fade modal-off-md ace-aside aside-left">
                    <div id="modal-dialog-category" className="modal-dialog modal-dialog-scrollable">
                        <div className="modal-content brc-dark-l4 border-y-0 border-l-0 radius-l-0">

                            <div className="modal-header d-md-none position-tr mt-n25 mr-n2 border-0">
                                <button type="button"
                                        className="btn btn-brc-tp btn-white btn-xs btn-h-red btn-a-red text-xl"
                                        data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>

                            <div className="modal-body pt-lg-1 px-2 px-md-1 ace-scrollbar text-right">
                                <div className="pr-2 px-lg-3 pt-lg-4">
                                    <div className="text-center mb-4">
                                        <Link to={`#aside-compose`} data-toggle="modal"
                                              className="btn btn-blue mr-1 py-2 text-105 radius-2">
                                            <i className="fa fa-plus mr-1"/>
                                            Category
                                        </Link>
                                        <Link to={`/create`} data-toggle="modal"
                                              className="btn btn-green py-2 text-105 radius-2">
                                            <i className="fa fa-plus mr-1"/>
                                            Task
                                        </Link>
                                    </div>

                                    <form autoComplete="off"
                                          className="btn-group btn-group-toggle btn-group-vertical d-flex"
                                          data-toggle="buttons">

                                        {category?.map((item, i) => {
                                            return (
                                                <Link to={`/${item.id}`}
                                                      className="d-style mb-1 btn py-25 btn-outline-dark btn-h-outline-blue btn-a-outline-blue btn-a-bold w-100 btn-brc-tp border-none border-l-4 radius-l-0 radius-r-round text-left"
                                                      key={i}>
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
            </div>
        );
    }
};
export default Categories;



import React, {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../Common/Loader";
import Categories from "./Categories";
import './messages.css';
import {Link, useNavigate, useParams} from "react-router-dom";

const Messages = () => {
    const showTodoListApi = "/api/todo_lists";
    const {categoryId} = useParams();
    const [message, setMessage] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    const routeTask = (id) => {
        let path = `/view/` + id;
        navigate(path);
    }

    const handleActions = async (event) => {
        event.stopPropagation();
    };

    useEffect(() => {
        getTodo();
    }, [categoryId]);

    const getTodo = () => {
        axios
            .get(categoryId ? showTodoListApi.concat("?category=") + categoryId : showTodoListApi)
            .then((res) => {
                setMessage(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (message.length < 0) {
        return <h1>no Message found</h1>;
    } else {
        return (
            <div className="row">
                <Categories/>
                <div className="col-12 col-md-8 col-xl-9 pt-3" id="message-list">
                    {isLoading && <Loader/>}

                    <div className="d-flex flex-column flex-md-row pb-35 pt-2">
                        <div className="order-first order-md-last ml-md-auto mb-4 mb-md-0">
                            <div className="input-group">
                                <div className="input-group-prepend d-md-none">
                                    <button type="button"
                                            className="mr-n5 btn btn-brc-tp btn-outline-dark btn-a-green btn-h-green radius-l-1 px-25 btn-sm static"
                                            data-toggle="modal" data-target="#aside-menu">
                                        <i className="fa fa-bars"/>
                                    </button>
                                </div>
                                <input type="text"
                                       className="form-control radius-1 px-5 pl-md-3 brc-primary-tp2 brc-on-focus"
                                       placeholder="Search messages ..."/>
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-blue radius-r-1 btn-tp px-25 btn-sm ml-n475 static"
                                        type="button">
                                        <i className="fa fa-search"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>

                        {message?.map((item, i) => {
                            return (
                                <div key={i} onClick={() => routeTask(item.id)}>
                                    <hr className="brc-black-tp10 my-0"/>

                                    <div role="button"
                                         className="message-item d-flex align-items-start bgc-h-primary-l4 px-2 px-md-3 py-25 radius-2px d-style pos-rel">

                                        <img
                                            src={require("../../styles/avatar/avatar" + (Math.floor(Math.random() * 5) + 1) + ".jpg")}
                                            className="col-auto px-0 ml-2 ml-md-3 w-5 h-5 radius-round border-2 brc-white"/>

                                        <div className="ml-3 d-flex flex-column flex-lg-row align-items-lg-center">
                                            <div
                                                className="message-user mb-1 mb-lg-0 col-auto px-0 text-95 text-dark-m3">
                                                {item.user.name} {item.user.last_name}
                                            </div>
                                            <div
                                                className="message-text ml-lg-3 ml-lg-5 pr-1 pr-lg-0 text-90  text-dark-m3 pos-rel">
                                                <span className="p-1 bgc-blue radius-round d-inline-block mr-1"/>
                                                {item.title}
                                            </div>
                                        </div>

                                        <div
                                            className="message-time d-none d-lg-flex align-items-center ml-auto pl-2 col-auto text-nowrap pr-0 pl-1 text-90">
                                            {new Date(item.created_at).toLocaleString('en-us', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <div
                                            className="position-tr mt-15 w-auto message-time d-flex d-lg-none align-items-center text-nowrap  text-90">
                                            {new Date(item.created_at).toLocaleString('en-us', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>

                                        <div
                                            onClick={handleActions}
                                            className="message-actions position-r mr-1 v-hover p-15 bgc-white-tp1 shadow-sm radius-2px">
                                            <a href="#"
                                               className="btn btn-tp border-0 btn-text-danger btn-light-danger mr-2px px-2">
                                                <i className="fa fa-trash-alt text-danger-m1 w-2"/>
                                            </a>

                                            <Link to={`/update/` + item.id}
                                                  className="btn btn-tp border-0 btn-text-info btn-light-info px-2">
                                                <i className="fa fa-pencil-alt w-2"/>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                    <div className="bgc-default-l4 p-3 align-items-center d-flex w-100">
                        <div>
                            Showing <span className="text-600">1</span> - <span className="text-600">10</span>
                            of more than
                            <span className="text-600">1000</span> messages
                        </div>

                        <div className="ml-auto">
                            <nav className="d-inline-block" aria-label="Inbox navigation">
                                <ul className="pagination align-items-center d-inline-flex mb-0">
                                    <li className="page-item mr-1">
                                        <a className="page-link btn py-2 px-25 btn-sm border-2 brc-sec1ondary-l1 radius-r-0 text-600 btn-bgc-white btn-lighter-secondary btn-h-default btn-a-default"
                                           href="#">
                                            <i className="fa fa-chevron-left"/>
                                        </a>
                                    </li>

                                    <li className="page-item">
                                        <a className="page-link btn py-2 px-25 btn-sm border-2 brc-sec1ondary-l1 radius-l-0 text-600 btn-bgc-white btn-lighter-secondary btn-h-default btn-a-default"
                                           href="#">
                                            <i className="fa fa-chevron-right"/>
                                        </a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};
export default Messages;



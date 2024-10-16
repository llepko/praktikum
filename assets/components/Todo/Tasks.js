import config from "../../config.json";
import React, {useEffect, useState} from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import Header from "./Header";

const Tasks = () => {
    const {categoryId} = useParams();
    const [task, setTask] = useState([]);
    const [search, setSearch] = useState({title: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [pagination, setPagination] = useState({});
    const [showMenu, setMenu] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    const routeTask = (id) => {
        let path = `/view/` + id;
        navigate(path);
    }
    const handleSearch = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        setSearch({...search, [name]: value});
    }

    const handleActions = async (event) => event.stopPropagation();

    useEffect(() => {
        getTodo();
    }, [categoryId, search.title]);

    const getTodo = (url) => {
        setIsLoading(true);

        let params = [];

        if (categoryId) {
            params.push(['category', categoryId])
        }
        if (search.title) {
            params = [
                ['title', search.title],
                ['user.name', search.title],
                ['user.last_name', search.title]
            ];
        }
        let urlArgs = (new URLSearchParams(params)).toString();
        urlArgs = urlArgs.toString();

        url = url ? url.concat("&") + urlArgs : config.API_URLS.TODO.concat("?") + urlArgs

        axios
        .get(url)
        .then((res) => {
            setTask(res.data['hydra:member']);
            setPagination(res.data['hydra:view']);
            setIsLoading(false);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    const handelDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(config.API_URLS.TODO.concat("/") + id, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            setTask(task.filter((item) => item.id !== id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const triggerSetMenu = () => setMenu(!showMenu);

    if (task.length < 0) {
        return <h1>no Task found</h1>;
    } else {
        return (
            <>
                <Header isLoading={isLoading}/>
                <div className="row">
                    <Categories isShowMenu={showMenu} setMenuClass={triggerSetMenu}/>
                    <div className="col-12 col-md-8 col-xl-9 pt-3" id="message-list">
                        <div className="d-flex flex-column flex-md-row pb-35 pt-2">
                            <div className="order-first order-md-last ml-md-auto mb-4 mb-md-0">
                                <div className="input-group">
                                    <div className="input-group-prepend d-md-none">
                                        <button type="button"
                                                onClick={() => triggerSetMenu()}
                                                className="mr-n5 btn btn-brc-tp btn-outline-dark btn-a-green btn-h-green radius-l-1 px-25 btn-sm static"
                                                data-toggle="modal" data-target="#aside-menu">
                                            <i className="fa fa-bars"/>
                                        </button>
                                    </div>
                                    <input type="text"
                                           onChange={handleSearch}
                                           name="title"
                                           value={search.title}
                                           className="form-control radius-1 px-5 pl-md-3 brc-primary-tp2 brc-on-focus"
                                           placeholder="Search messages ..."/>
                                    <div className="input-group-append">
                                        <button
                                            className="btn radius-r-1 btn-tp px-25 btn-sm ml-n475 static"
                                            type="button">
                                            <i className="fa fa-search"/>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {task?.map((item, i) => {
                            return (
                                <div key={i} onClick={() => routeTask(item.id)}>
                                    <hr className="brc-black-tp10 my-0"/>

                                    <div role="button"
                                         className="message-item d-flex align-items-start bgc-h-primary-l4 px-2 px-md-3 py-25 radius-2px d-style pos-rel">

                                        <img
                                            src={require("./styles/avatar/avatar1.jpg")}
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
                                               onClick={() => handelDelete(item.id)}
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
                        <div className="bgc-default-l4 p-3 align-items-center d-flex w-100">
                            <div className="ml-auto">
                                <nav className="d-inline-block" aria-label="Inbox navigation">
                                    <ul className="pagination align-items-center d-inline-flex mb-0">
                                        <li className="page-item mr-1">
                                            <a
                                                onClick={() => getTodo(pagination['hydra:previous'])}
                                                className={(pagination['hydra:previous'] ? '' : 'disabled') + " page-link btn py-2 px-25 btn-sm border-2 brc-sec1ondary-l1 radius-r-0 text-600 btn-bgc-white btn-lighter-secondary btn-h-default btn-a-default"}
                                                href="#">
                                                <i className="fa fa-chevron-left"/>
                                            </a>
                                        </li>

                                        <li className="page-item">
                                            <a
                                                onClick={() => getTodo(pagination['hydra:next'])}
                                                className={(pagination['hydra:next'] ? '' : 'disabled') + " page-link btn py-2 px-25 btn-sm border-2 brc-sec1ondary-l1 radius-l-0 text-600 btn-bgc-white btn-lighter-secondary btn-h-default btn-a-default"}
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
            </>
        );
    }
};
export default Tasks;



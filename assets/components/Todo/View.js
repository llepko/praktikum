import config from "../../config.json";
import React, {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";

const View = () => {
    const [message, setMessage] = useState([]);
    const {id} = useParams();

    useEffect(() => {
        getMessage();
    }, []);

    const getMessage = () => {
        axios
        .get(config.API_URLS.TODO.concat("/") + id)
        .then((item) => {
            setMessage(item.data);
        })
        .catch((err) => {
            console.log(err);
        });
    };

    return (
        <div className="row">
            <Categories/>
            <div className="col-12 col-sm-8 col-xl-9 pt-3" id="message-view">
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
                <div className="d-flex flex-column flex-md-row">
                    <div>
                        <h3 className="mt-2 mb-3 text-130 d-inline-flex align-items-center">
                      <span className="mx-2">
                        {message.title}
                    </span>
                        </h3>
                        <div className="d-flex align-items-center">
                            <img
                                src={require("../../styles/avatar/avatar" + (Math.floor(Math.random() * 5) + 1) + ".jpg")}
                                className="col-auto px-0 ml-2 ml-md-3 w-5 h-5 radius-round border-2 brc-white"/>

                            <div className="ml-2">
                                <a href="#" className="text-600">
                                    {message.user ? message.user.name : ''} {message.user ? message.user.last_name : ''}
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="ml-auto text-right mt-2 mt-md-0">
                        <span className="text-sm text-grey mr-2">
                            {new Date(message.created_at).toLocaleString('en-us', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>
                <div className="mt-4">
                    {message.description}
                </div>
            </div>
        </div>
    );
};
export default View;



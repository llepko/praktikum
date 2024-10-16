import axios from "axios";
import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom";
import Loader from "./Loader";
import "./User.css";
import Header from "./Header";

const EditUser = () => {
    const [user, setUser] = useState([]);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const {id} = useParams();
    const navigate = useNavigate();
    const getUserApi = "/api/users";

    useEffect(() => {
        getUser();
    }, []);

    const getUser = () => {
        axios
            .get(getUserApi.concat("/") + id)
            .then((item) => {
                setUser(item.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handelInput = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        console.log(name, value);
        setUser({...user, [name]: value});
    };

    const handelSubmit = (e) => {
        e.preventDefault();

        fetch(getUserApi.concat("/") + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
        })
            .then((response) => {
                var json = response.json();

                if (!response.ok) {
                    json.then((e) => {
                        if (e.status == 422) {
                            setError(e.detail);
                        }
                    });

                    throw new Error("Network response was not ok");
                }
                return json;
            })
            .then((data) => {
                setIsLoading(true);
                navigate("/list-user");
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            })
    };

    return (
        <div>
            <Header/>
            <div className="user-form">
                <div className="heading">
                    {isLoading && <Loader/>}
                    {error && <p>Error: {error}</p>}
                    <p>Edit Form</p>
                </div>
                <form onSubmit={handelSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                            Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            name="name"
                            value={user.name || ''}
                            onChange={handelInput}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">
                            Last Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="lastName"
                            value={user.lastName || ''}
                            onChange={handelInput}
                        />
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={user.email || ''}
                            onChange={handelInput}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary submit-btn bg-dark">
                        EDIT
                    </button>
                </form>
            </div>
        </div>
    );
};
export default EditUser;

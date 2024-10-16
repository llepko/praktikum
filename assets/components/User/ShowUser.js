import React, {useEffect, useState} from "react";
import axios from "axios";
import {Link} from "react-router-dom";
import Loader from "./Loader";
import Header from "./Header";

import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';

const ShowUser = () => {
    const showUserApi = "/api/users";

    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handelDelete = async (id) => {
        setIsLoading(true);
        try {
            const response = await fetch(showUserApi.concat("/") + id, {
                method: "DELETE",
            });
            if (!response.ok) {
                throw new Error("Failed to delete item");
            }
            setUser(user.filter((item) => item.id !== id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = () => {
        axios
            .get(showUserApi)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    if (user.length < 0) {
        return <h1>no user found</h1>;
    } else {
        return (
            <div>
                <Header/>
                <div className="mt-5">
                    {isLoading && <Loader/>}
                    {error && <p>Error: {error}</p>}
                    <table className="table table-striped table-user">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Last name</th>
                            <th>Email</th>
                            <th>Created</th>
                            <th>Is Locked</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {user?.map((item, i) => {
                            return (
                                <tr key={i + 1}>
                                    <td>{i + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.lastName}</td>
                                    <td>{item.email}</td>
                                    <td>{item.createdAt ? item.createdAt : ''}</td>
                                    <th>{item.isLocked ? <p className="text-danger">Yes</p> :
                                        <p className="text-success">No</p>}</th>
                                    <td>
                                        <Link to={`/edit-user/${item.id}`}>
                                            <i className="fa fa-pencil-alt" aria-hidden="true"></i>
                                        </Link>
                                        <Link to={`/view-user/${item.id}`}>
                                            <i className="fa fa-eye" aria-hidden="true"></i>
                                        </Link>

                                        <i
                                            className="fa fa-trash"
                                            aria-hidden="true"
                                            onClick={() => handelDelete(item.id)}
                                        ></i>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};

export default ShowUser;

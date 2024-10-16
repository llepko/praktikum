import axios from "axios";
import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import "./User.css";
import Header from "./Header";

const EditUser = () => {
    const [user, setUser] = useState([]);
    const {id} = useParams();
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

    return (
        <div>
            <Header/>
            <div className="user mt-5">
                <table className="table table-bordered">
                    <tbody>
                    <tr>
                        <td>Name</td>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <td>Last name</td>
                        <td>{user.lastName}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <td>Is Locked</td>
                        <td>{user.locked ? <p className="text-danger">Yes</p> :
                            <p className="text-success">No</p>}</td>
                    </tr>
                    <tr>
                        <td>Created</td>
                        <td>{user.createdAt}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default EditUser;

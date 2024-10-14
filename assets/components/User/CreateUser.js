import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import Loader from '../Common/Loader';
import './User.css';
import Header from "../Common/Header";

const CreateUser = () => {
    const navigate = useNavigate();
    const createUserApi = "/api/users"
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        lastName: ""
    })

    const handelInput = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        console.log(name, value)
        setUser({...user, [name]: value});
    }

    const handelSubmit = async (event) => {
        event.preventDefault();

        fetch(createUserApi, {
            method: "POST",
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

                    throw new Error("Form submission fail");
                }
                return json;
            })
            .then((data) => {
                setIsLoading(true);
                setUser({name: "", email: "", latName: ""})
                navigate("/list-user");
            })
            .catch((error) => {
                setError(error.message);
                setIsLoading(false);
            })
    }

    return (
        <div>
            <Header/>
            <div className='user-form'>
                <div className='heading'>
                    {isLoading && <Loader/>}
                    {error && <p>Error: {error}</p>}
                    <p>User Form</p>
                </div>
                <form onSubmit={handelSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input type="text" className="form-control" id="name" name="name" value={user.name}
                               onChange={handelInput}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">Last name</label>
                        <input type="text" className="form-control" id="lastName" name="lastName" value={user.lastName}
                               onChange={handelInput}/>
                    </div>
                    <div className="mb-3 mt-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" className="form-control" id="email" name="email" value={user.email}
                               onChange={handelInput}/>
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn bg-dark">Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreateUser
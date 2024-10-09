import React, { useState } from 'react'
import {useNavigate } from "react-router-dom";
import Loader from '../Common/Loader';
import './User.css';
const CreateUser = () => {
    const navigate = useNavigate();
    const createUserApi = "/user"
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState({
        name: "",
        email: "",
        lastName: ""
    })

    const handelInput = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        console.log(name, value)
        setUser({ ...user, [name]: value });
    }

    const handelSubmit = async (event) => {
        event.preventDefault();
        console.log(user)
        try {
            setIsLoading(true);
            const response = await fetch(createUserApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });

            if (response.ok) {
                console.log('Form submitted successfully!');
                setUser({name: "",email: "",latName: ""})
                navigate('/');
            } else {
                console.error('Form submission fail');
            }

        } catch (error) {
            setError(error.message);
        } finally{
            setIsLoading(false);
        }
    }

    return (
        <div className='user-form'>
            <div className='heading'>
            {isLoading && <Loader />}
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
    )
}

export default CreateUser
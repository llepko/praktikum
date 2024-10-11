
import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Header from "./components/Common/Header";
import ShowUser from "./components/User/ShowUser";
import EditUser from "./components/User/EditUser";
import User from "./components/User/User";
import CreateUser from "./components/User/CreateUser";
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import './styles/ace.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <div className="App">
            <header className="container">
                <div className="">
                    <Header/>
                    <Routes>
                        <Route path="/" element={<ShowUser/>}/>
                        <Route path="/edit-user/:id" element={<EditUser/>}/>
                        <Route path="/view-user/:id" element={<User/>}/>
                        <Route path="/create-user" element={<CreateUser/>}/>
                    </Routes>
                </div>
            </header>
        </div>
    </BrowserRouter>
);


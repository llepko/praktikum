import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import View from "./components/Todo/View";
import Messages from "./components/Todo/Messages";
import Create from "./components/Todo/Create";
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import './styles/ace.css';
import ShowUser from "./components/User/ShowUser";
import EditUser from "./components/User/EditUser";
import User from "./components/User/User";
import CreateUser from "./components/User/CreateUser";

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Messages/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/update/:id" element={<Create/>}/>
            <Route path="/view/:id" element={<View/>}/>

            <Route path="/list-user" element={<ShowUser/>}/>
            <Route path="/edit-user/:id" element={<EditUser/>}/>
            <Route path="/view-user/:id" element={<User/>}/>
            <Route path="/create-user" element={<CreateUser/>}/>
        </Routes>
    </BrowserRouter>
);

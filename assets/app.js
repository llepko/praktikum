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

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Messages/>}/>
            <Route path="/create" element={<Create/>}/>
            <Route path="/update/:id" element={<Create/>}/>
            <Route path="/view/:id" element={<View/>}/>
        </Routes>
    </BrowserRouter>
);

import React from "react";
import { Link } from "react-router-dom";
import "./Common.css";
export default function Header() {
  return (
    <div>
      <nav className=" navbar-dark bg-dark">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" href="#">
            <span className="navbar-text">Praktikum App</span>
          </Link>

          <div className=" navbar-collapse" id="mynavbar">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="create-user">
                  Create User
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}

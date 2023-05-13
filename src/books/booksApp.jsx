import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import Books from "./books.jsx";
import "../navbar/navbar.css"

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <div className="app">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="table-container">
                <Books />
            </div>
        </div>
    </React.StrictMode>
)


import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import Remainder from "./remainder.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <div className="app">
            <div className="navbar-container">
                <Navbar />
            </div>
            <div className="table-container">
                <Remainder />
            </div>
        </div>
    </React.StrictMode>
)


import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import Books from "./books.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Navbar />
        <Books />
    </React.StrictMode>
)


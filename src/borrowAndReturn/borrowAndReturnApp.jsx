import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import BorrowAndReturn from "./borrowAndReturn.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Navbar />
        <BorrowAndReturn />
    </React.StrictMode>
)


import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import Readers from "./readers.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Navbar />
        <Readers />
    </React.StrictMode>
)


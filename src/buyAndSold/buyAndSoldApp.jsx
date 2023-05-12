import React from "react";
import ReactDOM from "react-dom/client";
import Navbar from "../navbar/navbar.jsx";
import BuyAndSold from './buyAndSold.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Navbar />
        <BuyAndSold />
    </React.StrictMode>
)


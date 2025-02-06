// src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Sidebar.css";

const Sidebar = ({ role }) => {
  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/login";
  };

  return (
    <div className="sidebar">
      <h2>{role === "customer" ? "Customer" : "Support Agent"} Dashboard</h2>
      <ul>
        <li>
          <Link to={role === "customer" ? "/customer-dashboard" : "/support-dashboard"}>Tickets</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
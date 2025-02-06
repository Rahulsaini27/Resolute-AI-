// src/pages/SupportDashboard.js
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import "./SupportDashboard.css";

const SupportDashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const querySnapshot = await getDocs(collection(db, "tickets"));
      const ticketsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTickets(ticketsData);
    };
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId, status) => {
    await updateDoc(doc(db, "tickets", ticketId), { status });
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, status } : ticket)));
  };

  return (
    <div className="dashboard">
      <Sidebar role="agent" />
      <div className="content">
        <h1>Support Dashboard</h1>
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created By</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>
                <td>{ticket.priority}</td>
                <td>
                  <select value={ticket.status} onChange={(e) => handleUpdateStatus(ticket.id, e.target.value)}>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td>{ticket.createdBy}</td>
                <td>{ticket.assignedTo}</td>
                <td>
                  <button>View</button>
                  <button>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupportDashboard;
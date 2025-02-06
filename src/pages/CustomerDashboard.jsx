// src/pages/CustomerDashboard.js
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import Sidebar from "../components/Sidebar";
import TicketForm from "../components/TicketForm";
import "./CustomerDashboard.css";

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        setError("");

        // Ensure user is logged in
        if (!auth.currentUser) {
          setError("You must be logged in to view tickets.");
          setLoading(false);
          return;
        }

        const q = query(collection(db, "tickets"), where("createdBy", "==", auth.currentUser.uid));
        const querySnapshot = await getDocs(q);
        const ticketsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        setTickets(ticketsData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load tickets. Please try again.");
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleDelete = async (ticketId) => {
    try {
      await deleteDoc(doc(db, "tickets", ticketId));
      setTickets(tickets.filter((ticket) => ticket.id !== ticketId));
    } catch (err) {
      console.error("Error deleting ticket:", err);
      alert("Failed to delete ticket. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <Sidebar role="customer" />
      <div className="content">
        <h1>Customer Dashboard</h1>

        {/* Raise Ticket Button */}
        <button className="raise-ticket-btn" onClick={() => setShowModal(true)}>
          Raise Ticket
        </button>

        {/* Ticket Form Modal */}
        {showModal && <TicketForm onClose={() => setShowModal(false)} />}

        {/* Error Message */}
        {error && <p className="error">{error}</p>}

        {/* Loading Indicator */}
        {loading && <p>Loading tickets...</p>}

        {/* Tickets List */}
        {!loading && tickets.length === 0 && <p>No tickets found. Raise a new ticket to get started!</p>}
        {!loading && tickets.length > 0 && (
          <ul className="ticket-list">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="ticket-item">
                <div className="ticket-info">
                  <h3>{ticket.title}</h3>
                  <p>{ticket.description}</p>
                </div>
                <button className="delete-btn" onClick={() => handleDelete(ticket.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;

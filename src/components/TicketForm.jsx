import React, { useState } from "react";
import { db, auth, storage, database } from "../firebase"; // Ensure you're importing from firebase.js
import { addDoc, collection } from "firebase/firestore";
import { getDatabase, ref, set } from "firebase/database";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage"; // Firebase Storage imports
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import "./TicketForm.css";

const TicketForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "Low",
    category: "General",
    dueDate: "",
    contactEmail: "",
    phone: "",
    preferredContact: "email",
    termsAccepted: false,
    attachment: null, // File attachment
  });

  // Handle text, email, and select inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      attachment: e.target.files[0],
    }));
  };

  // Function to upload attachment to Firebase Storage
  const uploadAttachmentToStorage = async (file) => {
    const storageReference = storageRef(storage, `tickets/${file.name}`);
    await uploadBytes(storageReference, file);
    const downloadURL = await getDownloadURL(storageReference); // Get the download URL of the uploaded file
    return downloadURL;
  };

  // Function to store ticket data in Firestore
  const submitToFirestore = async () => {
    try {
      let attachmentURL = null;
      if (formData.attachment) {
        attachmentURL = await uploadAttachmentToStorage(formData.attachment); // Upload file to storage and get URL
      }

      const ticketData = {
        ...formData,
        attachment: attachmentURL, // Save URL of uploaded file
        createdBy: auth.currentUser?.uid || "Anonymous",
        status: "Open",
        assignedTo: "",
        createdAt: new Date(),
      };

      // Add the ticket data to Firestore
      await addDoc(collection(db, "tickets"), ticketData);
      console.log("Ticket successfully stored in Firestore!");
    } catch (error) {
      console.error("Error writing to Firestore:", error);
      alert("Failed to submit ticket. Please try again.");
    }
  };

  // Function to store ticket data in Firebase Realtime Database (if needed)
  const submitToRealtimeDB = async () => {
    try {
      const userId = uuidv4(); // Generate a unique ID for the user
      await set(ref(database, `tickets/${userId}`), formData); // Save ticket data to Realtime Database
      console.log("Ticket successfully stored in Realtime Database!");
    } catch (error) {
      console.error("Error writing to Firebase Realtime Database:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Ensure the user accepts the terms and conditions
    if (!formData.termsAccepted) {
      alert("You must accept the terms and conditions.");
      return;
    }

    // Submit ticket data to both Firestore and Realtime Database
    await submitToRealtimeDB();
    await submitToFirestore();

    // Alert and close the form after submission
    alert("Ticket submitted successfully!");
    onClose(); // Close the modal
  };

  return (
    <div className="ticket-form-modal">
      <div className="ticket-form">
        <h2>Raise a Ticket</h2>
        <form onSubmit={handleSubmit} className="ticket-form-grid responsive-grid">
          {/* Title and Email */}
          <div className="form-group">
            <input
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="contactEmail"
              placeholder="Contact Email"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>

          {/* Due Date and Phone */}
          <div className="form-group">
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>

          {/* Priority and Category */}
          <div className="form-group">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="General">General</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Feature Request">Feature Request</option>
            </select>
          </div>

          {/* Preferred Contact */}
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="preferredContact"
                value="email"
                checked={formData.preferredContact === "email"}
                onChange={handleChange}
              />{" "}
              Email
            </label>
            <label>
              <input
                type="radio"
                name="preferredContact"
                value="phone"
                checked={formData.preferredContact === "phone"}
                onChange={handleChange}
              />{" "}
              Phone
            </label>
          </div>

          {/* Terms and Conditions */}
          <label className="checkbox">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
            />{" "}
            I accept the terms and conditions.
          </label>

          {/* File Upload */}
          <input type="file" name="attachment" onChange={handleFileChange} />

          {/* Submit and Cancel */}
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;

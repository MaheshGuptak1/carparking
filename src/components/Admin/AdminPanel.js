import React, { useState, useEffect } from 'react';
import './AdminPanel.css';

function AdminPanel() {
  const [bookings, setBookings] = useState([]);
  const [extraHours, setExtraHours] = useState('');
  const [selectedBookingIndex, setSelectedBookingIndex] = useState(null);

  // Fetch the bookings from localStorage when the component mounts
  useEffect(() => {
    const storedBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    console.log(storedBookings); // Check the stored format
    setBookings(storedBookings);
  }, []);

  // Handle deletion of a booking
  const handleDelete = (index) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    setBookings(updatedBookings); // Update state to reflect deletion
  };


  const handleExtraHoursSubmit = () => {
    if (extraHours && extraHours > 0 && selectedBookingIndex !== null) {
      const updatedBookings = [...bookings];
      const booking = updatedBookings[selectedBookingIndex];
  
      // Calculate the additional amount
      const extraAmount = extraHours * 300;
      const newTotalAmount = booking.totalAmount + extraAmount;
  
      // Parse the custom start time format (DD/MM/YYYY, HH:mm:ss)
      const parseCustomDate = (dateString) => {
        const [date, time] = dateString.split(', ');
        const [day, month, year] = date.split('/').map(Number);
        const [hours, minutes, seconds] = time.split(':').map(Number);
        return new Date(year, month - 1, day, hours, minutes, seconds);
      };
  
      let currentTime = parseCustomDate(booking.startTime);
  
      // Check if it's a valid Date object
      if (isNaN(currentTime.getTime())) {
        alert('Invalid start time format.');
        return;
      }
  
      // Calculate the new end time by adding the extra hours
      const calculatedEndTime = new Date(currentTime.getTime() + extraHours * 3600 * 1000);
  
      // Format the new end time back to the custom format
      const formatCustomDate = (date) => {
        const pad = (n) => (n < 10 ? `0${n}` : n);
        return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}, ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
      };
  
      booking.endTime = formatCustomDate(calculatedEndTime);
  
      // Update booking with the new total amount
      booking.totalAmount = newTotalAmount;
      booking.hours = parseInt(booking.hours) + parseInt(extraHours);
  
      // Save the updated bookings to localStorage
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      setBookings(updatedBookings);
  
      // Reset fields
      setExtraHours('');
      setSelectedBookingIndex(null);
    } else {
      alert('Please enter a valid number of extra hours.');
    }
  };
  

  return (
    <div className="admin-panel-container">
      <h2 className="admin-title">Admin Panel - Parking Bookings</h2>
      
      {/* Table to display bookings */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Hours</th>
            <th>Slot</th>
            <th>Amount Paid</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Action 1</th>
            <th>Action 2</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index) => (
            <tr key={index}>
              <td>{booking.username}</td>
              <td>{booking.hours}</td>
              <td>{booking.slot}</td>
              <td>{`₹${booking.totalAmount}`}</td>
              <td>{booking.startTime}</td> {/* Display formatted start time */}
              <td>{booking.endTime || 'Not Set'}</td> {/* Display end time or 'Not Set' */}
              <td>
                {/* Add Extra Hours */}
                <button className="extra-hours-button" onClick={() => setSelectedBookingIndex(index)}>
                  Add Extra Hours
                </button>
              </td>
              <td>
                {/* Delete button */}
                <button className="delete-button" onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Display extra hours input and submit button if a booking is selected */}
      {selectedBookingIndex !== null && (
        <div className="extra-hours-container">
          <h3>Add Extra Hours</h3>
          <label>
            Extra Hours:
            <input
              type="number"
              min="1"
              value={extraHours}
              onChange={(e) => setExtraHours(e.target.value)}
            />
          </label>
          <button className="submit-button" onClick={handleExtraHoursSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;

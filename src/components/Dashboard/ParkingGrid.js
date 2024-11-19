import React, { useState, useEffect } from 'react';
import './ParkingGrid.css';

function ParkingGrid({ handleLogout }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [hours, setHours] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [timer, setTimer] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [endTime, setEndTime] = useState(''); // Store calculated end time

  const floors = 3;
  const slotsPerFloor = 10;
  const slots = [];

  // Generate parking slots
  for (let i = 1; i <= floors; i++) {
    let floorSlots = [];
    for (let j = 1; j <= slotsPerFloor; j++) {
      floorSlots.push(`Floor ${i} Slot ${j}`);
    }
    slots.push(floorSlots);
  }

  // Fetch booked slots from localStorage on load
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const booked = bookings.map((booking) => booking.slot);
    setBookedSlots(booked);
  }, []);

  // Retrieve the current user from localStorage
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  useEffect(() => {
    if (isTimerRunning && timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);

      return () => clearInterval(interval); // Cleanup the interval on unmount or timer end
    }
  }, [isTimerRunning, timer]);

  const handleSlotSelection = (slot) => {
    const userBookings = JSON.parse(localStorage.getItem('bookings')) || [];
    if (userBookings.some(booking => booking.username === currentUser.username)) {
      alert('You can only book one slot at a time.');
      return;
    }

    if (!bookedSlots.includes(slot)) {
      setSelectedSlot(slot);
    } else {
      alert('This slot is already booked. Please select another slot.');
    }
  };

  // Listen for changes to the bookings in localStorage
  useEffect(() => {
    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    const userBooking = bookings.find(booking => booking.username === currentUser.username);
    if (userBooking) {
      setBookingDetails(userBooking);
      setHours(userBooking.hours);
      setEndTime(userBooking.endTime);
    }
  }, [hours]);

  const handleSubmit = () => {
    const hourlyCharge = 300;

    if (currentUser && selectedSlot && hours && hours > 0) {
      const total = hours * hourlyCharge;
      setTotalAmount(total);

      // Initialize the timer in seconds (hours * 3600)
      const initialTimer = hours * 3600;

      setTimer(initialTimer);
      setIsTimerRunning(true);

      const uniqueCode = Math.floor(Math.random() * 1000000);

      alert(
        `Your unique code is: ${uniqueCode}. Total amount: ₹${total}. Show this code at the parking area to park.`
      );

      // Calculate end time based on hours and current time
      const currentTime = new Date();
      const calculatedEndTime = new Date(currentTime.getTime() + hours * 3600 * 1000).toLocaleString();
      setEndTime(calculatedEndTime);

      // Save booking data to localStorage
      const bookingdata = {
        username: currentUser.username,
        hours,
        slot: selectedSlot,
        totalAmount: total,
        startTime: currentTime.toLocaleString(),
        endTime: calculatedEndTime, // Save the calculated end time
      };

      const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
      bookings.push(bookingdata);
      localStorage.setItem('bookings', JSON.stringify(bookings));

      setBookedSlots((prev) => [...prev, selectedSlot]);
      setSelectedSlot(null);
      setHours('');
      setTotalAmount(0);
      setBookingDetails(bookingdata);
    } else {
      alert('Please select a slot and enter a valid number of hours.');
    }
  };

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (timer === 0) {
      setIsTimerRunning(false);
    }
  }, [timer]);

  const showBookingData = () => {
    return (
      bookingDetails && (
        <div className="booking-summary">
          <h3>Your Booking</h3>
          <p><strong>Username:</strong> {bookingDetails.username}</p>
          <p><strong>Slot:</strong> {bookingDetails.slot}</p>
          <p><strong>Total Amount:</strong> ₹{bookingDetails.totalAmount}</p>
          <p><strong>From:</strong> {bookingDetails.startTime}</p>
          <p><strong>To:</strong> {endTime}</p> {/* Display updated end time */}
          <p><strong>Upto Hours:</strong> {bookingDetails.hours}</p>
        </div>
      )
    );
  };

  return (
    <div>
      <header className="header">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Display booked slot details at the top of the page */}
      {showBookingData()}

      <h2>Hi {currentUser ? currentUser.username : 'Guest'}!</h2>
      <h3>Select a Parking Slot</h3>
      <div className="parking-grid">
        {slots.map((floor, index) => (
          <div key={index}>
            <h3>Floor {index + 1}</h3>
            <div className="floor-slots">
              {floor.map((slot, idx) => (
                <button
                  key={idx}
                  className={`slot ${bookedSlots.includes(slot) ? 'booked' : 'available'} ${selectedSlot === slot ? 'selected' : ''}`}
                  onClick={() => handleSlotSelection(slot)}
                  disabled={bookedSlots.includes(slot)}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <h3>Booking Details</h3>
      <div>
        <label>
          Hours:
          <input
            type="number"
            min="1"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
      </div>
      <div>
        <p>Selected Slot: {selectedSlot}</p>
        <p>Total Amount: ₹{totalAmount}</p>
      </div>
      <button onClick={handleSubmit}>Submit</button>

      {/* Display countdown timer */}
      {isTimerRunning && (
        <div className="timer">
          <h3>Time Remaining</h3>
          <p>{formatTime(timer)}</p>
        </div>
      )}
    </div>
  );
}

export default ParkingGrid;

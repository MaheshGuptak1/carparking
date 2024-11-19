import React, { useState } from 'react';
import { getFromLocalStorage, saveToLocalStorage } from '../../utils/localStorageManager';

const ReservationForm = ({ selectedSpot, setSelectedSpot }) => {
    const [hours, setHours] = useState(1);

    const handleReserve = () => {
        const spots = getFromLocalStorage('spots') || [];
        const currentUser = getFromLocalStorage('currentUser');

        spots[selectedSpot] = {
            status: 'reserved',
            reservedBy: currentUser.username,
            endTime: new Date(Date.now() + hours * 60 * 60 * 1000),
        };

        saveToLocalStorage('spots', spots);
        setSelectedSpot(null);
        alert('Spot reserved successfully!');
    };

    return selectedSpot !== null ? (
        <div>
            <h3>Reserve Spot {selectedSpot + 1}</h3>
            <label>
                Hours:
                <input type="number" value={hours} onChange={(e) => setHours(Number(e.target.value))} />
            </label>
            <button onClick={handleReserve}>Confirm Reservation</button>
        </div>
    ) : null;
};

export default ReservationForm;

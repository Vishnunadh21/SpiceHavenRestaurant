// Place this file in your public directory to connect frontend with backend

const API_URL = 'http://localhost:3000/api';

// Table functions
async function getTables(date, time) {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    if (time) params.append('time', time);
    
    const response = await fetch(`${API_URL}/tables?${params}`);
    return response.json();
}

// Reservation functions
async function createReservation(reservationData) {
    const response = await fetch(`${API_URL}/reservations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reservationData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create reservation');
    }
    
    return response.json();
}

// Order functions
async function saveOrder(orderData) {
    const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save order');
    }
    
    return response.json();
}
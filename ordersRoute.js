const express = require('express');
const router = express.Router();
const { ORDERS_FILE, RESERVATIONS_FILE } = require('./app');
const { readData, writeData } = require('./dataUtils');

// Get all orders
router.get('/api/orders', (req, res) => {
    try {
        const orders = readData(ORDERS_FILE);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new order
router.post('/api/orders', (req, res) => {
    try {
        const { reservationId, items } = req.body;
        
        if (!reservationId || !items || !items.length) {
            return res.status(400).json({ error: 'Missing reservation ID or items' });
        }
        
        // Check if reservation exists
        const reservations = readData(RESERVATIONS_FILE);
        const reservation = reservations.find(r => r.id === reservationId);
        
        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }
        
        const orders = readData(ORDERS_FILE);
        const newOrder = {
            id: Date.now().toString(),
            reservationId,
            items,
            totalPrice: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            createdAt: new Date().toISOString()
        };
        
        orders.push(newOrder);
        writeData(ORDERS_FILE, orders);
        
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
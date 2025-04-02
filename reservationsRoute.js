const express = require('express');
const router = express.Router();
const { RESERVATIONS_FILE, TABLES_FILE } = require('./app');
const { readData, writeData } = require('./dataUtils');

// Get all reservations
router.get('/api/reservations', (req, res) => {
    try {
        const reservations = readData(RESERVATIONS_FILE);
        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new reservation
router.post('/api/reservations', (req, res) => {
    try {
        const { name, email, phone, date, time, guests, tableId, specialRequests } = req.body;
        
        // Basic validation
        if (!name || !email || !date || !time || !tableId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Check table exists and is available
        const tables = readData(TABLES_FILE);
        const table = tables.find(t => t.id === tableId);
        
        if (!table) {
            return res.status(404).json({ error: 'Table not found' });
        }
        
        const reservations = readData(RESERVATIONS_FILE);
        const isTableReserved = reservations.some(
            r => r.tableId === tableId && r.date === date && r.time === time
        );
        
        if (isTableReserved) {
            return res.status(400).json({ error: 'Table already reserved for this time' });
        }
        
        // Create reservation
        const newReservation = {
            id: Date.now().toString(),
            name,
            email,
            phone,
            date,
            time,
            guests,
            tableId,
            specialRequests,
            createdAt: new Date().toISOString()
        };
        
        reservations.push(newReservation);
        writeData(RESERVATIONS_FILE, reservations);
        
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
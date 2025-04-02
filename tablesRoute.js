const express = require('express');
const router = express.Router();
const { TABLES_FILE, RESERVATIONS_FILE } = require('./app');
const { readData, writeData, initTables } = require('./dataUtils');

// Initialize tables data
initTables(TABLES_FILE);

// Get all tables
router.get('/api/tables', (req, res) => {
    try {
        const tables = readData(TABLES_FILE);
        
        // Check if we need to include reservation status
        if (req.query.date && req.query.time) {
            const reservations = readData(RESERVATIONS_FILE);
            const reservedTables = reservations
                .filter(r => r.date === req.query.date && r.time === req.query.time)
                .map(r => r.tableId);
                
            const tablesWithStatus = tables.map(table => ({
                ...table,
                reserved: reservedTables.includes(table.id)
            }));
            
            res.json(tablesWithStatus);
        } else {
            res.json(tables);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get tables by capacity
router.get('/api/tables/capacity/:size', (req, res) => {
    try {
        const tables = readData(TABLES_FILE);
        const capacity = parseInt(req.params.size);
        const filteredTables = tables.filter(table => table.capacity >= capacity);
        res.json(filteredTables);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Create data folder if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Data files
const TABLES_FILE = path.join(dataDir, 'tables.json');
const RESERVATIONS_FILE = path.join(dataDir, 'reservations.json');
const ORDERS_FILE = path.join(dataDir, 'orders.json');

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = { app, TABLES_FILE, RESERVATIONS_FILE, ORDERS_FILE };
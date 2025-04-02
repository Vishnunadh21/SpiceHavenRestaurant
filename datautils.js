const fs = require('fs');

// Helper functions for reading and writing data
function readData(filePath) {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initialize tables data if it doesn't exist
function initTables(filePath) {
    if (!fs.existsSync(filePath)) {
        const initialTables = [
            { id: 'T1', type: 'round-table', capacity: 2, location: 'Window' },
            { id: 'T2', type: 'round-table', capacity: 2, location: 'Near Bar' },
            { id: 'T3', type: 'round-table', capacity: 4, location: 'Main Hall' },
            { id: 'T4', type: 'round-table', capacity: 4, location: 'Rooftop' },
            { id: 'T5', type: 'large-table', capacity: 6, location: 'Private Corner' },
            { id: 'T6', type: 'large-table', capacity: 8, location: 'Main Hall' }
        ];
        writeData(filePath, initialTables);
    }
}

module.exports = { readData, writeData, initTables };